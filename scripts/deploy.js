const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment of CoreChain Climate Network contracts...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy MockERC20 (or your actual CORE token if it's an ERC20)
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const coreToken = await MockERC20.deploy("Core Token", "CORE", hre.ethers.utils.parseEther("10000000"));
  await coreToken.deployed();
  console.log(`MockERC20 (CORE) deployed to: ${coreToken.address}`);

  // 2. Deploy NodeIdentity
  const NodeIdentity = await hre.ethers.getContractFactory("NodeIdentity");
  const nodeIdentity = await NodeIdentity.deploy(deployer.address); // Deployer is the initial owner
  await nodeIdentity.deployed();
  console.log(`NodeIdentity deployed to: ${nodeIdentity.address}`);

  // 3. Deploy StakingPool
  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(coreToken.address, nodeIdentity.address);
  await stakingPool.deployed();
  console.log(`StakingPool deployed to: ${stakingPool.address}`);

  // 4. Deploy StakingRewards
  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(coreToken.address, stakingPool.address);
  await stakingRewards.deployed();
  console.log(`StakingRewards deployed to: ${stakingRewards.address}`);

  // 5. Deploy CarbonCreditNFT
  const CarbonCreditNFT = await hre.ethers.getContractFactory("CarbonCreditNFT");
  const carbonCreditNFT = await CarbonCreditNFT.deploy(deployer.address); // Deployer is initial owner
  await carbonCreditNFT.deployed();
  console.log(`CarbonCreditNFT deployed to: ${carbonCreditNFT.address}`);

  // 6. Deploy OracleBridge
  const OracleBridge = await hre.ethers.getContractFactory("OracleBridge");
  const oracleBridge = await OracleBridge.deploy(carbonCreditNFT.address, stakingRewards.address);
  await oracleBridge.deployed();
  console.log(`OracleBridge deployed to: ${oracleBridge.address}`);

  // --- Post-Deployment Configuration ---
  console.log("\nConfiguring contract roles and permissions...");

  // Grant MINTER_ROLE on CarbonCreditNFT to OracleBridge
  console.log("Granting MINTER_ROLE to OracleBridge...");
  const minterRole = await carbonCreditNFT.MINTER_ROLE();
  await carbonCreditNFT.grantRole(minterRole, oracleBridge.address);
  console.log("Role granted.");

  // Set the oracle address in OracleBridge (using deployer for now, can be changed later)
  console.log("Setting oracle address in OracleBridge...");
  await oracleBridge.setOracle(deployer.address);
  console.log("Oracle address set.");

  // --- Verification ---
  console.log("\nWaiting for 5 block confirmations before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

  try {
    console.log("Verifying contracts on Core Scan...");
    await hre.run("verify:verify", { address: coreToken.address, constructorArguments: ["Core Token", "CORE", hre.ethers.utils.parseEther("10000000")] });
    await hre.run("verify:verify", { address: nodeIdentity.address, constructorArguments: [deployer.address] });
    await hre.run("verify:verify", { address: stakingPool.address, constructorArguments: [coreToken.address, nodeIdentity.address] });
    await hre.run("verify:verify", { address: stakingRewards.address, constructorArguments: [coreToken.address, stakingPool.address] });
    await hre.run("verify:verify", { address: carbonCreditNFT.address, constructorArguments: [deployer.address] });
    await hre.run("verify:verify", { address: oracleBridge.address, constructorArguments: [carbonCreditNFT.address, stakingRewards.address] });
    console.log("Verification complete.");
  } catch (error) {
    console.error("Verification failed:", error.message);
  }

  console.log("\n--- Deployment Summary ---");
  console.log(`CORE Token: ${coreToken.address}`);
  console.log(`NodeIdentity: ${nodeIdentity.address}`);
  console.log(`StakingPool: ${stakingPool.address}`);
  console.log(`StakingRewards: ${stakingRewards.address}`);
  console.log(`CarbonCreditNFT: ${carbonCreditNFT.address}`);
  console.log(`OracleBridge: ${oracleBridge.address}`);
  console.log("--------------------------");

  // --- Save Deployment Info ---
  const deploymentInfo = {
    network: hre.network.name,
    coreToken: coreToken.address,
    nodeIdentity: nodeIdentity.address,
    stakingPool: stakingPool.address,
    stakingRewards: stakingRewards.address,
    carbonCreditNFT: carbonCreditNFT.address,
    oracleBridge: oracleBridge.address,
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`\nDeployment addresses saved to: deployments/${hre.network.name}.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
