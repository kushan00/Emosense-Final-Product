from flask import Flask, request, jsonify
import requests
from datetime import datetime, timedelta
from langdetect import detect
import urllib.request
import random
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from flask_cors import CORS, cross_origin
from sklearn.svm import SVC
from textblob import TextBlob 
from werkzeug.utils import secure_filename
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
from fastai.vision.all import *
from PIL import Image
import numpy as np
import base64
from io import BytesIO
import json
import logging
import cv2
import numpy as np
from keras.models import model_from_json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pickle
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd
import time
import joblib


#text claning
import re
from langdetect import detect
from nltk.corpus import stopwords

emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

nltk.download('vader_lexicon')  # Download the VADER lexicon

# Initialize the sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Download necessary NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')

# Function for text preprocessing
def preprocess_text(text):
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Convert to lowercase
    text = text.lower()

    # Tokenize the text
    tokens = text.split()

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # Join the tokens back into a single string
    preprocessed_text = ' '.join(tokens)

    return preprocessed_text

# Load the stress dataset
df = pd.read_csv('Stress.csv')  # Replace with the path to the downloaded dataset

# Preprocess the text data
df['text'] = df['text'].apply(preprocess_text)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test, sentence_range_train, sentence_range_test = train_test_split(
    df['text'], df['label'], df['sentence_range'], test_size=0.2, random_state=42
)

# Vectorize the preprocessed text data using TF-IDF vectorizer
vectorizer = TfidfVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)

# Train an SVM classifier for multi-class classification
model = SVC(decision_function_shape='ovr', probability=True)
model.fit(X_train_vectorized, y_train)

# Define the stress level mapping
stress_level_mapping = {
    0: "Neutral",
    1: "Stressed",
    # Add more stress levels as needed
}

# Load the trained models from .pkl files
with open('stress_model.pkl', 'rb') as stress_file:
    stress_model = pickle.load(stress_file)

with open('sleepefficiency_model.pkl', 'rb') as sleepefficiency_file:
    sleepefficiency_model = pickle.load(sleepefficiency_file)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'emotion'
api = Api(app)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)

@cross_origin()
@app.route('/get-music', methods=['POST'])
def submit():
    request_data = request.get_json()    

    if 'access_token' in request_data:
        access_token = request_data['access_token']
    else:
        return jsonify({'error': 'Access token not provided in the request.'}), 400
    
    # Check if the request contains an 'emotion'
    if 'emotion' in request_data:
        cam_emotion = request_data['emotion']
    else:
        return jsonify({'error': 'Emotion not provided in the request.'}), 400
    
    API_URL = f'https://graph.facebook.com/v12.0/me/feed?access_token={access_token}'
    response = requests.get(API_URL)
    data = response.json()

    global sadVal
    global joyVal
    global loveVal
    global fearVal
    global surpriseVal
    global angerVal

    joyVal = 0
    sadVal = 0
    loveVal = 0
    fearVal = 0
    surpriseVal = 0
    angerVal = 0
    emoCountList=[]

    if cam_emotion == 'happy':
        joyVal = joyVal + 2
    elif cam_emotion == 'sad':
        sadVal = sadVal + 2
    elif cam_emotion == 'love':
        loveVal += 2
    elif cam_emotion == 'surprise':
        surpriseVal += 2
    elif cam_emotion == 'angry':
        angerVal += 2
    elif cam_emotion == 'fear':
        fearVal += 2
    elif cam_emotion == 'disgust':
        angerVal += 2   
    elif cam_emotion == 'neutral':
        joyVal += 2

    if 'data' not in data:
        #handle the scenarion which posts not available
        emoCountList = [joyVal, sadVal, loveVal, surpriseVal, angerVal, fearVal]
    
        print('emoCountList')
        print(emoCountList)
    
        maximumVal = max(emoCountList)
        indexofMax = emoCountList.index(maximumVal)

        if indexofMax == 0:
            finalEmotion = "Joy"
            sentiment = 0
        elif indexofMax == 1:
            finalEmotion = "Sadness"   
            sentiment = 1     
        elif indexofMax == 2:
            finalEmotion = "Love"
            sentiment = 1
        elif indexofMax == 3:
            finalEmotion = "Surprise"
            sentiment = 0
        elif indexofMax == 4:
            finalEmotion = "Anger"
            sentiment = 1     
        elif indexofMax == 5:
            finalEmotion = "Fear"
            sentiment = 1

        song_name = getSong(sentiment)
        songUrl,videoId = getYoutubeLink(song_name)

        response = {
            'emotion' : finalEmotion,
            'song': songUrl,
            'videoId':videoId,
            'isWithFeedData': 'true',
            'songName': song_name
        }
        print("From no posts")
        print(response)

        return jsonify(response)

    data = data['data']
    # Get the current time
    current_time = datetime.utcnow()

    # Filter the elements based on the 'message' attribute and 'created_time' field
    filtered_posts = [
        item for item in data
        if 'message' in item and (current_time - datetime.fromisoformat(item['created_time'][:-5])) <= timedelta(hours=24)
    ]

    if not filtered_posts:
        return jsonify({'message': 'No posts found in last 24 hours.'}), 200

    
    for post in filtered_posts:

        postAsStr = post['message'] 
        postAsStr = clean_string(postAsStr) 

        #print(postAsStr)     

        sinhala_regex = re.compile('[\u0D80-\u0DFF]+')
        has_sinhala = sinhala_regex.search(postAsStr) is not None

        if has_sinhala:
            print("Sinhala Post")
            emotionSinhala = sinhalaPrediction(postAsStr)
            print(emotionSinhala)

            if emotionSinhala == 'joy':
                joyVal = joyVal + 1
            elif emotionSinhala == 'sadness':
                sadVal = sadVal + 1
            elif emotionSinhala == 'love':
                loveVal += 1
            elif emotionSinhala == 'surprise':
                surpriseVal += 1
            elif emotionSinhala == 'anger':
                angerVal += 1
            elif emotionSinhala == 'fear':
                fearVal += 1       
        
        else: 
            print("English Post")              
            emotionEnglish = englishPrediction(postAsStr)
            print(emotionEnglish)

            if emotionEnglish == 'happy':
                joyVal = joyVal + 1
            elif emotionEnglish == 'sadness':
                sadVal = sadVal + 1
            elif emotionEnglish == 'love':
                loveVal += 1
            elif emotionEnglish == 'surprise':
                surpriseVal += 1
            elif emotionEnglish == 'anger':
                angerVal += 1
            elif emotionEnglish == 'fear':
                fearVal += 1

       
    emoCountList = [joyVal, sadVal, loveVal, surpriseVal, angerVal, fearVal]

    print('emoCountList')
    print(emoCountList)
    
    maximumVal = max(emoCountList)
    indexofMax = emoCountList.index(maximumVal)

    if indexofMax == 0:
        finalEmotion = "Joy"
        sentiment = 0
    elif indexofMax == 1:
        finalEmotion = "Sadness"   
        sentiment = 1     
    elif indexofMax == 2:
        finalEmotion = "Love"
        sentiment = 1
    elif indexofMax == 3:
        finalEmotion = "Surprise"
        sentiment = 0
    elif indexofMax == 4:
        finalEmotion = "Anger"
        sentiment = 1     
    elif indexofMax == 5:
        finalEmotion = "Fear"
        sentiment = 1

    song_name = getSong(sentiment)
    print(song_name)
    songUrl,videoId = getYoutubeLink(song_name)

    response = {
        'emotion' : finalEmotion,
        'song': songUrl,
        'videoId':videoId,
        'isWithFeedData': 'true',
        'songName': song_name
    }

    return jsonify(response)  

# function to english prediction
def englishPrediction(postStr):

    englishModel = joblib.load("EnglishSavedModel/LR_Model/trained-model1.pkl")

    cv = joblib.load("EnglishSavedModel/LR_Model/count_vectorizer.pkl")

    text_vectorized = cv.transform([postStr])

    prediction = englishModel.predict(text_vectorized)

    return prediction

# function to sinhala prediction
def sinhalaPrediction(postStr):
    sinhalaModel = joblib.load("SinhalaSavedModel/LR_Model/logistic_regression_model_sinhala.pkl")

    cv = joblib.load("SinhalaSavedModel/LR_Model/count_vectorizer_sinhala.pkl")

    text_vectorized = cv.transform([postStr])

    prediction = sinhalaModel.predict(text_vectorized)

    return prediction

def getSong(desired_sentiment):

    # Load data from the dataset
    def load_data(fileName):
        with open(fileName) as file:
            content = file.read()
            return ast.literal_eval(content)

    # Load the dataset
    data = load_data('LyricsAnalyzer/training_original.txt')

    # Extract features and labels from the dataset
    lyrics = [entry['lyric'] for entry in data]
    song_names = [entry['name'] for entry in data]
    sentiments = [entry['sentiment'] for entry in data]

    # TF-IDF Vectorization
    tfidf_vectorizer = TfidfVectorizer()
    X_tfidf = tfidf_vectorizer.fit_transform(lyrics)

    # Train a Support Vector Machine (SVM) classifier
    clf = SVC(kernel='linear')
    clf.fit(X_tfidf, sentiments)

    # Function to retrieve a random song name based on sentiment analysis
    def retrieve_random_song_by_sentiment(desired_sentiment):
        # Create an empty list to store matching song names
        matching_song_names = []

        # Loop through the dataset and predict sentiment for each song
        for i in range(len(data)):
            song_lyrics = data[i]['lyric']
            predicted_sentiment = clf.predict(tfidf_vectorizer.transform([song_lyrics]))[0]

            # Use sentiment analysis to determine the sentiment polarity
            analysis = TextBlob(song_lyrics)
            sentiment_polarity = analysis.sentiment.polarity

            # You can customize the condition for matching sentiment based on polarity
            # Here, we're considering a positive sentiment if polarity is greater than 0
            if sentiment_polarity > 0 and predicted_sentiment == desired_sentiment:
                matching_song_names.append(song_names[i])

        # Select a random song name from the matching ones
        if matching_song_names:
            random_song_name = random.choice(matching_song_names)
            return random_song_name
        else:
            return "No songs found with the specified sentiment."

    if (desired_sentiment == 1):
        sentiment = "P"
    else :
        sentiment = "A"
        
    random_song_name = retrieve_random_song_by_sentiment(sentiment)

    return random_song_name
    
def is_english(text):
    try:
        lang = detect(text)
        return lang == 'en'
    except:
        return False
    
def clean_string(cleaned_text):
    # Remove special characters and symbols
    cleaned_text = re.sub(r'[^\w\s]', '', cleaned_text)
    # Remove extra spaces
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    # Remove specific words
    words_to_remove = ['I', 'am', 'a', 'an', 'i']
    cleaned_text = ' '.join(word for word in cleaned_text.split() if word.lower() not in words_to_remove)
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    cleaned_text = ' '.join(word for word in cleaned_text.split() if word.lower() not in stop_words)
    # remove emojis
    cleaned_text = re.sub(r':[a-z_]+:', '', cleaned_text)
    # remove the mentions
    cleaned_text = re.sub(r'@[A-Za-z0-9]+', '', cleaned_text)
    # remove the hashtags
    cleaned_text = re.sub(r'#', '', cleaned_text)  
    
    return cleaned_text
    
def getYoutubeLink(songName):
    #Get the recommended song name
    recommendedName = songName
    suggestedName = recommendedName.replace(" ", "+")

    #Create a search request to get the relevent songs from youtube
    htmlforS = urllib.request.urlopen("https://www.youtube.com/results?search_query=" + suggestedName)

    #Define the video link
    videoId = re.findall(r"watch\?v=(\S{11})", htmlforS.read().decode())
    songUrl="https://www.youtube.com/watch?v=" + videoId[0]

    #SongUrl consists with the youtube links
    return songUrl,videoId[0]


#face reconginiton emotion detection API CALL

# Load json and create model
json_file = open('./model/new/emotion_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
emotion_model = model_from_json(loaded_model_json)

# Load weights into the model
emotion_model.load_weights("./model/new/emotion_model.h5")
print("Loaded model from disk")

UPLOAD_FOLDER = 'uploads'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = (['png', 'jpg', 'jpeg'])

def is_allowed_filename(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@cross_origin()
@app.route('/detect-emotion', methods=['POST'])
def upload():
	print(request.files)    

	if 'file' not in request.files:		
		return {"emotion": "Image not found. file empty"}

	file = request.files['file']

	if file.filename == '':
		# resp = jsonify({'message': 'No file selected for uploading'})
		# resp.status_code = 400
	    return jsonify({'message': 'No file selected for uploading'}),400
        
	if file and is_allowed_filename(file.filename):
		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		path = UPLOAD_FOLDER + '/' + filename
                # img = Image.open(img_path)
		frame = cv2.imread(path)

		# Convert the image to grayscale
		gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

		# Find faces in the image
		face_detector = cv2.CascadeClassifier('./model/haarcascades/haarcascade_frontalface_default.xml')
		num_faces = face_detector.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)
    
    
		# Process each detected face
		for (x, y, w, h) in num_faces:
			cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (0, 255, 0), 4)
			roi_gray_frame = gray_frame[y:y + h, x:x + w]
			cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

			# Predict emotions
			emotion_prediction = emotion_model.predict(cropped_img)
			maxindex = int(np.argmax(emotion_prediction))
                        
			resp = jsonify({"emotion": emotion_dict[maxindex]})
			resp.status_code = 201
        
		return resp
	else:
		resp = jsonify({'message': 'Allowed file types are png, jpg, jpeg'})
		resp.status_code = 400
        #return jsonify({'message': 'Allowed file types are png, jpg, jpeg'}), 400 


#heart rate emotion detection API CALL for RandomForestClassifier_model

# Load the trained model from the PKL file
filename = './model/heart_rate_model/RandomForestClassifier_model.pkl'
with open(filename, 'rb') as file:
    loaded_model_random_forest = pickle.load(file)

# Function to predict emotion based on heart rate
def predict_emotion_random_forest(heart_rate):
    # Convert heart rate value to a NumPy array
    heart_rate_array = np.array(heart_rate)

    # Reshape the heart rate value to match the model's input shape
    heart_rate_reshaped = heart_rate_array.reshape(1, -1)

    # Predict the emotion using the loaded model
    predicted_emotion = loaded_model_random_forest.predict(heart_rate_reshaped)[0]

    return predicted_emotion


@app.route('/random-forest-heart-rate-predict-emotion', methods=['POST'])
def get_predicted_emotion_random_forest():
    try:
        data = request.get_json()
        heart_rate = data['heart_rate']
        print("Heart Rate is : ",heart_rate )
        
        predicted_emotion = predict_emotion_random_forest(heart_rate)
        
        response = {
            "user_heart_rate": heart_rate,
            "predicted_emotion": predicted_emotion
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    


#heart rate emotion detection API CALL for RandomForestClassifier_model


# Load the trained model from the PKL file
filename = './model/heart_rate_model/logistic_model.pkl'
with open(filename, 'rb') as file:
    loaded_model_logistic = pickle.load(file)

# Function to predict emotion based on heart rate
def predict_emotion_logistic(heart_rate):
    # Convert heart rate value to a NumPy array
    heart_rate_array = np.array(heart_rate)

    # Reshape the heart rate value to match the model's input shape
    heart_rate_reshaped = heart_rate_array.reshape(1, -1)

    # Predict the emotion using the loaded model
    predicted_emotion = loaded_model_logistic.predict(heart_rate_reshaped)[0]

    return predicted_emotion

@app.route('/logistic-model-heart-rate-predict-emotion', methods=['POST'])
def get_predicted_emotion_logistic():
    try:
        data = request.get_json()
        heart_rate = data['heart_rate']
        print("Heart Rate is : ",heart_rate )
        
        predicted_emotion = predict_emotion_logistic(heart_rate)
        
        response = {
            "user_heart_rate": heart_rate,
            "predicted_emotion": predicted_emotion
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


#Emotion Compare API CALL

@app.route('/compare_emotions', methods=['POST'])
def compare_emotions_api():
    try:
        # Get emotions from the request
        data = request.get_json()
        emotion1 = data['emotion1']
        emotion2 = data['emotion2']

        # Analyze the sentiment of both emotions
        sentiment1 = sid.polarity_scores(emotion1)
        sentiment2 = sid.polarity_scores(emotion2)

        # Determine which emotion has a higher sentiment score
        if sentiment1['compound'] > sentiment2['compound']:
            most_accurate_emotion = emotion1
        elif sentiment1['compound'] < sentiment2['compound']:
            most_accurate_emotion = emotion2
        else:
            most_accurate_emotion = "Both emotions are equally accurate"

        response = {'most_accurate_emotion': most_accurate_emotion}
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})


@cross_origin()
@app.route('/api/predict/stress', methods=['POST'])
def predict_stress():
    if request.method == 'POST':
        user_input = request.json.get('feedback', '')
        preprocessed_input = preprocess_text(user_input)
        user_input_vectorized = vectorizer.transform([preprocessed_input])

        predicted_label = model.predict(user_input_vectorized)[0]
        confidence = model.predict_proba(user_input_vectorized)[0][predicted_label]
        predicted_sentence_range = sentence_range_train.unique()[predicted_label]
        predicted_stress_level = stress_level_mapping[predicted_label]

        response = {
            'predicted_stress_level': predicted_stress_level,
            'predicted_sentence_range': predicted_sentence_range,
            'confidence': confidence
        }
        
        return jsonify(response)

@cross_origin()
@app.route('/predict/stresslevel', methods=['POST'])
def predict_stress_level():
    data = request.get_json()

    user_features = {}
    for feature in ['heartrate', 'Sleephours', 'Awakenings', 'Alcoholconsumption', 'Smokingstatus']:
        user_input = data.get(feature, '')
        if feature == 'Sleephours' or feature == 'Awakenings':
            user_features[feature] = float(user_input)
        elif feature == 'Smokingstatus':
            user_features[feature] = 1 if user_input.lower() == 'yes' else 0
        else:
            user_features[feature] = float(user_input)

    user_input = np.array([list(user_features.values())])

    predicted_stress = stress_model.predict(user_input)[0]
    predicted_stress_label = map_stress_to_label(predicted_stress)
    predicted_sleepefficiency = sleepefficiency_model.predict(user_input)[0]

    response = {
        'predicted_stress': predicted_stress_label,
        'predicted_sleepefficiency': predicted_sleepefficiency
    }

    return jsonify(response)

def map_stress_to_label(predicted_stress):
    stress_labels = ['low-normal', 'medium low', 'medium', 'medium high', 'high']
    return stress_labels[int(round(predicted_stress))]


#Endpoint to receive website data
@app.route('/classify', methods=['POST'])
def classify():
    model = joblib.load('website_classification_model.pkl')
    start_time = time.time()
    data = request.get_json()

    # Retrieve the website URL and cleaned text from the request data
    url = data.get('url')
    text = data.get('text')

    alltext = url + text
    # print(f"Request data is {alltext}")


    # # Wait for at least 15 seconds before processing the request
    # while time.time() - start_time < 15:
    #     time.sleep(1)

    # Call the website classification model
    category = model.predict([alltext])[0]

    return jsonify({'category': category})




if __name__ == '__main__':
    app.run(debug=True, threaded=True)