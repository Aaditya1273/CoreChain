const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contracts", function () {
    let StakingPool, stakingPool;
    let StakingRewards, stakingRewards;
    let MockERC20, coreToken, rewardsToken;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy Mock ERC20 for CORE token
        MockERC20 = await ethers.getContractFactory("MockERC20");
        coreToken = await MockERC20.deploy("Core Token", "CORE");
        
        // Deploy Mock ERC20 for Rewards token
        rewardsToken = await MockERC20.deploy("Reward Token", "RWD");

        // Deploy StakingPool
        const initialStakingRequirement = ethers.parseUnits("100", 18);
        StakingPool = await ethers.getContractFactory("StakingPool");
        stakingPool = await StakingPool.deploy(await coreToken.getAddress(), initialStakingRequirement);

        // Deploy StakingRewards
        StakingRewards = await ethers.getContractFactory("StakingRewards");
        stakingRewards = await StakingRewards.deploy(await rewardsToken.getAddress(), await stakingPool.getAddress());

        // Set the rewards contract address in StakingPool
        await stakingPool.setRewardsContract(await stakingRewards.getAddress());

        // Mint some tokens for testing
        await coreToken.mint(addr1.address, ethers.parseUnits("1000", 18));
        await rewardsToken.mint(await stakingRewards.getAddress(), ethers.parseUnits("10000", 18));
    });

    describe("StakingPool", function () {
        it("Should register a node with the correct stake", async function () {
            const stakeAmount = await stakingPool.stakingRequirement();
            await coreToken.connect(addr1).approve(await stakingPool.getAddress(), stakeAmount);

            const geoHash = ethers.encodeBytes32String("u4pruydqqvj");
            await expect(stakingPool.connect(addr1).registerNode(geoHash, 0, 0))
                .to.emit(stakingPool, "NodeRegistered")
                .withArgs(addr1.address, geoHash, 0, stakeAmount);

            const node = await stakingPool.getNode(addr1.address);
            expect(node.owner).to.equal(addr1.address);
            expect(await stakingPool.isNodeRegistered(addr1.address)).to.be.true;
        });

        it("Should fail to register if stake is insufficient", async function () {
            const stakeAmount = ethers.parseUnits("50", 18);
            await coreToken.connect(addr1).approve(await stakingPool.getAddress(), stakeAmount);
            const geoHash = ethers.encodeBytes32String("u4pruydqqvj");
            await expect(stakingPool.connect(addr1).registerNode(geoHash, 0, 0))
                .to.be.revertedWith("Insufficient balance");
        });

        it("Should allow a node to unstake", async function () {
            const stakeAmount = await stakingPool.stakingRequirement();
            await coreToken.connect(addr1).approve(await stakingPool.getAddress(), stakeAmount);
            const geoHash = ethers.encodeBytes32String("u4pruydqqvj");
            await stakingPool.connect(addr1).registerNode(geoHash, 0, 0);

            await expect(stakingPool.connect(addr1).unstake())
                .to.emit(stakingPool, "NodeUnstaked")
                .withArgs(addr1.address, stakeAmount);
            
            expect(await stakingPool.isNodeRegistered(addr1.address)).to.be.false;
            expect(await coreToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("1000", 18));
        });
    });

    describe("StakingRewards", function () {
        beforeEach(async function() {
            const stakeAmount = await stakingPool.stakingRequirement();
            await coreToken.connect(addr1).approve(await stakingPool.getAddress(), stakeAmount);
            const geoHash = ethers.encodeBytes32String("u4pruydqqvj");
            await stakingPool.connect(addr1).registerNode(geoHash, 0, 0);

            // Set the verifier to the owner address
            await stakingRewards.setVerifier(owner.address);
        });

        it("Should allow the verifier to add rewards", async function () {
            const rewardAmount = ethers.parseUnits("50", 18);
            await expect(stakingRewards.connect(owner).addReward(addr1.address, rewardAmount))
                .to.emit(stakingRewards, "RewardAdded")
                .withArgs(addr1.address, rewardAmount);
            
            expect(await stakingRewards.getRewardBalance(addr1.address)).to.equal(rewardAmount);
        });

        it("Should not allow a non-verifier to add rewards", async function () {
            const rewardAmount = ethers.parseUnits("50", 18);
            await expect(stakingRewards.connect(addr2).addReward(addr1.address, rewardAmount))
                .to.be.revertedWith("Only verifier can call this");
        });

        it("Should allow a node to claim rewards", async function () {
            const rewardAmount = ethers.parseUnits("50", 18);
            await stakingRewards.connect(owner).addReward(addr1.address, rewardAmount);

            const initialBalance = await rewardsToken.balanceOf(addr1.address);
            await expect(stakingRewards.connect(addr1).claimReward())
                .to.emit(stakingRewards, "RewardClaimed")
                .withArgs(addr1.address, rewardAmount);
            
            const finalBalance = await rewardsToken.balanceOf(addr1.address);
            expect(finalBalance - initialBalance).to.equal(rewardAmount);
            expect(await stakingRewards.getRewardBalance(addr1.address)).to.equal(0);
        });
    });
});

