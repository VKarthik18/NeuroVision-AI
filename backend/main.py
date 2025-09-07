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
