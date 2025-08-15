# AI Fraud Detection Module

## 1. Overview

The AI Fraud Detection module is a core security component of the CoreChain Climate Network. Its primary function is to analyze incoming IoT data in real-time to identify and flag anomalies, malicious activities, and fraudulent data submissions. This ensures the integrity of the data used for carbon credit verification and staking rewards.

## 2. Machine Learning Pipeline

```
+-----------------+      +--------------------+      +--------------------+      +-----------------+
| Real-time Data  |----->| Data Preprocessing |----->| Feature            |----->| Model Inference |
| (from Kafka)    |      | & Validation       |      | Engineering        |      | (Real-time)     |
+-----------------+      +---------+----------+      +---------+----------+      +--------+--------+
                                   |                         |                         |
                                   v                         v                         v
                       +-----------+----------+  +-----------+----------+      +--------+--------+
                       | Historical Data      |  | Feature Store        |      | Fraud Score     |
                       | (for training)       |  | (for consistency)    |      | & Alerting      |
                       +----------------------+  +----------------------+      +-----------------+
```

### Pipeline Stages:

1.  **Data Ingestion**: The module consumes the validated data stream from the `iot-ingestion` service via a dedicated Kafka topic.
2.  **Preprocessing**: Data is cleaned, normalized, and checked for inconsistencies.
3.  **Feature Engineering**: Relevant features are extracted from the raw data. Examples include:
    *   **Statistical Features**: Moving averages, standard deviations.
    *   **Temporal Features**: Time of day, day of the week.
    *   **Device-specific Features**: Data submission frequency, historical value ranges.
4.  **Model Inference**: The feature vector is fed into a pre-trained ensemble of machine learning models to generate a fraud score.
5.  **Scoring & Alerting**: If the fraud score exceeds a predefined threshold, an alert is triggered, and the data is flagged for review. Malicious nodes may be temporarily suspended.

## 3. Detection Strategies

-   **Anomaly Detection**: An Isolation Forest algorithm identifies data points that deviate significantly from the norm.
-   **Time-Series Analysis**: An LSTM (Long Short-Term Memory) neural network detects unusual temporal patterns and sequences.
-   **Classification Model**: An XGBoost classifier, trained on historical data, identifies known fraud patterns.
-   **Device Fingerprinting**: Each device's unique data signature is monitored for sudden, unexplainable changes.

## 4. Technology Stack

-   **Backend Language**: Python
-   **ML Frameworks**: TensorFlow (for LSTMs), Scikit-learn (for Isolation Forest), XGBoost
-   **API Framework**: FastAPI (for serving the model)
-   **Data Processing**: Pandas, NumPy
-   **Feature Store**: Feast (to ensure consistency between training and serving)
-   **Containerization**: Docker
-   **Orchestration**: Kubernetes (for scalable model deployment)

## 5. Model Lifecycle Management

-   **Training**: Models are periodically retrained on new, labeled data to adapt to evolving fraud patterns.
-   **Versioning**: All models are versioned using MLflow to ensure reproducibility.
-   **Monitoring**: Model performance is continuously monitored for concept drift and accuracy degradation.
