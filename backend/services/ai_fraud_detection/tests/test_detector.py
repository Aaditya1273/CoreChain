import pytest
from backend.services.ai_fraud_detection.detector import is_anomaly, MAX_PLAUSIBLE_READING_WH

def test_valid_reading():
    """Tests that a normal, valid reading is not flagged as an anomaly."""
    assert not is_anomaly(1000) # 1 kWh

def test_zero_reading():
    """Tests that a zero reading is considered valid."""
    assert not is_anomaly(0)

def test_extreme_value_anomaly():
    """Tests that a value far exceeding the plausible maximum is flagged."""
    assert is_anomaly(MAX_PLAUSIBLE_READING_WH + 1)

def test_negative_value_anomaly():
    """Tests that a negative reading is flagged as an anomaly."""
    assert is_anomaly(-100)

def test_boundary_value_valid():
    """Tests that a reading exactly at the maximum plausible limit is valid."""
    assert not is_anomaly(MAX_PLAUSIBLE_READING_WH)
