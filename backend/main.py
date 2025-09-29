# Add this with your other imports at the top
# We only need QUESTION_DESCRIPTIONS and ANSWER_MAP for the new logic
from report_logic import QUESTION_DESCRIPTIONS, ANSWER_MAP # Add the new import
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
import joblib
import json
import os
from PIL import Image

app = FastAPI(title="Alzheimer’s Prediction Service")

# ---------------------------
# CORS
# ---------------------------
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------
# Load models & encoders
# ---------------------------
cnn_model = load_model(os.path.join(os.path.dirname(__file__), "models/cnn/mri_cnn_model.h5"))
rnn_model = load_model(os.path.join(os.path.dirname(__file__), "models/rnn/alz_rnn_model.h5"))
encoders = joblib.load(os.path.join(os.path.dirname(__file__), "models/rnn/encoders.pkl"))

# Unified 4-class labels
class_labels = ["Mild", "Moderate", "Normal", "Severe"]

# ---------------------------
# RNN questions template
# ---------------------------
rnn_questions_template = {
    "Q1_Memory": "string",
    "Q2_Orientation": "string",
    "Q3_Cognitive": "string",
    "Q4_Language": "string",
    "Q5_ADLs": "string",
    "Q6_Behavior": "string",
    "Q7_Caregiver": "string",
    "Q8_Memory": "string",
    "Q9_Orientation": "string",
    "Q10_ADLs": "string"
}

@app.get("/")
async def root():
    return {
        "service": "NeuroVision AI Backend Server",
        "description": "Multimodal Alzheimer’s prediction service powered by CNN + RNN models.",
        "available_endpoints": {
            "/cnn": "MRI image classification",
            "/rnn": "Questionnaire-based cognitive assessment",
            "/multimodal": "Combined MRI + Questionnaire prediction"
        },
        "status": "running"
    }

# ---------------------------
# RNN Endpoint
# ---------------------------
@app.post("/rnn")
async def predict_rnn(user_data: dict = None):
    """
    Returns RNN prediction (Normal, Mild, Moderate, Severe).
    If user_data is None, returns default questions template.
    """
    answers = rnn_questions_template.copy()
    if user_data:
        for k in answers:
            if k in user_data:
                answers[k] = user_data[k]

    # Encode answers
    encoded_answers = []
    for col, le in encoders.items():
        if col == "Stage":
            continue
        value = answers[col]
        if value not in le.classes_:
            encoded_answers.append(0)
        else:
            encoded_answers.append(le.transform([value])[0])

    encoded_answers = np.array(encoded_answers).reshape(1, len(encoded_answers), 1)

    probabilities = rnn_model.predict(encoded_answers, verbose=0)[0]
    predicted_index = np.argmax(probabilities)
    predicted_class = class_labels[predicted_index]

    return {
        "predicted_stage": predicted_class,
        "probabilities": [float(f"{p:.6f}") for p in probabilities],
        "questions": answers
    }

# ---------------------------
# CNN Endpoint
# ---------------------------
@app.post("/cnn")
async def predict_cnn(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = cnn_model.predict(img_array, verbose=0)[0]

    if len(preds) != len(class_labels):
        raise HTTPException(status_code=500, detail=f"CNN model must output {len(class_labels)} probabilities")

    predicted_index = np.argmax(preds)
    predicted_class = class_labels[predicted_index]

    return JSONResponse({
        "predicted_stage": predicted_class,
        "probabilities": [float(f"{p:.6f}") for p in preds]
    })

# ---------------------------
# Multimodal CNN+RNN Endpoint
# ---------------------------
@app.post("/multimodal")
async def predict_multimodal(
    file: UploadFile = File(...),
    user_data: str = Form(...)
):
    try:
        # --- CNN prediction ---
        img = Image.open(file.file).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        cnn_preds = cnn_model.predict(img_array, verbose=0)[0]

        if len(cnn_preds) != len(class_labels):
            raise HTTPException(status_code=500, detail=f"CNN model must output {len(class_labels)} probabilities")

        # --- RNN prediction ---
        answers = json.loads(user_data)
        encoded_answers = []
        for col, le in encoders.items():
            if col == "Stage":
                continue
            value = answers.get(col, "string")
            if value not in le.classes_:
                encoded_answers.append(0)
            else:
                encoded_answers.append(le.transform([value])[0])

        encoded_answers = np.array(encoded_answers).reshape(1, len(encoded_answers), 1)
        rnn_preds = rnn_model.predict(encoded_answers, verbose=0)[0]

        if len(rnn_preds) != len(class_labels):
            raise HTTPException(status_code=500, detail=f"RNN model must output {len(class_labels)} probabilities")

        # --- Average predictions ---
        avg_probs = (cnn_preds + rnn_preds) / 2
        predicted_index = np.argmax(avg_probs)
        predicted_class = class_labels[predicted_index]

        return {
            "final_predicted_stage": predicted_class,
            "final_probabilities": [float(f"{p:.6f}") for p in avg_probs],
            "cnn_probabilities": [float(f"{p:.6f}") for p in cnn_preds],
            "rnn_probabilities": [float(f"{p:.6f}") for p in rnn_preds],
            "questions": answers
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ------------------------------------
# AI-Generated Qualitative Report Endpoint
# ------------------------------------
# In backend/main.py, update your import at the top
from report_logic import QUESTION_DESCRIPTIONS, ANSWER_MAP # Use the new import

# ... (rest of your main.py file) ...

# Replace your existing endpoint with this updated version
@app.post("/generate-report")
async def generate_qualitative_report(user_data: dict):
    try:
        user_answers = user_data.get('answers', [])
        if not user_answers:
            raise HTTPException(status_code=400, detail="No answers provided.")

        concerning_questions = []
        # Loop through answers and flag questions with Mild or Significant difficulty
        for item in user_answers:
            q_id = item.get('qId'); answer = item.get('answer')
            difficulty = ANSWER_MAP.get(q_id, {}).get(answer, "No Difficulty")
            if difficulty in ["Mild Difficulty", "Significant Difficulty"]:
                concerning_questions.append(q_id)
        
        # Build the report string
        if not concerning_questions:
            report_text = "Based on your responses, no specific areas of difficulty were identified."
        else:
            report_text = "Based on your responses, the following areas may warrant further attention:\n\n"
            for q_id in sorted(list(set(concerning_questions))): # Use sorted(list(set(...))) to get unique, ordered questions
                if q_id in QUESTION_DESCRIPTIONS:
                    report_text += f"{QUESTION_DESCRIPTIONS[q_id]}\n\n"
        
        # UPDATED DISCLAIMER TEXT
        report_text += "### IMPORTANT DISCLAIMER\n**This is not a medical diagnosis and should not be considered a substitute for a professional medical evaluation. The purpose of this tool is for informational screening only. Please consult with a qualified healthcare provider for any health concerns or before making any medical decisions.**"

        return {"report": report_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))