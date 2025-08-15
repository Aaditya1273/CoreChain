// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title StakingPool
 * @dev Manages DePIN node registration, staking, and metadata.
 */
interface INodeIdentity {
    function balanceOf(address owner) external view returns (uint256);
}

contract StakingPool is Ownable, ReentrancyGuard, Pausable {

    // The token used for staking (CORE)
    IERC20 public immutable stakingToken;

    // The amount of tokens required to register a node
    uint256 public stakingRequirement;

    // Address of the contract responsible for distributing rewards
    address public rewardsContract;

    // Enum for different types of nodes
    enum NodeType { ClimateSensor, AirQualityMonitor, EnergyMeter }

    // Enum for the energy source of the node
    enum EnergySource { Solar, Wind, Hydro, Geothermal, Grid }

    // Struct to store metadata for each registered node
    struct Node {
        address owner;          // The address of the node operator
        bytes32 geoHash;        // Geolocation hash of the node
        NodeType nodeType;      // The type of the node
        EnergySource energy;    // The energy source of the node
        uint256 stakeAmount;    // The amount of tokens staked
        uint256 registrationTime; // Timestamp of registration
    }

    // Mapping from a node operator's address to their registered node
    mapping(address => Node) public nodes;

    // Total number of registered nodes
    uint256 public nodeCount;

    // Address of the NodeIdentity contract
    INodeIdentity public nodeIdentity;

    // --- Events ---
    event NodeRegistered(address indexed owner, bytes32 geoHash, NodeType nodeType, uint256 stakeAmount);
    event NodeUnstaked(address indexed owner, uint256 stakeAmount);
    event StakingRequirementUpdated(uint256 newAmount);
    event RewardsContractUpdated(address indexed newContract);

    /**
     * @dev Sets the staking token and initial staking requirement.
     * @param _stakingToken The address of the CORE token contract.
     * @param _initialStakingRequirement The initial amount required for staking.
     * @param _identityContract The address of the NodeIdentity contract.
     */
    constructor(IERC20 _stakingToken, uint256 _initialStakingRequirement, address _identityContract) Ownable(msg.sender) {
        require(_identityContract != address(0), "Identity contract cannot be zero");
        nodeIdentity = INodeIdentity(_identityContract);
        require(_stakingToken != address(0), "Staking token cannot be zero address");
        require(_initialStakingRequirement > 0, "Initial stake must be positive");
        stakingToken = IERC20(_stakingToken);
        stakingRequirement = _initialStakingRequirement;
    }

    /**
     * @dev Registers a new DePIN node by staking the required amount of tokens.
     * @param _geoHash The geolocation hash of the node.
     * @param _nodeType The type of the node.
     * @param _energy The energy source of the node.
     */
    /**
     * @dev Checks if a node is registered for a given address.
     * @param _nodeOwner The address of the node operator.
     * @return bool True if the node is registered, false otherwise.
     */
    function isNodeRegistered(address _nodeOwner) public view returns (bool) {
        return nodes[_nodeOwner].owner != address(0);
    }

    function registerNode(bytes32 _geoHash, NodeType _nodeType, EnergySource _energy) external whenNotPaused nonReentrant {
        require(nodeIdentity.balanceOf(msg.sender) > 0, "Caller must be a verified node operator");
        require(nodes[msg.sender].owner == address(0), "Node already registered");

        uint256 stake = stakingRequirement;
        require(stakingToken.balanceOf(msg.sender) >= stake, "Insufficient balance");
        require(stakingToken.allowance(msg.sender, address(this)) >= stake, "Token allowance too low");

        // Transfer stake from user to this contract
        bool success = stakingToken.transferFrom(msg.sender, address(this), stake);
        require(success, "Token transfer failed");

        // Create and store the new node
        nodes[msg.sender] = Node({
            owner: msg.sender,
            geoHash: _geoHash,
            nodeType: _nodeType,
            energy: _energy,
            stakeAmount: stake,
            registrationTime: block.timestamp
        });

        nodeCount++;

        emit NodeRegistered(msg.sender, _geoHash, _nodeType, stake);
    }

    /**
     * @dev Unstakes tokens and deregisters the node.
     */
    function unstake() external whenNotPaused nonReentrant {
        Node storage node = nodes[msg.sender];
        require(node.owner != address(0), "Node not registered");

        uint256 stakeAmount = node.stakeAmount;

        // Effects: Update state before external call
        delete nodes[msg.sender];
        nodeCount--;

        emit NodeUnstaked(msg.sender, stakeAmount);

        // Interaction: External call is last
        stakingToken.transfer(msg.sender, stakeAmount);
    }

    // --- Admin Functions ---

    /**
     * @dev Updates the staking requirement for new nodes.
     * @param _newAmount The new staking amount.
     */
    function setStakingRequirement(uint256 _newAmount) external onlyOwner {
        require(_newAmount > 0, "Stake must be positive");
        stakingRequirement = _newAmount;
        emit StakingRequirementUpdated(_newAmount);
    }

    /**
     * @dev Sets the address of the rewards distribution contract.
     * @param _newContract The address of the new rewards contract.
     */
    function setRewardsContract(address _newContract) external onlyOwner {
        require(_newContract != address(0), "Rewards contract cannot be zero address");
        rewardsContract = _newContract;
        emit RewardsContractUpdated(_newContract);
    }

    /**
     * @dev Pauses the contract in case of an emergency.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // --- View Functions ---

    /**
     * @dev Returns the details of a registered node.
     * @param _owner The address of the node operator.
     * @return The Node struct.
     */
    function getNode(address _owner) external view returns (Node memory) {
        return nodes[_owner];
    }

    /**
     * @dev Checks if an address has a registered node.
     * @param _owner The address to check.
     * @return True if the node is registered, false otherwise.
     */
    function isNodeRegistered(address _owner) external view returns (bool) {
        return nodes[_owner].owner != address(0);
    }
}