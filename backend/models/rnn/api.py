from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
import joblib
import numpy as np
from tensorflow.keras.models import load_model
import os

router = APIRouter()

# ----- Resolve paths via os -----
BASE_DIR = os.path.dirname(__file__)
DEFAULT_RNN_MODEL = os.path.join(BASE_DIR, "alz_rnn_model.h5")
DEFAULT_ENCODERS = os.path.join(BASE_DIR, "encoders.pkl")

RNN_MODEL_PATH = os.getenv("RNN_MODEL_PATH", DEFAULT_RNN_MODEL)
ENCODERS_PATH = os.getenv("RNN_ENCODERS_PATH", DEFAULT_ENCODERS)

if not os.path.isfile(RNN_MODEL_PATH):
    raise RuntimeError(f"RNN model file not found at: {RNN_MODEL_PATH}")
if not os.path.isfile(ENCODERS_PATH):
    raise RuntimeError(f"Encoders file not found at: {ENCODERS_PATH}")

# Load once
try:
    rnn_model = load_model(RNN_MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)  # dict: { column_name: LabelEncoder }
except Exception as e:
    raise RuntimeError(f"Failed to load RNN resources: {e}")

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

def _normalize_answer(value: str, le) -> str:
    # Case-insensitive exact match to a known class (no logic change to model; just lenient matching)
    for cls in le.classes_:
        if value.strip().lower() == str(cls).strip().lower():
            return cls
    return value  # let validation handle mismatch

def rnn_predict_core(answers: PatientAnswers) -> dict:
    try:
        encoded = []
        for col, le in encoders.items():
            if col == "Stage":
                continue
            val = getattr(answers, col)
            val = _normalize_answer(val, le)
            if val not in le.classes_:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{val}' for {col}. Allowed: {list(map(str, le.classes_))}"
                )
            encoded.append(le.transform([val])[0])

        x = np.array(encoded).reshape(1, len(encoded), 1)
        probs = rnn_model.predict(x, verbose=0)[0]
        stage_idx = int(np.argmax(probs))
        stage = encoders["Stage"].inverse_transform([stage_idx])[0]
        return {"predicted_stage": str(stage), "probabilities": probs.tolist()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RNN prediction failed: {e}")

@router.post("/predict")
def rnn_predict(answers: PatientAnswers):
    return rnn_predict_core(answers)

# Form-friendly endpoint (UI sends multipart/form-data)
@router.post("/predict_form")
def rnn_predict_form(
    Q1_Memory: str = Form(...),
    Q2_Orientation: str = Form(...),
    Q3_Cognitive: str = Form(...),
    Q4_Language: str = Form(...),
    Q5_ADLs: str = Form(...),
    Q6_Behavior: str = Form(...),
    Q7_Caregiver: str = Form(...),
    Q8_Memory: str = Form(...),
    Q9_Orientation: str = Form(...),
    Q10_ADLs: str = Form(...)
):
    answers = PatientAnswers(
        Q1_Memory=Q1_Memory,
        Q2_Orientation=Q2_Orientation,
        Q3_Cognitive=Q3_Cognitive,
        Q4_Language=Q4_Language,
        Q5_ADLs=Q5_ADLs,
        Q6_Behavior=Q6_Behavior,
        Q7_Caregiver=Q7_Caregiver,
        Q8_Memory=Q8_Memory,
        Q9_Orientation=Q9_Orientation,
        Q10_ADLs=Q10_ADLs,
    )
    return rnn_predict_core(answers)

# Helper alias for multimodal
rnn_predict_fn = rnn_predict_core
