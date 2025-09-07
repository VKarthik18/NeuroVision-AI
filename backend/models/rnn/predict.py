import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model

import os
BASE_DIR = os.path.dirname(__file__)
model = load_model(os.path.join(BASE_DIR, "alz_rnn_model.h5"))
encoders = joblib.load(os.path.join(BASE_DIR, "encoders.pkl"))

def predict_stage(patient_answers):
    """
    Predict the Alzheimer's stage for a given patient answers dict.
    Includes validation against available categories.
    """
    encoded_answers = []
    for col, le in encoders.items():
        if col == "Stage":  # Skip label encoder for target
            continue
        value = patient_answers[col]

        # ✅ Validation: Check if input value is allowed
        if value not in le.classes_:
            raise ValueError(
                f"Invalid answer '{value}' for {col}. "
                f"Available options are: {list(le.classes_)}"
            )

        encoded_value = le.transform([value])[0]
        encoded_answers.append(encoded_value)

    # Reshape for RNN: (batch, timesteps, features)
    encoded_answers = np.array(encoded_answers).reshape(1, len(encoded_answers), 1)

    # Prediction
    probabilities = model.predict(encoded_answers, verbose=0)[0]
    stage_index = np.argmax(probabilities)
    stage = encoders["Stage"].inverse_transform([stage_index])[0]

    return stage, probabilities

if __name__ == "__main__":
    # Example patient with VALID categories
    new_patient =   {
    "Q1_Memory": "Yes, clearly",
    "Q2_Orientation": "Yes",
    "Q3_Cognitive": "Yes",
    "Q4_Language": "Rarely",
    "Q5_ADLs": "Independent",
    "Q6_Behavior": "Rarely",
    "Q7_Caregiver": "Yes",
    "Q8_Memory": "Yes, all",
    "Q9_Orientation": "Yes",
    "Q10_ADLs": "Always"
  }

    # Print available categories for reference
    print("\n✅ Available categories for each question:")
    for col, le in encoders.items():
        print(f"{col}: {list(le.classes_)}")

    # Run prediction
    try:
        stage, probabilities = predict_stage(new_patient)
        print(f"\nPredicted Stage: {stage}")
        print(f"Probabilities: {probabilities}")
    except ValueError as e:
        print(f"\n❌ Input error: {e}")
