# CoreChain IPFS Uploader Utility

This script is an administrative tool for uploading a node operator's verification documents to IPFS and minting a `NodeIdentity` Soulbound Token (SBT) with the resulting IPFS URI.

## Features

- Uploads any file to a configured IPFS pinning service (e.g., Infura).
- Connects to the Core blockchain and calls the `safeMint` function on the `NodeIdentity` contract.
- Provides clear logging for each step of the process.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Add Contract ABI**:
    - This script assumes your Hardhat project has been compiled. It looks for the `NodeIdentity.json` ABI in `../contracts/artifacts/`.
    - Ensure the path in `upload.js` points to the correct location of your compiled ABI.

3.  **Configure Environment**:
    - Copy the `.env.example` file to a new file named `.env`.
    - Fill in the required values:
        - `RPC_URL`: The RPC endpoint for the Core blockchain.
        - `ADMIN_PRIVATE_KEY`: The private key of the wallet that has minting permissions on the `NodeIdentity` contract.
        - `NODE_IDENTITY_ADDRESS`: The address of your deployed `NodeIdentity.sol` contract.
        - `IPFS_API_URL`, `IPFS_PROJECT_ID`, `IPFS_PROJECT_SECRET`: Your IPFS pinning service API credentials (e.g., from an Infura IPFS project).

## Usage

Run the script from the command line, providing the path to the document and the node operator's Ethereum address as arguments.

```bash
node upload.js /path/to/verification-document.pdf 0xNodeOperatorAddress
```

The script will upload the file, get the IPFS CID, and submit a transaction to mint the SBT.
