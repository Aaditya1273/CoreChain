#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "mbedtls/ecdsa.h"
#include "mbedtls/sha256.h"

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend URL (must be HTTPS for security)
const char* serverName = "https://your-backend-domain.com/validate-data/";

// Root CA certificate for your backend server.
// For local testing with a self-signed cert, you can use an online converter to get this.
const char* rootCACertificate = "-----BEGIN CERTIFICATE-----\n" \
"MIIDzTCCArWgAwIBAgIQCjeHZF5ftIwiMAZchNPvLzAJBgUrDgMCHQUAMHkxCzAJ\
"// ... rest of your root CA certificate ...
"-----END CERTIFICATE-----";

// Unique identifier for this device
const char* nodeId = "esp32-solar-01";

// Device's private key (32 bytes, hex format). 
// IMPORTANT: This is for demonstration only. In production, store this securely.
const char* private_key_hex = "... YOUR 32-BYTE PRIVATE KEY IN HEX ...";

// --- Globals ---
// NOTE: For a real device, you would read from a sensor (e.g., using analogRead or a library like INA219)
float get_solar_energy_reading() {
  return random(50, 500) / 10.0; // Simulate reading between 5.0 and 50.0 Wh
}

// Function to sign data
String sign_data(const char* message) {
  mbedtls_ecdsa_context ecdsa;
  mbedtls_mpi r, s;
  unsigned char hash[32];
  unsigned char sig[MBEDTLS_ECDSA_MAX_LEN];
  size_t sig_len;
  byte private_key_bin[32];

  // Convert hex key to binary
  for(int i=0; i<32; i++) {
    sscanf(&private_key_hex[i*2], "%2hhx", &private_key_bin[i]);
  }

  mbedtls_ecdsa_init(&ecdsa);
  mbedtls_mpi_init(&r);
  mbedtls_mpi_init(&s);

  // Hash the message
  mbedtls_sha256_ret((unsigned char*)message, strlen(message), hash, 0);

  // Load private key
  mbedtls_ecp_group_load(&ecdsa.grp, MBEDTLS_ECP_DP_SECP256K1);
  mbedtls_mpi_read_binary(&ecdsa.d, private_key_bin, 32);

  // Sign the hash
  if (mbedtls_ecdsa_sign(&ecdsa.grp, &r, &s, &ecdsa.d, hash, sizeof(hash), NULL, NULL) != 0) {
    Serial.println("Failed to sign data");
    return "";
  }

  // Write signature to buffer
  mbedtls_ecdsa_signature_to_asn1(&r, &s, sig, sizeof(sig), &sig_len);

  // Convert signature to hex string
  String signature_hex = "";
  for(int i=0; i<sig_len; i++) {
    char hex_buf[3];
    sprintf(hex_buf, "%02x", sig[i]);
    signature_hex += hex_buf;
  }

  mbedtls_ecdsa_free(&ecdsa);
  mbedtls_mpi_free(&r);
  mbedtls_mpi_free(&s);

  return signature_hex;
}

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Create JSON document for the data payload
    JsonDocument data_doc;
    data_doc["node_id"] = nodeId;
    data_doc["timestamp"] = "2025-01-01T12:00:00Z"; // Placeholder, use NTP for real time
    data_doc["energy_wh"] = get_solar_energy_reading();
    String data_payload;
    serializeJson(data_doc, data_payload);

    // Sign the data payload
    String signature = sign_data(data_payload.c_str());

    if (signature.length() > 0) {
      // Create the final JSON document to send
      JsonDocument post_doc;
      post_doc["data"] = data_doc;
      post_doc["signature"] = signature;
      String post_payload;
      serializeJson(post_doc, post_payload);

      // Send POST request
      http.begin(serverName, rootCACertificate);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(post_payload);

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.println(response);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    }
  }
  
  // Wait 30 seconds before sending the next reading
  delay(30000);
}
