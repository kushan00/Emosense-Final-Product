from flask import Flask, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load the trained models from .pkl files
with open('stress_model.pkl', 'rb') as stress_file:
    stress_model = pickle.load(stress_file)

with open('sleepefficiency_model.pkl', 'rb') as sleepefficiency_file:
    sleepefficiency_model = pickle.load(sleepefficiency_file)

# Map numerical Stresslevel back to labels
stress_labels = ['low-normal', 'medium low', 'medium', 'medium high', 'high']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    user_input = []
    for feature in ['heartrate', 'Sleephours', 'Awakenings', 'Alcoholconsumption', 'Smokingstatus']:
        if feature == 'Smokingstatus':
            user_smokingstatus = 1 if data[feature] == 'Yes' else 0
            user_input.append(user_smokingstatus)
        else:
            user_input.append(float(data[feature]))

    user_input = np.array([user_input])

    predicted_stress = stress_model.predict(user_input)[0]
    predicted_stress_label = stress_labels[np.argmax(np.histogram(predicted_stress, bins=len(stress_labels))[0])]

    predicted_sleepefficiency = sleepefficiency_model.predict(user_input)[0]

    response = {
        'predicted_stress': predicted_stress_label,
        'predicted_sleepefficiency': predicted_sleepefficiency
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
