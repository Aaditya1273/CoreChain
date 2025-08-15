# CoreChain IoT Firmware

This directory contains the firmware for IoT devices that connect to the CoreChain Climate Network.

## ESP32 Solar Monitor

This firmware is designed for an ESP32 microcontroller connected to a solar energy sensor.

### Features

- Connects to a WiFi network.
- Simulates reading energy production data.
- Signs the data payload with a unique device private key (ECDSA over SECP256k1) to ensure data authenticity.
- Sends the signed data to the FastAPI backend for validation.

### Setup

1.  **PlatformIO**: It is highly recommended to use [PlatformIO](https://platformio.org/) with VS Code for the best development experience.
2.  **Configuration**: Open `esp32_solar_monitor/esp32_solar_monitor.ino` and update the following configuration variables:
    - `ssid`: Your WiFi network name.
    - `password`: Your WiFi password.
    - `serverName`: The HTTPS URL of your running FastAPI backend (e.g., `https://api.yourdomain.com/validate-data/`).
    - `rootCACertificate`: The root CA certificate of your backend's domain. This is required for the ESP32 to verify the server's identity. For production, this would be from a certificate authority like Let's Encrypt. For local development, you can generate a self-signed certificate and export its root CA.
    - `private_key_hex`: A 32-byte (64-character hex) private key for the device. You can generate one using an online tool or OpenSSL.
3.  **Libraries**: PlatformIO will automatically install the `ArduinoJson` library dependency listed in `platformio.ini`.
4.  **Upload**: Build and upload the firmware to your ESP32 device.

### Backend Integration

This firmware sends a JSON payload with the following structure:

```json
{
  "data": {
    "node_id": "esp32-solar-01",
    "timestamp": "...",
    "energy_wh": 42.5
  },
  "signature": "..."
}
```

To complete the security loop, the FastAPI backend must be updated to:
1.  Receive this new payload structure.
2.  Retrieve the known public key for the `node_id`.
3.  Re-hash the `data` object.
4.  Verify the `signature` against the hash using the public key.
