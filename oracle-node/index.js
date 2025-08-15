require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ethers } = require('ethers');
const winston = require('winston');

// --- Configuration ---
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const COLLECTION_NAME = 'verified_data';

const RPC_URL = process.env.RPC_URL;
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;
const ORACLE_BRIDGE_ADDRESS = process.env.ORACLE_BRIDGE_ADDRESS;

// IMPORTANT: You must place the ABI for OracleBridge.sol in this path
const OracleBridgeABI = require('./abi/OracleBridge.json');

// --- Logger Setup ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'oracle-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'oracle.log' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// --- Blockchain Interaction ---
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(ORACLE_PRIVATE_KEY, provider);
const oracleBridgeContract = new ethers.Contract(ORACLE_BRIDGE_ADDRESS, OracleBridgeABI, wallet);

async function submitToBlockchain(data, retries = 3) {
  const { node_id, energy_wh } = data;
  logger.info(`Submitting data for node ${node_id} with energy ${energy_wh}Wh`);

  for (let i = 0; i < retries; i++) {
    try {
      const tx = await oracleBridgeContract.updateNodeData(node_id, energy_wh);
      logger.info(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      logger.info(`Transaction confirmed for node ${node_id}`);
      return; // Success, exit the loop
    } catch (error) {
      logger.error(`Attempt ${i + 1} failed for node ${node_id}: ${error.message}`);
      if (i === retries - 1) {
        logger.error(`All retries failed for node ${node_id}. Giving up.`);
      }
    }
  }
}

// --- Main Function ---
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    logger.info('Connected to MongoDB');

    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Use a Change Stream to listen for new documents
    const changeStream = collection.watch([
      { $match: { operationType: 'insert' } }
    ]);

    logger.info(`Listening for new data in ${MONGO_DB_NAME}.${COLLECTION_NAME}...`);

    for await (const change of changeStream) {
      const newData = change.fullDocument;
      logger.info('New data detected:', newData);
      await submitToBlockchain(newData);
    }

  } catch (error) {
    logger.error('An error occurred in the main loop:', error);
  } finally {
    await client.close();
  }
}

main().catch(err => {
  logger.error('Oracle node crashed:', err);
  process.exit(1);
});
