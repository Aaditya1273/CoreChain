import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle

def train_and_save_model():
    """Generates sample data, trains an IsolationForest model, and saves it."""
    print("Generating sample IoT data...")
    # Generate normal data: 1000 readings between 10 and 500 Wh
    normal_data = np.random.uniform(low=10.0, high=500.0, size=(1000, 1))
    
    # Generate anomalous data: 50 readings that are either too low or too high
    anomalous_data = np.concatenate([
        np.random.uniform(low=-50.0, high=5.0, size=(25, 1)),
        np.random.uniform(low=600.0, high=1000.0, size=(25, 1))
    ])
    
    # Combine into a single dataset
    X = np.concatenate([normal_data, anomalous_data])
    df = pd.DataFrame(X, columns=['energy_wh'])

    print("Training Isolation Forest model...")
    # The 'contamination' parameter is the expected proportion of outliers
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(df[['energy_wh']])

    # Save the trained model to a file
    model_filename = 'anomaly_model.pkl'
    with open(model_filename, 'wb') as file:
        pickle.dump(model, file)
    
    print(f"Model saved successfully as {model_filename}")

if __name__ == "__main__":
    train_and_save_model()
