# This is a simplified anomaly detector.
# A real-world implementation would use more sophisticated statistical models or machine learning.

import pickle
import pandas as pd
from pathlib import Path
from .models import IoTData

# Load the trained Isolation Forest model
MODEL_PATH = Path(__file__).parent / "anomaly_model.pkl"
with open(MODEL_PATH, 'rb') as file:
    model = pickle.load(file)

def is_anomaly(data: IoTData) -> bool:
    """
    Uses a trained Isolation Forest model to detect anomalies in IoT data.
    """
    # Create a DataFrame from the input data for the model
    input_df = pd.DataFrame([data.dict()])
    
    # The model's predict method returns -1 for anomalies and 1 for inliers
    prediction = model.predict(input_df[['energy_wh']])
    
    # If prediction is -1, it's an anomaly
    return prediction[0] == -1

    return False
