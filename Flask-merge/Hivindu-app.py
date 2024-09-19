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

#text claning
import re
from langdetect import detect
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.config['SECRET_KEY'] = 'emotion'

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
            'isWithFeedData': 'false'
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

        print(postAsStr)     

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
        'isWithFeedData': 'true'
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

if __name__ == '__main__':
    app.run(debug=True, threaded=True)