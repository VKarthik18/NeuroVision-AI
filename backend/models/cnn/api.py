from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image

app = FastAPI()

# Load your trained model
cnn_model = load_model("mri_cnn_model.h5")

# Define class labels
class_labels = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"]

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Load image
    img = Image.open(file.file).convert("RGB")  # ensure 3 channels
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # shape (1,128,128,3)

    # Make prediction
    preds = cnn_model.predict(img_array)
    predicted_index = np.argmax(preds[0])
    predicted_class = class_labels[predicted_index]

    return JSONResponse({
        "prediction": preds.tolist(),
        "predicted_class": predicted_class
    })
