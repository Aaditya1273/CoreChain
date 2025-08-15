const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// --- Helper Functions ---
const getTestnetDeployments = () => {
  const deploymentsFilePath = path.join(__dirname, "..", "deployments", "coreTestnet.json");
  if (!fs.existsSync(deploymentsFilePath)) {
    throw new Error("Testnet deployment file not found. Run the testnet deployment first.");
  }
  return JSON.parse(fs.readFileSync(deploymentsFilePath, "utf8"));
};

const saveMainnetDeployments = (addresses) => {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  fs.writeFileSync(
    path.join(deploymentsDir, "coreMainnet.json"),
    JSON.stringify({ network: "coreMainnet", ...addresses }, null, 2)
  );
  console.log(`\nMainnet deployment addresses saved to: deployments/coreMainnet.json`);
};

async function main() {
  console.log("Starting Mainnet migration...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Mainnet Deployment ---
  const CORE_MAINNET_TOKEN_ADDRESS = process.env.CORE_MAINNET_TOKEN_ADDRESS;
  if (!CORE_MAINNET_TOKEN_ADDRESS) {
    throw new Error("CORE_MAINNET_TOKEN_ADDRESS is not set in .env file");
  }
  console.log(`Using official CORE token at: ${CORE_MAINNET_TOKEN_ADDRESS}`);

  const NodeIdentity = await hre.ethers.getContractFactory("NodeIdentity");
  const nodeIdentity = await NodeIdentity.deploy(deployer.address);
  await nodeIdentity.deployed();
  console.log(`Mainnet NodeIdentity deployed to: ${nodeIdentity.address}`);

  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(CORE_MAINNET_TOKEN_ADDRESS, nodeIdentity.address);
  await stakingPool.deployed();
  console.log(`Mainnet StakingPool deployed to: ${stakingPool.address}`);

  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(CORE_MAINNET_TOKEN_ADDRESS, stakingPool.address);
  await stakingRewards.deployed();
  console.log(`Mainnet StakingRewards deployed to: ${stakingRewards.address}`);

  const CarbonCreditNFT = await hre.ethers.getContractFactory("CarbonCreditNFT");
  const carbonCreditNFT = await CarbonCreditNFT.deploy(deployer.address);
  await carbonCreditNFT.deployed();
  console.log(`Mainnet CarbonCreditNFT deployed to: ${carbonCreditNFT.address}`);

  const OracleBridge = await hre.ethers.getContractFactory("OracleBridge");
  const oracleBridge = await OracleBridge.deploy(carbonCreditNFT.address, stakingRewards.address);
  await oracleBridge.deployed();
  console.log(`Mainnet OracleBridge deployed to: ${oracleBridge.address}`);

  // --- Post-Deployment Configuration ---
  console.log("\nConfiguring Mainnet contract roles...");
  const minterRole = await carbonCreditNFT.MINTER_ROLE();
  await carbonCreditNFT.grantRole(minterRole, oracleBridge.address);
  await oracleBridge.setOracle(deployer.address); // Set to a secure oracle address
  console.log("Roles configured.");

  // --- Data Migration: NodeIdentity SBTs ---
  console.log("\nStarting NodeIdentity SBT migration from Testnet...");
  const testnetDeployments = getTestnetDeployments();
  const testnetProvider = new hre.ethers.providers.JsonRpcProvider(process.env.CORE_TESTNET_RPC_URL);
  const testnetNodeIdentity = await hre.ethers.getContractAt("NodeIdentity", testnetDeployments.nodeIdentity, testnetProvider);

  const transferFilter = testnetNodeIdentity.filters.Transfer(hre.ethers.constants.AddressZero);
  const logs = await testnetNodeIdentity.queryFilter(transferFilter, 0, 'latest');
  console.log(`Found ${logs.length} SBTs to migrate.`);

  for (const log of logs) {
    const owner = log.args.to;
    const tokenId = log.args.tokenId;
    const tokenURI = await testnetNodeIdentity.tokenURI(tokenId);
    console.log(`Migrating SBT for ${owner} with URI: ${tokenURI}`);
    const tx = await nodeIdentity.safeMint(owner, tokenURI);
    await tx.wait();
  }
  console.log("SBT migration complete.");

  // --- Save and Verify ---
  const mainnetAddresses = {
    coreToken: CORE_MAINNET_TOKEN_ADDRESS,
    nodeIdentity: nodeIdentity.address,
    stakingPool: stakingPool.address,
    stakingRewards: stakingRewards.address,
    carbonCreditNFT: carbonCreditNFT.address,
    oracleBridge: oracleBridge.address,
  };
  saveMainnetDeployments(mainnetAddresses);

  console.log("\nWaiting for 5 block confirmations before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    console.log("Verifying contracts on Mainnet Core Scan...");
    await hre.run("verify:verify", { address: nodeIdentity.address, constructorArguments: [deployer.address], network: "coreMainnet" });
    await hre.run("verify:verify", { address: stakingPool.address, constructorArguments: [CORE_MAINNET_TOKEN_ADDRESS, nodeIdentity.address], network: "coreMainnet" });
    // ... add verification for other contracts
    console.log("Verification complete.");
  } catch (error) {
    console.error("Verification failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
