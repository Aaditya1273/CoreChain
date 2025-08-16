## AI Module Setup

The AI fraud detection module is a critical backend service for validating sensor data.

1.  **Navigate to the AI service directory:**
    ```bash
    cd backend/ai-fraud-detection
    ```

2.  **Install Python Dependencies:**
    The AI module may have Python dependencies. (Assuming `requirements.txt`)
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure AI Service:**
    Set up environment variables specific to the AI service in your `.env` file, such as database connections or model paths.

4.  **Run the Service:**
    The `npm run dev` command in the `backend` directory should start the AI service alongside other backend services. You can also run it independently if needed.

5.  **Model Training (Optional):**
    If you need to retrain the machine learning models, use the provided scripts.
    ```bash
    # Example script
    python scripts/train_model.py
    ```
