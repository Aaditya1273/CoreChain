const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 4002;

// Oracle data storage
let oracleData = {
  carbonPrices: [],
  energyPrices: [],
  weatherData: [],
  verificationResults: []
};

// Mock external data sources (replace with real APIs in production)
const mockDataSources = {
  getCarbonPrice: async () => {
    // Simulate carbon credit price fluctuation
    const basePrice = 25; // $25 per ton CO2
    const variation = (Math.random() - 0.5) * 5;
    return Math.max(basePrice + variation, 10);
  },
  
  getEnergyPrice: async () => {
    // Simulate energy price per kWh
    const basePrice = 0.12; // $0.12 per kWh
    const variation = (Math.random() - 0.5) * 0.05;
    return Math.max(basePrice + variation, 0.05);
  },
  
  getWeatherData: async (location) => {
    // Mock weather data
    return {
      temperature: Math.random() * 40 - 10, // -10 to 30°C
      humidity: Math.random() * 100,
      windSpeed: Math.random() * 30,
      solarIrradiance: Math.random() * 1000,
      location: location || 'default'
    };
  }
};

// Blockchain connection (mock for now)
let provider = null;
let wallet = null;

try {
  if (process.env.RPC_URL && process.env.PRIVATE_KEY) {
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('🔗 Connected to blockchain');
  } else {
    console.log('⚠️ Blockchain connection not configured (missing RPC_URL or PRIVATE_KEY)');
  }
} catch (error) {
  console.error('❌ Failed to connect to blockchain:', error.message);
}

// Data verification functions
const verifyData = async (data) => {
  // Simple verification logic (enhance in production)
  const isValid = data && 
    typeof data.value === 'number' && 
    !isNaN(data.value) && 
    data.value >= 0;
    
  return {
    isValid,
    confidence: isValid ? Math.random() * 0.3 + 0.7 : 0, // 70-100% confidence
    timestamp: new Date().toISOString()
  };
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'oracle-service',
    timestamp: new Date().toISOString(),
    blockchainConnected: !!provider
  });
});

// Get latest oracle data
app.get('/api/oracle/carbon-price', (req, res) => {
  const latest = oracleData.carbonPrices.slice(-10);
  res.json({ data: latest });
});

app.get('/api/oracle/energy-price', (req, res) => {
  const latest = oracleData.energyPrices.slice(-10);
  res.json({ data: latest });
});

app.get('/api/oracle/weather', (req, res) => {
  const { location } = req.query;
  const filtered = location 
    ? oracleData.weatherData.filter(d => d.location === location)
    : oracleData.weatherData;
  res.json({ data: filtered.slice(-10) });
});

// Submit data for verification
app.post('/api/oracle/verify', async (req, res) => {
  const { data, source } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }
  
  try {
    const verification = await verifyData(data);
    
    const result = {
      id: Date.now().toString(),
      originalData: data,
      source: source || 'unknown',
      verification,
      timestamp: new Date().toISOString()
    };
    
    oracleData.verificationResults.push(result);
    
    // Keep only last 100 results
    if (oracleData.verificationResults.length > 100) {
      oracleData.verificationResults = oracleData.verificationResults.slice(-100);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
});

// Get verification results
app.get('/api/oracle/verifications', (req, res) => {
  const { limit = 20 } = req.query;
  res.json({ 
    data: oracleData.verificationResults.slice(-parseInt(limit))
  });
});

// Scheduled data collection
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('🔄 Collecting oracle data...');
    
    // Collect carbon price
    const carbonPrice = await mockDataSources.getCarbonPrice();
    oracleData.carbonPrices.push({
      price: carbonPrice,
      timestamp: new Date().toISOString(),
      source: 'carbon-market-api'
    });
    
    // Collect energy price
    const energyPrice = await mockDataSources.getEnergyPrice();
    oracleData.energyPrices.push({
      price: energyPrice,
      timestamp: new Date().toISOString(),
      source: 'energy-market-api'
    });
    
    // Collect weather data
    const weather = await mockDataSources.getWeatherData();
    oracleData.weatherData.push({
      ...weather,
      timestamp: new Date().toISOString(),
      source: 'weather-api'
    });
    
    // Keep only last 100 entries for each type
    Object.keys(oracleData).forEach(key => {
      if (oracleData[key].length > 100) {
        oracleData[key] = oracleData[key].slice(-100);
      }
    });
    
    console.log('✅ Oracle data updated');
  } catch (error) {
    console.error('❌ Failed to collect oracle data:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🔮 Oracle Service running at http://localhost:${PORT}`);
  console.log('⏰ Scheduled data collection every 5 minutes');
});
