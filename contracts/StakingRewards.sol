// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./StakingPool.sol";

/**
 * @title StakingRewards
 * @dev Distributes rewards to DePIN nodes based on verified data contributions.
 */
contract StakingRewards is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardsToken;
    StakingPool public immutable stakingPool;

    address public verifier;

    // Mapping from node operator address to their accumulated, unclaimed reward amount
    mapping(address => uint256) public rewards;

    // Mapping from node operator address to their last claim timestamp
    mapping(address => uint256) public lastClaimed;

    // --- Events ---
    event VerifierUpdated(address indexed newVerifier);
    event RewardAdded(address indexed node, uint256 rewardAmount);
    event RewardClaimed(address indexed node, uint256 amount);

    /**
     * @dev Sets the rewards token, staking pool, and initial verifier.
     * @param _rewardsToken The address of the token to be distributed as rewards.
     * @param _stakingPool The address of the main StakingPool contract.
     */
    constructor(address _rewardsToken, address _stakingPool) Ownable(msg.sender) {
        require(_rewardsToken != address(0), "Reward token cannot be zero address");
        require(_stakingPool != address(0), "Staking pool cannot be zero address");
        rewardsToken = IERC20(_rewardsToken);
        stakingPool = StakingPool(_stakingPool);
        verifier = msg.sender; // The deployer is the initial verifier
    }

    /**
     * @dev Called by the verifier to add rewards for a node's verified data.
     * The contract must have sufficient token balance to cover the reward.
     * @param _node The address of the node operator.
     * @param _rewardAmount The amount of reward to add.
     */
    function addReward(address _node, uint256 _rewardAmount) external {
        require(msg.sender == verifier, "Only verifier can call this");
        require(stakingPool.isNodeRegistered(_node), "Node is not registered");
        require(_rewardAmount > 0, "Reward must be positive");

        rewards[_node] += _rewardAmount;

        emit RewardAdded(_node, _rewardAmount);
    }

    /**
     * @dev Allows a node operator to claim their accumulated rewards.
     */
    function claimReward() external nonReentrant {
        address claimant = msg.sender;
        uint256 rewardAmount = rewards[claimant];
        require(rewardAmount > 0, "No rewards to claim");

        // Effects: Update state before external call
        rewards[claimant] = 0;
        lastClaimed[claimant] = block.timestamp;

        emit RewardClaimed(claimant, rewardAmount);

        // Interaction: External call is last
        if (rewardAmount > 0) {
            rewardsToken.safeTransfer(claimant, rewardAmount);
        }
    }

    /**
     * @dev Allows the contract owner to fund the reward pool.
     * @param _amount The amount of rewards to add to the contract.
     */
    function fundRewardPool(uint256 _amount) external onlyOwner {
        rewardsToken.safeTransferFrom(msg.sender, address(this), _amount);
    }

    // --- Admin Functions ---

    /**
     * @dev Updates the verifier address.
     * @param _newVerifier The address of the new verifier.
     */
    function setVerifier(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "Verifier cannot be zero address");
        verifier = _newVerifier;
        emit VerifierUpdated(_newVerifier);
    }

    // --- View Functions ---

    /**
     * @dev Returns the total rewards available for a specific node.
     * @param _node The address of the node operator.
     */
    function getRewardBalance(address _node) external view returns (uint256) {
        return rewards[_node];
    }
}