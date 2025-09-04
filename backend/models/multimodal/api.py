from fastapi import APIRouter, UploadFile, File, Form
from typing import Dict
import numpy as np
from io import BytesIO
from PIL import Image

# Import your models and helpers
from ..cnn import cnn_model, class_labels   # adjust if cnn model is in a different path
from ..rnn import rnn_model, encode_answers

router = APIRouter()
@router.post("/predict_multimodal")
async def predict_multimodal(
    file: UploadFile = File(...),
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
) -> Dict:

    # --- CNN part ---
    file_bytes = await file.read()
    img = Image.open(BytesIO(file_bytes)).convert("RGB").resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    cnn_pred = cnn_model.predict(img_array)[0]

    # --- RNN part ---
    answers = [
        Q1_Memory, Q2_Orientation, Q3_Cognitive, Q4_Language,
        Q5_ADLs, Q6_Behavior, Q7_Caregiver, Q8_Memory,
        Q9_Orientation, Q10_ADLs
    ]
    rnn_input = encode_answers(answers)   # your function for encoding
    rnn_pred = rnn_model.predict(rnn_input)[0]

    # --- Fusion ---
    final_pred = (cnn_pred + rnn_pred) / 2
    final_label = class_labels[np.argmax(final_pred)]

    return {
        "cnn_prediction": class_labels[np.argmax(cnn_pred)],
        "rnn_prediction": class_labels[np.argmax(rnn_pred)],
        "final_prediction": final_label,
        "confidence_scores": final_pred.tolist()
    }