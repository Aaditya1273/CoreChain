// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CarbonCreditNFT
 * @dev A contract for minting Carbon Credit NFTs on the Core blockchain.
 * Each NFT represents a verified amount of CO2 offset by a DePIN node.
 */
contract CarbonCreditNFT is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Address of the oracle responsible for verifying data and providing signatures.
    address public verificationOracle;

    // Struct to store the metadata for each carbon credit NFT.
    struct CarbonCreditData {
        uint256 co2Offset; // Amount of CO2 offset in grams.
        uint256 timestamp;   // Unix timestamp of the verification.
        address nodeId;      // The address of the DePIN node that generated the credit.
        bytes oracleSignature; // The digital signature from the verification oracle.
    }

    // Mapping from token ID to its carbon credit metadata.
    mapping(uint256 => CarbonCreditData) public carbonCredits;

    // Event emitted when a new carbon credit is minted.
    event CarbonCreditMinted(uint256 indexed tokenId, address indexed to, uint256 co2Offset, address indexed nodeId);

    /**
     * @dev Sets the initial values for the NFT contract.
     * @param _oracleAddress The address of the trusted verification oracle.
     */
    constructor(address _oracleAddress) ERC721("CoreCarbonCredit", "CCC") Ownable(msg.sender) {
        require(_oracleAddress != address(0), "Oracle address cannot be zero");
        verificationOracle = _oracleAddress;
    }

    /**
     * @dev Mints a new Carbon Credit NFT.
     * Can only be called by the verification oracle.
     * @param to The address to mint the NFT to.
     * @param co2Offset The amount of CO2 offset in grams.
     * @param nodeId The address of the DePIN node.
     * @param signature The oracle's signature verifying the data.
     */
    function mint(address to, uint256 co2Offset, address nodeId, bytes memory signature) public returns (uint256) {
        require(msg.sender == verificationOracle, "Only the verification oracle can mint");

        uint256 tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);

        carbonCredits[tokenId] = CarbonCreditData({
            co2Offset: co2Offset,
            timestamp: block.timestamp,
            nodeId: nodeId,
            oracleSignature: signature
        });

        emit CarbonCreditMinted(tokenId, to, co2Offset, nodeId);

        _tokenIdCounter.increment();
        return tokenId;
    }

    /**
     * @dev Updates the address of the verification oracle.
     * Can only be called by the contract owner.
     * @param _newOracleAddress The new address for the verification oracle.
     */
    function setVerificationOracle(address _newOracleAddress) public onlyOwner {
        require(_newOracleAddress != address(0), "New oracle address cannot be zero");
        verificationOracle = _newOracleAddress;
    }

    /**
     * @dev Returns the URI for a given token ID. This can be pointed to an off-chain metadata server.
     * @param tokenId The ID of the token.
     * @return string The URI for the token's metadata.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.coreclimate.network/nft/";
    }
}
