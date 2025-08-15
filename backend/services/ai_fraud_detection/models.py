from pydantic import BaseModel, Field

class IoTData(BaseModel):
    """
    Represents the data structure for incoming IoT sensor readings.
    """
    node_id: str = Field(..., description="The unique identifier of the DePIN node.")
    timestamp: int = Field(..., description="The Unix timestamp of the reading.")
    energy_production_wh: float = Field(..., gt=0, description="Energy produced in Watt-hours.")
