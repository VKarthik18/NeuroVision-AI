from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from tensorflow.keras.models import load_model

# Load RNN model & encoders
rnn_model = load_model("alz_rnn_model.h5")
encoders = joblib.load("encoders.pkl")

app = FastAPI(title="RNN Alzheimer’s API")

# Input schema
class PatientAnswers(BaseModel):
    Q1_Memory: str
    Q2_Orientation: str
    Q3_Cognitive: str
    Q4_Language: str
    Q5_ADLs: str
    Q6_Behavior: str
    Q7_Caregiver: str
    Q8_Memory: str
    Q9_Orientation: str
    Q10_ADLs: str

@app.post("/predict")
def predict_stage(data: PatientAnswers):
    try:
        encoded_answers = []
        for col, le in encoders.items():
            if col == "Stage":
                continue
            value = getattr(data, col)
            if value not in le.classes_:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for {col}. Allowed: {list(le.classes_)}"
                )
            encoded_answers.append(le.transform([value])[0])

        encoded_answers = np.array(encoded_answers).reshape(1, len(encoded_answers), 1)
        probabilities = rnn_model.predict(encoded_answers, verbose=0)[0]
        stage = encoders["Stage"].inverse_transform([np.argmax(probabilities)])[0]

        return {"predicted_stage": stage, "probabilities": probabilities.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
