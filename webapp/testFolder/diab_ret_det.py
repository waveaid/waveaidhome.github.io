list_images_preprocess = []
for i in range(0,5):
  img_file_path = "/content/drive/My Drive/diabetic_retinopathy_detection/rescaled_train_896/train/{}".format(i)

  from os import listdir
  from os.path import isfile, join
  drivefiles = [f for f in listdir(img_file_path) if isfile(join(img_file_path, f))]
  img = drivefiles[:4]
  list_images_preprocess.append(img)

  ##########################################################################

import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np


def getImage(input_image):
  input_arr_mod = tf.image.adjust_brightness(input_image, delta=100)
  input_arr_mod = tf.image.adjust_saturation(input_arr_mod, 2.5)
  input_arr_mod = tf.image.adjust_gamma(input_arr_mod, gamma=1, gain=0.5)
  input_arr_mod = tf.image.adjust_contrast(input_arr_mod, 20)#20
  input_arr_mod = tf.image.adjust_saturation(input_arr_mod, 2.5)
  input_arr_mod = tf.image.adjust_contrast(input_arr_mod, -0.8)
  input_arr_mod = tf.image.adjust_saturation(input_arr_mod, -0.5)
  return input_arr_mod

plt.figure()
f, axarr = plt.subplots(5,4,figsize=(15,15)) 
for i in range(0,5):
  for j in range(0,4):
    image = tf.keras.preprocessing.image.load_img(main_fetch_path+"/"+str(i)+"/"+list_images_preprocess[i][j],color_mode="rgb", target_size=(600,800))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    axarr[i,j].imshow(tf.keras.preprocessing.image.array_to_img(getImage(input_arr)))
    axarr[i,j].axis("off")
    
