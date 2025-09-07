#IMPORTING LIBRARIES
import os, glob, random, math, re
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
layers = keras.layers
models = keras.models
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
from tqdm import tqdm
import cv2
import nibabel as nib

BASE_DIR = os.path.dirname(__file__)
dataset_path = os.path.join(BASE_DIR, "Alzheimer_s Dataset")
class_names = ["Normal", "Mild", "Moderate", "Severe"]
for root, dirs, files in os.walk(dataset_path):
    print(f"📂 {root} | Subfolders: {dirs} | Files: {len(files)}")

img_size = (128, 128)
batch_size = 32

#CREATING TRAIN AND VALIDATION DATASETS
train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=img_size,
    batch_size=batch_size
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=img_size,
    batch_size=batch_size
)

#PREFETCHING FOR PERFORMANCE
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

#LOADING DATASET
img_height, img_width = 128, 128
batch_size = 32

train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

#OPTIMIZE DATASET PERFORMANCE
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(500).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

#NORMALIZING DATASET
normalization_layer = layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

#BUILDING CNN MODEL
model = models.Sequential([
    tf.keras.Input(shape=(img_height, img_width, 3)),   # ✅ correct input layer
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(class_names), activation='softmax')  # ✅ fixed output classes
])

model.summary()

#COMPILING
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

#TRAINING THE MODEL
epochs = 10 # Define the number of epochs for training

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=epochs,
    verbose=1   # <-- you will see progress
)

#EVALUATION
loss, acc = model.evaluate(val_ds)
print(f"Validation Accuracy: {acc:.2f}")

#SAVING THE MODEL
# Save the model in H5 format
model.save("mri_cnn_model.h5")

# Save the model in native Keras format (recommended)
# Use .keras extension
model.save("mri_cnn_model.keras")





#PLOTTING TRAINING CURVES
plt.plot(history.history['val_accuracy'], label='val acc')
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='train loss')
plt.plot(history.history['val_loss'], label='val loss')
plt.legend()
plt.show()


#PREDICTIONS ON VALIDATION SET
y_true = []
y_pred = []

for images, labels in val_ds:
    preds = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(preds, axis=1))

y_true = np.array(y_true)
y_pred = np.array(y_pred)

# =======================
# 12. Confusion Matrix
# =======================
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=class_names, yticklabels=class_names)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()


#CLASSIFICATION REPORT
print("Classification Report:")
print(classification_report(y_true, y_pred, target_names=class_names))