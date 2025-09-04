from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
from io import BytesIO
import os

router = APIRouter()

# ----- Resolve model path via os -----
BASE_DIR = os.path.dirname(__file__)
DEFAULT_CNN_MODEL = os.path.join(BASE_DIR, "mri_cnn_model.h5")
CNN_MODEL_PATH = os.getenv("CNN_MODEL_PATH", DEFAULT_CNN_MODEL)

if not os.path.isfile(CNN_MODEL_PATH):
    raise RuntimeError(f"CNN model file not found at: {CNN_MODEL_PATH}")

# Load model once
try:
    cnn_model = load_model(CNN_MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load CNN model at {CNN_MODEL_PATH}: {e}")

# Class labels
class_labels = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"]

def _prepare_image(file_bytes: bytes) -> np.ndarray:
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img = img.resize((128, 128))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)  # (1,128,128,3)

async def cnn_predict_fn(file: UploadFile) -> dict:
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty image file.")
    x = _prepare_image(file_bytes)
    preds = cnn_model.predict(x, verbose=0)
    idx = int(np.argmax(preds[0]))
    return {
        "probabilities": preds.tolist(),
        "predicted_index": idx,
        "predicted_class": class_labels[idx],
    }

@router.post("/predict")
async def cnn_predict(file: UploadFile = File(...)):
    result = await cnn_predict_fn(file)
    return JSONResponse(result)
