import tensorflow as tf
import numpy as np
from tensorflow import keras

import os

model = keras.models.load_model('number_check.h5');

img = keras.preprocessing.image.load_img(
    "a.png", target_size=(28,28)
)

img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)  # Create batch axis

predictions = model.predict(img_array)
print(predictions)