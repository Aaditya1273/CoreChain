# CoreChain Oracle Node

This script runs an off-chain oracle that listens for new data in a MongoDB database and submits it to the `OracleBridge` smart contract on the Core blockchain.

## Features

- **MongoDB Change Streams**: Efficiently listens for new data insertions without constant polling.
- **Blockchain Submission**: Uses `ethers.js` to call the `updateNodeData` function on the smart contract.
- **Resilience**: Includes a retry mechanism to handle transient blockchain network errors.
- **Robust Logging**: Uses `winston` to log all activities and errors to both the console and log files (`oracle.log`, `oracle-error.log`).

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Add Contract ABI**:
    - Compile your `OracleBridge.sol` contract.
    - Create an `abi/` directory inside `oracle-node/`.
    - Place the compiled `OracleBridge.json` ABI file inside the `abi/` directory.

3.  **Configure Environment**:
    - Copy the `.env.example` file to a new file named `.env`.
    - Fill in the required values:
        - `MONGO_URI`: The connection string for your MongoDB instance.
        - `MONGO_DB_NAME`: The name of the database where verified IoT data is stored.
        - `RPC_URL`: The RPC endpoint for the Core blockchain.
        - `ORACLE_PRIVATE_KEY`: The private key of the wallet that will be submitting transactions to the blockchain. This wallet must have CORE tokens to pay for gas fees.
        - `ORACLE_BRIDGE_ADDRESS`: The address of your deployed `OracleBridge.sol` contract.

## Running the Oracle

Once configured, you can start the oracle node with:

```bash
npm start
```

The script will connect to MongoDB and begin listening for new documents in the `verified_data` collection.
