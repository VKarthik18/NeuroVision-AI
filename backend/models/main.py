from fastapi import FastAPI
from models.cnn import api as cnn_api
from models.rnn import api as rnn_api
from models.multimodal import api as multimodal_api

app = FastAPI(title="NeuroVision-AI")

# Register routers
app.include_router(cnn_api.router, prefix="/cnn", tags=["CNN"])
app.include_router(rnn_api.router, prefix="/rnn", tags=["RNN"])
app.include_router(multimodal_api.router, prefix="/multimodal", tags=["Multimodal"])

@app.get("/")
def root():
    return {"message": "NeuroVision-AI Backend Running"}
