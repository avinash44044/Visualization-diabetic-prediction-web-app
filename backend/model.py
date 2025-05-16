import sys
import pickle
import numpy as np

# Load the trained model
model = pickle.load(open('C:/Users/avinash/OneDrive/Desktop/html/diabities/backend/trained_model.sav', 'rb'))

# Accept input data from Node.js
input_data = list(map(float, sys.argv[1:]))

# Check if input data is not empty and has the correct number of features (e.g., 8 features)
if len(input_data) == 8:
    # Prepare the data for prediction
    input_data_as_numpy_array = np.asarray(input_data)
    input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)

    # Make a prediction
    prediction = model.predict(input_data_reshaped)

    # Output the result
    result = 'Diabetic' if prediction[0] == 1 else 'Not Diabetic'
    print(result)
else:
    print("Error: Invalid input data. Expected 8 features but received", len(input_data))
