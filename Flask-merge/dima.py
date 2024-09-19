import os
from flask import *
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

emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

nltk.download('vader_lexicon')  # Download the VADER lexicon

# Initialize the sentiment analyzer
sid = SentimentIntensityAnalyzer()

app = Flask(__name__)
CORS(app,supports_credentials=True) 
api = Api(app)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)

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


if __name__ == "__main__":
    app.run(debug=True)