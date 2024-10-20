# !pip install tensorflow
# !pip install tensorflow-hub

import sys
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tf_keras
import os
import json
import ultralytics
from ultralytics import YOLO
import torch


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 





model_path1 = os.path.join(os.path.dirname(__file__), 'modelCount.pt');
model = YOLO(model_path1)

global model4
model_path =   os.path.join(os.path.dirname(__file__), 'model4.h5') ;
model4 = tf_keras.models.load_model(model_path, custom_objects={'KerasLayer': hub.KerasLayer})


unique_labels = ['freshapples', 'freshbanana', 'freshbittergroud', 'freshcapsicum', 'freshcucumber', 'freshokra',
                 'freshoranges', 'freshpotato', 'freshtomato', 'rottenapples', 'rottenbanana', 'rottenbittergroud',
                 'rottencapsicum', 'rottencucumber', 'rottenokra', 'rottenoranges', 'rottenpotato', 'rottentomato']

Img_size = 224


def process_image(image_path, image_size=Img_size):
    image = tf.io.read_file(image_path)
    image = tf.image.decode_jpeg(image, channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32)
    image = tf.image.resize(image, size=[image_size, image_size])
    return image


def Create_data_batches(x, y=None, batch_size=32, val_data=False, test_data=False):
    if test_data:
        
        data = tf.data.Dataset.from_tensor_slices((tf.constant(x)))
        data = data.map(process_image)
        data_batch = data.batch(batch_size)
        return data_batch
    elif val_data:
       
        data = tf.data.Dataset.from_tensor_slices((tf.constant(x), tf.constant(y)))
        data = data.map(get_image_and_label)
        data_batch = data.batch(batch_size)
        return data_batch
    else:
        
        data = tf.data.Dataset.from_tensor_slices((tf.constant(x), tf.constant(y)))
        data = data.shuffle(buffer_size=len(x))
        data = data.map(get_image_and_label)
        data_batch = data.batch(batch_size)
        return data_batch


def get_predicted_label(prediction_probs):
    return unique_labels[np.argmax(prediction_probs)]

    






def handle_inference(image_path):
   filenames = [] ;
   filenames.append(image_path) ;
   filenames = np.array(filenames)
   
   Test_data = Create_data_batches(filenames, test_data=True)
   pred = model4.predict(Test_data,verbose=0) ;
   
     
   
   pred_label = get_predicted_label(pred) ; 

   #scale  = pred.max() ;

   if(pred_label[0]=='f'):
       pred_label = 'Fresh' 
   else:
       pred_label = 'Rotten' 
   
   
   return { "Status" : pred_label } 


def run_inference(image_path):

   
    
    results = model.predict(source=image_path, save=False, show=False,verbose = False) 


    class_counts = {}

   
    for result in results:
       
        classes = result.boxes.cls.tolist() 

       
        for class_id in classes:
            class_name = model.names[int(class_id)]  
            class_counts[class_name] = class_counts.get(class_name, 0) + 1


    return class_counts


for line in sys.stdin:
    request = json.loads(line) 
    image_path = request['data']
    result1 = handle_inference(image_path)
    result2 = run_inference(image_path)
    final = {"Result1": result1, "Result2":result2} 
    sys.stdout.write(json.dumps(final) + '\n')
    sys.stdout.flush()