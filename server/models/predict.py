# # !pip install tensorflow
# # !pip install tensorflow-hub

# import sys
# import numpy as np
# import tensorflow as tf
# import tensorflow_hub as hub
# import tf_keras
# import os
# import json
# import os

# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 


# global model4
# model_path =   os.path.join(os.path.dirname(_file_), 'model4.h5') ;
# model4 = tf_keras.models.load_model(model_path, custom_objects={'KerasLayer': hub.KerasLayer})

# # Labels
# unique_labels = ['freshapples', 'freshbanana', 'freshbittergroud', 'freshcapsicum', 'freshcucumber', 'freshokra',
#                  'freshoranges', 'freshpotato', 'freshtomato', 'rottenapples', 'rottenbanana', 'rottenbittergroud',
#                  'rottencapsicum', 'rottencucumber', 'rottenokra', 'rottenoranges', 'rottenpotato', 'rottentomato']

# # Image size
# Img_size = 224

# # Image processing function
# def process_image(image_path, image_size=Img_size):
#     image = tf.io.read_file(image_path)
#     image = tf.image.decode_jpeg(image, channels=3)
#     image = tf.image.convert_image_dtype(image, tf.float32)
#     image = tf.image.resize(image, size=[image_size, image_size])
#     return image

# # Create test data batch
# def Create_data_batches(x, y=None, batch_size=32, val_data=False, test_data=False):
#     if test_data:
#         # print("Creating Test Data batches...")
#         data = tf.data.Dataset.from_tensor_slices((tf.constant(x)))
#         data = data.map(process_image)
#         data_batch = data.batch(batch_size)
#         return data_batch
#     elif val_data:
#         # print("Creating Validation Data batches...")
#         data = tf.data.Dataset.from_tensor_slices((tf.constant(x), tf.constant(y)))
#         data = data.map(get_image_and_label)
#         data_batch = data.batch(batch_size)
#         return data_batch
#     else:
#         # print("Creating Training Data batches...")
#         data = tf.data.Dataset.from_tensor_slices((tf.constant(x), tf.constant(y)))
#         data = data.shuffle(buffer_size=len(x))
#         data = data.map(get_image_and_label)
#         data_batch = data.batch(batch_size)
#         return data_batch

# # Get the predicted label from probabilities
# def get_predicted_label(prediction_probs):
#     return unique_labels[np.argmax(prediction_probs)]

    
# # Create test data

# def handle_inference(image_path):
#    filenames = [] ;
#    filenames.append(image_path) ;
#    filenames = np.array(filenames)
   
#    Test_data = Create_data_batches(filenames, test_data=True)
#    pred = model4.predict(Test_data,verbose=0) ;
   
     
#    # Get label
#    pred_label = get_predicted_label(pred)
   
#    # Output the predicted label
#    return pred_label


# for line in sys.stdin:
#     request = json.loads(line)
#     image_path = request['data']
#     sys.stdout.write(json.dumps(image_path) + '\n') ;
#     continue ;
#     result = handle_inference(image_path)
#     sys.stdout.write(json.dumps(result) + '\n')
#     sys.stdout.flush()