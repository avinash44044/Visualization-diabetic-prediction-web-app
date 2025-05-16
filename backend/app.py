from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = pickle.load(open('C:/Users/avinash/OneDrive/Desktop/html/diabities/backend/trained_model.sav', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = np.asarray([
        data['pregnancies'],
        data['glucose'],
        data['bloodpressure'],
        data['skinthickness'],
        data['insulin'],
        data['bmi'],
        data['dpf'],
        data['age']
    ]).reshape(1, -1)

    prediction = model.predict(input_data)
    result = 'Diabetic' if prediction[0] == 1 else 'Not Diabetic'
    
    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
