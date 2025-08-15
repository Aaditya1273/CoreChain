const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoreChain Climate Network Protocol", function () {
  let owner, nodeOperator, oracle, user1;
  let coreToken, stakingPool, stakingRewards, carbonCreditNFT, nodeIdentity, oracleBridge;

  const STAKE_AMOUNT = ethers.utils.parseEther("100");

  beforeEach(async function () {
    [owner, nodeOperator, oracle, user1] = await ethers.getSigners();

    // Deploy Mock ERC20 Token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    coreToken = await MockERC20.deploy("Core Token", "CORE", ethers.utils.parseEther("1000000"));
    await coreToken.deployed();

    // Deploy NodeIdentity (SBT)
    const NodeIdentity = await ethers.getContractFactory("NodeIdentity");
    nodeIdentity = await NodeIdentity.deploy(owner.address);
    await nodeIdentity.deployed();

    // Deploy StakingPool
    const StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy(coreToken.address, nodeIdentity.address);
    await stakingPool.deployed();

    // Deploy StakingRewards
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    stakingRewards = await StakingRewards.deploy(coreToken.address, stakingPool.address);
    await stakingRewards.deployed();

    // Deploy CarbonCreditNFT
    const CarbonCreditNFT = await ethers.getContractFactory("CarbonCreditNFT");
    carbonCreditNFT = await CarbonCreditNFT.deploy(owner.address);
    await carbonCreditNFT.deployed();

    // Deploy OracleBridge
    const OracleBridge = await ethers.getContractFactory("OracleBridge");
    oracleBridge = await OracleBridge.deploy(carbonCreditNFT.address, stakingRewards.address);
    await oracleBridge.deployed();

    // --- Post-Deployment Setup ---
    // Grant minting role to OracleBridge
    await carbonCreditNFT.grantRole(await carbonCreditNFT.MINTER_ROLE(), oracleBridge.address);
    // Set the oracle address in the bridge
    await oracleBridge.setOracle(oracle.address);

    // --- Fund Accounts ---
    await coreToken.transfer(nodeOperator.address, ethers.utils.parseEther("1000"));
    await coreToken.transfer(stakingRewards.address, ethers.utils.parseEther("50000")); // Fund rewards contract
  });

  describe("Node Staking and Registration", function () {
    it("Should fail to register a node without an identity SBT", async function () {
      await coreToken.connect(nodeOperator).approve(stakingPool.address, STAKE_AMOUNT);
      await expect(
        stakingPool.connect(nodeOperator).registerNode("node-type-1", "geo-hash-1", STAKE_AMOUNT)
      ).to.be.revertedWith("Caller must have a Node Identity SBT");
    });

    it("Should allow a user with an SBT to register a node", async function () {
      // Mint an identity token for the node operator
      await nodeIdentity.connect(owner).safeMint(nodeOperator.address, "ipfs://kyc-hash");
      
      await coreToken.connect(nodeOperator).approve(stakingPool.address, STAKE_AMOUNT);
      await stakingPool.connect(nodeOperator).registerNode("node-type-1", "geo-hash-1", STAKE_AMOUNT);

      const node = await stakingPool.nodes(nodeOperator.address);
      expect(node.owner).to.equal(nodeOperator.address);
      expect(node.stakeAmount).to.equal(STAKE_AMOUNT);
      expect(await stakingPool.isNodeRegistered(nodeOperator.address)).to.be.true;
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function() {
      // Register a node first
      await nodeIdentity.connect(owner).safeMint(nodeOperator.address, "ipfs://kyc-hash");
      await coreToken.connect(nodeOperator).approve(stakingPool.address, STAKE_AMOUNT);
      await stakingPool.connect(nodeOperator).registerNode("node-type-1", "geo-hash-1", STAKE_AMOUNT);
    });

    it("Should allow the oracle to add rewards and the node to claim them", async function () {
      const rewardAmount = ethers.utils.parseEther("50");
      // Oracle bridge adds rewards after verifying data
      await oracleBridge.connect(oracle).updateNodeData(nodeOperator.address, 12345); // This calls addReward internaly

      // Let some time pass
      await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
      await ethers.provider.send("evm_mine");

      const initialBalance = await coreToken.balanceOf(nodeOperator.address);
      await stakingRewards.connect(nodeOperator).claimReward();
      const finalBalance = await coreToken.balanceOf(nodeOperator.address);

      // Check that balance increased (exact reward calculation is complex, so we check for increase)
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Carbon Credit NFT Minting", function () {
    beforeEach(async function() {
      // Register a node first
      await nodeIdentity.connect(owner).safeMint(nodeOperator.address, "ipfs://kyc-hash");
      await coreToken.connect(nodeOperator).approve(stakingPool.address, STAKE_AMOUNT);
      await stakingPool.connect(nodeOperator).registerNode("node-type-1", "geo-hash-1", STAKE_AMOUNT);
    });

    it("Should mint a CarbonCreditNFT when the oracle submits data", async function () {
      const energyData = 15000; // 15 kWh
      await oracleBridge.connect(oracle).updateNodeData(nodeOperator.address, energyData);

      const tokenId = 0;
      const nftOwner = await carbonCreditNFT.ownerOf(tokenId);
      const tokenData = await carbonCreditNFT.getTokenData(tokenId);

      expect(nftOwner).to.equal(nodeOperator.address);
      expect(tokenData.co2OffsetKg).to.equal(energyData * 0.4); // Assuming 0.4 kg CO2 per kWh
      expect(tokenData.nodeId).to.equal(nodeOperator.address);
    });
  });
});
