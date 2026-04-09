# NeuroVision-AI

A multimodal Alzheimer's prediction web application combining MRI image analysis (CNN) and cognitive assessment questionnaires (RNN).

## Overview
NeuroVision AI aims to provide a comprehensive, AI-powered screening tool for Alzheimer's disease. It uses a dual-model approach, fusing computer vision (MRI analysis) with structured cognitive data (questionnaire assessments) to predict the developmental stage of Alzheimer's: **Normal**, **Mild**, **Moderate**, and **Severe**.

## Project Structure
- `frontend/`: The user interface built with Next.js, React 19, and Tailwind CSS.
- `backend/`: The API service built with FastAPI, deploying TensorFlow models for CNN and RNN.
- `old/`: Previous iterations or backups of code assets.

## Core Features
- **MRI Analysis (CNN)**: Upload MRI scans to obtain stage predictions based on image features.
- **Cognitive Assessment (RNN)**: Answer a structured questionnaire to analyze memory, orientation, and cognitive abilities.
- **Multimodal Prediction**: Combine both MRI and questionnaire inputs for a more robust, blended evaluation.
- **Qualitative Reports**: Receive an auto-generated qualitative report highlighting potential areas of cognitive difficulty based on questionnaire responses.

## Setup & System Requirements

### Prerequisites
- **Node.js**: v18+ recommended (for frontend)
- **Python**: v3.8+ (for backend)

---

### Backend Setup (FastAPI / TensorFlow)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.*

---

### Frontend Setup (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Lucide React, Next Themes (Dark Mode support)
- **Backend**: FastAPI, Uvicorn, Python
- **Machine Learning**: TensorFlow/Keras, Scikit-Learn, Joblib, NumPy, Pillow
- **Models Used**: 
  - 2D Convolutional Neural Network (CNN) customized for MRI scan evaluations
  - Recurrent Neural Network (RNN) optimized for structured cognitive assessments

## ⚠️ Medical Disclaimer
**This application is not a medical diagnosis and should not be considered a substitute for a professional medical evaluation.** The purpose of this tool is strictly for informational screening and experimental AI research. Please consult with a qualified healthcare provider for any health concerns or before making any medical decisions.
