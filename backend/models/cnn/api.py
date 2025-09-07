from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

app = FastAPI(title="CNN Alzheimer’s API")

cnn_model = load_model("mri_cnn_model.h5")
class_labels = ["Mild", "Moderate", "Normal", "Severe"]

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = cnn_model.predict(img_array, verbose=0)[0]
    predicted_index = np.argmax(preds)
    predicted_class = class_labels[predicted_index]

    return JSONResponse({
        "predicted_class": predicted_class,
        "probabilities": [float(f"{p:.4f}") for p in preds],
        "note": "You can edit predicted_class or probabilities directly"
    })
