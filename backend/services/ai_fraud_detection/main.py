from fastapi import FastAPI, HTTPException
from .models import IoTData
from .detector import is_anomaly
from .oracle_client import OracleClient

app = FastAPI(
    title="AI Fraud Detection Service",
    description="Receives IoT data, checks for anomalies, and forwards to the Core blockchain oracle."
)

oracle_client = OracleClient()

# In-memory store to detect duplicate submissions
processed_data_cache = set()

@app.post("/validate-data/")
async def validate_data(data: IoTData):
    """
    Receives IoT data, validates it, and forwards it to the oracle if valid.
    """
    # 1. Check for duplicates
    data_fingerprint = f"{data.node_id}-{data.timestamp}"
    if data_fingerprint in processed_data_cache:
        raise HTTPException(status_code=409, detail="Duplicate data submission")

    # 2. Run anomaly detection
    if is_anomaly(data.energy_production_wh):
        raise HTTPException(status_code=400, detail="Anomaly detected in data")

    # 3. If valid, forward to the oracle
    try:
        success = await oracle_client.update_node_stats(
            node_id=data.node_id,
            energy_data=data.energy_production_wh
        )
        if not success:
            raise HTTPException(status_code=503, detail="Oracle service is unavailable")

    except Exception as e:
        # In a real app, log the error
        raise HTTPException(status_code=500, detail=f"Failed to contact oracle: {e}")

    # Add to cache to prevent replays
    processed_data_cache.add(data_fingerprint)

    return {"status": "success", "message": "Data validated and forwarded to oracle"}
