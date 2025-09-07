import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

import os
BASE_DIR = os.path.dirname(__file__)
df = pd.read_csv(os.path.join(BASE_DIR, "training_dataset.csv"))

# ==========================
# Step 2: Encode Features
# ==========================
encoders = {}
for col in df.columns[1:-1]:  # Skip Patient_ID and Stage
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Encode Stage separately
stage_encoder = LabelEncoder()
df["Stage"] = stage_encoder.fit_transform(df["Stage"])
encoders["Stage"] = stage_encoder

# Save encoders
with open("encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

# ==========================
# Step 3: Train-Test Split
# ==========================
X = df.drop(["Patient_ID", "Stage"], axis=1).values
y = df["Stage"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==========================
# Step 4: Define RNN Model
# ==========================
model = Sequential([
    Embedding(input_dim=np.max(X)+1, output_dim=16, input_length=X.shape[1]),
    LSTM(32, return_sequences=False),
    Dense(16, activation="relu"),
    Dense(len(stage_encoder.classes_), activation="softmax")
])

model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# ==========================
# Step 5: Train Model
# ==========================
early_stop = EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)

history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=15,
    batch_size=32,
    callbacks=[early_stop],
    verbose=1
)

# ==========================
# Step 6: Evaluate Model
# ==========================
loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Test Accuracy: {acc:.2f}")

# ==========================
# Step 7: Save Model
# ==========================
model.save("alz_rnn_model.h5")
print("✅ Model saved as alz_rnn_model.h5")
print("✅ Encoders saved as encoders.pkl")
