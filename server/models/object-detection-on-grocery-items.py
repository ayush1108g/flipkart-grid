# Install Ultralytics
# !pip install ultralytics

import ultralytics

from ultralytics import YOLO
import sys
import json
import torch
import os

def run_inference(image_path):
    # Load the model
    model_path = os.path.join(os.path.dirname(__file__), 'modelCount.pt') 
    model = YOLO(model_path)

    # Run inference
    results = model.predict(source=image_path, save=False, show=False)

    # Initialize a dictionary to count instances by class
    class_counts = {}

    # Process results
    for result in results:
        # Get the classes of detected boxes
        classes = result.boxes.cls.tolist()  # Get class indices of detected boxes

        # Count instances for each class
        for class_id in classes:
            class_name = model.names[int(class_id)]  # Get class name from the class ID
            class_counts[class_name] = class_counts.get(class_name, 0) + 1

    # Return results as a JSON object
    return class_counts

if __name__ == "__main__":
    image_path = sys.argv[1]  # The path to the image file
    class_counts = run_inference(image_path)
    # print(class_counts)
    print(json.dumps(class_counts))  # Output the result as JSON