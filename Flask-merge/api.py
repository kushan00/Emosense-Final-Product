from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import nltk
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
from flask_cors import CORS, cross_origin

app = Flask(_name_)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from your frontend domain

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

# Define a route for fetching random therapy recommendations based on stress level
@cross_origin()
@app.route('/therapy/random/<stress_level>', methods=['GET'])
def get_random_therapy(stress_level):
    # You can implement logic here to fetch a random therapy recommendation
    # based on the provided stress level (e.g., low-normal, medium, high, etc.)
    
    # Replace this example with your actual logic to retrieve therapy recommendations
    therapy_recommendation = "Example Therapy Recommendation"
    benefits = "Example Benefits of Therapy"
    
    response = {
        'therapy': therapy_recommendation,
        'benefits': benefits
    }
    
    return jsonify(response)

if _name_ == '_main_':
    app.run(debug=True)