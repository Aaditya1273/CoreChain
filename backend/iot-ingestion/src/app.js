const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 4001;

// In-memory storage for demo (use database in production)
let sensorData = [];
let connectedDevices = new Map();

// MQTT client for IoT device communication
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker');
  // Subscribe to sensor data topics
  mqttClient.subscribe('sensors/+/data');
  mqttClient.subscribe('sensors/+/status');
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const deviceId = topic.split('/')[1];
    
    if (topic.endsWith('/data')) {
      // Store sensor data
      const sensorReading = {
        deviceId,
        timestamp: new Date().toISOString(),
        ...data
      };
      sensorData.push(sensorReading);
      
      // Keep only last 1000 readings
      if (sensorData.length > 1000) {
        sensorData = sensorData.slice(-1000);
      }
      
      console.log(`📊 Received data from ${deviceId}:`, data);
    } else if (topic.endsWith('/status')) {
      // Update device status
      connectedDevices.set(deviceId, {
        lastSeen: new Date().toISOString(),
        status: data.status || 'online'
      });
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'iot-ingestion',
    timestamp: new Date().toISOString(),
    connectedDevices: connectedDevices.size
  });
});

// Get latest sensor data
app.get('/api/sensors/data', (req, res) => {
  const { deviceId, limit = 50 } = req.query;
  
  let filteredData = sensorData;
  if (deviceId) {
    filteredData = sensorData.filter(d => d.deviceId === deviceId);
  }
  
  res.json({
    data: filteredData.slice(-parseInt(limit)),
    total: filteredData.length
  });
});

// Get device status
app.get('/api/devices/status', (req, res) => {
  const devices = Array.from(connectedDevices.entries()).map(([id, info]) => ({
    deviceId: id,
    ...info
  }));
  
  res.json({ devices });
});

// Submit sensor data (HTTP endpoint for devices without MQTT)
app.post('/api/sensors/data', (req, res) => {
  const { deviceId, ...data } = req.body;
  
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }
  
  const sensorReading = {
    deviceId,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  sensorData.push(sensorReading);
  
  // Keep only last 1000 readings
  if (sensorData.length > 1000) {
    sensorData = sensorData.slice(-1000);
  }
  
  console.log(`📊 Received HTTP data from ${deviceId}:`, data);
  res.json({ success: true, timestamp: sensorReading.timestamp });
});

// WebSocket server for real-time data streaming
const server = app.listen(PORT, () => {
  console.log(`🌐 IoT Ingestion Service running at http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('📱 WebSocket client connected');
  
  // Send latest data to new client
  ws.send(JSON.stringify({
    type: 'initial_data',
    data: sensorData.slice(-10)
  }));
  
  ws.on('close', () => {
    console.log('📱 WebSocket client disconnected');
  });
});

// Broadcast new data to WebSocket clients
setInterval(() => {
  if (wss.clients.size > 0 && sensorData.length > 0) {
    const latestData = sensorData.slice(-1)[0];
    const message = JSON.stringify({
      type: 'sensor_data',
      data: latestData
    });
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}, 5000); // Broadcast every 5 seconds
