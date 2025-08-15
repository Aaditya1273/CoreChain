require('dotenv').config();
const { create } = require('ipfs-http-client');
const { ethers } = require('ethers');
const fs = require('fs');

// --- Configuration ---
const { 
    RPC_URL, 
    ADMIN_PRIVATE_KEY, 
    NODE_IDENTITY_ADDRESS, 
    IPFS_API_URL, 
    IPFS_PROJECT_ID, 
    IPFS_PROJECT_SECRET 
} = process.env;

// IMPORTANT: You must place the ABI for NodeIdentity.sol in this path
const NodeIdentityABI = require('../contracts/artifacts/contracts/identity/NodeIdentity.sol/NodeIdentity.json').abi;

async function main() {
    // --- Argument Parsing ---
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error("Usage: node upload.js <path_to_file> <node_operator_address>");
        process.exit(1);
    }
    const filePath = args[0];
    const nodeOperatorAddress = args[1];

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    if (!ethers.utils.isAddress(nodeOperatorAddress)) {
        console.error(`Invalid Ethereum address: ${nodeOperatorAddress}`);
        process.exit(1);
    }

    // --- IPFS Setup ---
    const auth = 'Basic ' + Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');
    const ipfs = create({
        url: IPFS_API_URL,
        headers: { authorization: auth }
    });

    // --- Upload to IPFS ---
    console.log(`Uploading ${filePath} to IPFS...`);
    const fileContent = fs.readFileSync(filePath);
    const { cid } = await ipfs.add(fileContent);
    const ipfsUri = `ipfs://${cid.toString()}`;
    console.log(`File uploaded successfully. CID: ${cid.toString()}`);
    console.log(`IPFS URI: ${ipfsUri}`);

    // --- Blockchain Interaction ---
    console.log(`Connecting to blockchain and minting SBT...`);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const nodeIdentityContract = new ethers.Contract(NODE_IDENTITY_ADDRESS, NodeIdentityABI, adminWallet);

    const tx = await nodeIdentityContract.safeMint(nodeOperatorAddress, ipfsUri);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log(`SBT minted successfully for ${nodeOperatorAddress} with document URI: ${ipfsUri}`);
}

main().catch(err => {
    console.error("An error occurred:", err);
    process.exit(1);
});
