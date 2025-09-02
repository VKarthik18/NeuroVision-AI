import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import os


# 1. Load the saved model

model = tf.keras.models.load_model("mri_cnn_model.h5")
# 2. Load a single test image

img_path = "30.jpeg"  # change this

img_height, img_width = 128, 128  # same size as used in training

img = tf.keras.utils.load_img(img_path, target_size=(img_height, img_width))
img_array = tf.keras.utils.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0  # normalize
# 3. Make prediction

predictions = model.predict(img_array)
predicted_class = np.argmax(predictions[0])

# If you have class names from training, provide them here:
class_names = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"]

print("Predicted Class:", class_names[predicted_class])
print("Confidence Scores:", predictions[0])
# 4. Show image + prediction

plt.imshow(img)
plt.title(f"Prediction: {class_names[predicted_class]}")
plt.axis("off")
plt.show()