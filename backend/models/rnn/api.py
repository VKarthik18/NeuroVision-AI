from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from tensorflow.keras.models import load_model
import joblib
import os

app = FastAPI(title="RNN Alzheimer’s API")

# ---------------------------
# Load model & encoders
# ---------------------------
BASE_DIR = os.path.dirname(__file__)
rnn_model = load_model(os.path.join(BASE_DIR, "alz_rnn_model.h5"))
encoders = joblib.load(os.path.join(BASE_DIR, "encoders.pkl"))

# Use the same Stage encoder from training
stage_encoder = encoders["Stage"]

# ---------------------------
# Pydantic model
# ---------------------------
class PatientAnswers(BaseModel):
    Q1_Memory: str = "string"
    Q2_Orientation: str = "string"
    Q3_Cognitive: str = "string"
    Q4_Language: str = "string"
    Q5_ADLs: str = "string"
    Q6_Behavior: str = "string"
    Q7_Caregiver: str = "string"
    Q8_Memory: str = "string"
    Q9_Orientation: str = "string"
    Q10_ADLs: str = "string"

# ---------------------------
# Prediction endpoint
# ---------------------------
@app.post("/predict")
def predict_stage(data: PatientAnswers):
    """
    Accepts answers to 10 questions.
    Returns predicted stage and probabilities.
    """
    try:
        # Convert Pydantic model to dict
        answers = data.dict()

        # Encode answers using LabelEncoders
        encoded_answers = []
        for col, le in encoders.items():
            if col == "Stage":
                continue
            value = answers[col]

            # ✅ Strict validation (same as predict.py)
            if value not in le.classes_:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid answer '{value}' for {col}. "
                           f"Available options are: {list(le.classes_)}"
                )

            encoded_value = le.transform([value])[0]
            encoded_answers.append(encoded_value)

        # Reshape for RNN input
        encoded_answers = np.array(encoded_answers).reshape(1, len(encoded_answers), 1)

        # Model prediction
        probabilities = rnn_model.predict(encoded_answers, verbose=0)[0]

        # Map predicted index to actual Stage using encoder
        predicted_index = np.argmax(probabilities)
        predicted_class = stage_encoder.inverse_transform([predicted_index])[0]

        return {
            "predicted_stage": predicted_class,
            "probabilities": [float(f"{p:.6f}") for p in probabilities],
            "questions": answers,
            "note": "Replace 'string' with real answers to get accurate prediction"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
