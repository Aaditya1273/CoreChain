// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "../carbon/CarbonCreditNFT.sol";
import "../StakingPool.sol";

/**
 * @title OracleBridge
 * @dev This contract acts as a bridge between off-chain IoT data and the Core blockchain.
 * It uses a Chainlink oracle to receive energy production data, update node stats,
 * and trigger the minting of CarbonCreditNFTs when thresholds are met.
 */
contract OracleBridge is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    CarbonCreditNFT public carbonCreditNFT;
    StakingPool public stakingPool;

    // The energy production threshold (in Watt-hours) to mint one carbon credit NFT.
    // 1 MWh = 1,000,000 Wh. Let's assume 1 credit per MWh.
    uint256 public mintingThreshold = 1000000;

    // Mapping from a node's address to its energy production stats.
    struct NodeStats {
        uint256 totalEnergyProduced; // Total energy in Wh since registration.
        uint256 lastUpdateTime;
    }
    mapping(address => NodeStats) public nodeStats;

    // Mapping from a Chainlink request ID to the node address it corresponds to.
    mapping(bytes32 => address) public requestToNode;

    /**
     * @dev Initializes the contract with necessary addresses and Chainlink details.
     * @param _link The address of the LINK token contract.
     * @param _oracle The address of the Chainlink oracle.
     * @param _stakingPool The address of the StakingPool contract.
     * @param _carbonCreditNFT The address of the CarbonCreditNFT contract.
     */
    constructor(
        address _link,
        address _oracle,
        address _stakingPool,
        address _carbonCreditNFT
    ) {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        stakingPool = StakingPool(_stakingPool);
        carbonCreditNFT = CarbonCreditNFT(_carbonCreditNFT);
    }

    /**
     * @dev Creates a Chainlink request to fetch energy data for a specific node.
     * @param _specId The Job ID on the Chainlink node.
     * @param _nodeId The address of the node to query.
     */
    function requestEnergyData(bytes32 _specId, address _nodeId) public {
        require(stakingPool.isNodeRegistered(_nodeId), "Node is not registered");
        Chainlink.Request memory req = buildChainlinkRequest(_specId, address(this), this.fulfill.selector);
        req.add("nodeId", _nodeId);
        bytes32 requestId = sendChainlinkRequest(req, 1 * LINK_DIVISIBILITY); // Fee: 1 LINK
        requestToNode[requestId] = _nodeId;
    }

    /**
     * @dev The callback function that the Chainlink oracle calls with the data.
     * @param _requestId The ID of the Chainlink request.
     * @param _energyData The reported energy production data in Wh.
     */
    function fulfill(bytes32 _requestId, uint256 _energyData) public recordChainlinkFulfillment(_requestId) {
        address nodeId = requestToNode[_requestId];
        require(nodeId != address(0), "Request not found or already fulfilled");

        // Update node's total energy production.
        NodeStats storage stats = nodeStats[nodeId];
        stats.totalEnergyProduced += _energyData;
        stats.lastUpdateTime = block.timestamp;

        // Check if the production threshold for minting an NFT is met.
        if (stats.totalEnergyProduced >= mintingThreshold) {
            uint256 creditsToMint = stats.totalEnergyProduced / mintingThreshold;
            uint256 totalOffset = creditsToMint * mintingThreshold;

            // Generate a mock signature for now. In production, this would come from the oracle.
            bytes memory oracleSignature = abi.encodePacked(_requestId, totalOffset);

            // Mint the NFT to the node owner.
            address nodeOwner = stakingPool.nodes(nodeId).owner;
            carbonCreditNFT.mint(nodeOwner, totalOffset, nodeId, oracleSignature);

            // Deduct the minted amount from the total.
            stats.totalEnergyProduced -= totalOffset;
        }

        // Clean up to prevent re-entrancy/replay attacks on the request ID.
        delete requestToNode[_requestId];
    }

    /**
     * @dev Allows the owner to update the minting threshold.
     * @param _newThreshold The new energy threshold in Wh.
     */
    function setMintingThreshold(uint256 _newThreshold) public onlyOwner {
        require(_newThreshold > 0, "Threshold must be greater than zero");
        mintingThreshold = _newThreshold;
    }
}
