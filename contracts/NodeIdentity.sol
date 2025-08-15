// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NodeIdentity
 * @dev A Soulbound Token (SBT) contract for Decentralized Identity (DID).
 * Each token represents a verified node operator and is non-transferable.
 */
contract NodeIdentity is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from an operator's address to their KYC verification hash (IPFS CID).
    mapping(address => string) public kycVerificationHashes;

    // Event emitted when a new identity is issued.
    event IdentityIssued(address indexed operator, uint256 indexed tokenId, string kycHash);

    constructor() ERC721("CoreNodeIdentity", "CNI") Ownable(msg.sender) {}

    /**
     * @dev Issues a new soulbound identity token to a verified node operator.
     * Can only be called by the contract owner (the verification authority).
     * @param operator The address of the node operator to receive the SBT.
     * @param kycHash The IPFS CID of the operator's KYC verification documents.
     */
    function issue(address operator, string memory kycHash) public onlyOwner {
        require(balanceOf(operator) == 0, "Operator already has an identity token");
        require(bytes(kycHash).length > 0, "KYC hash cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(operator, tokenId);

        kycVerificationHashes[operator] = kycHash;
        emit IdentityIssued(operator, tokenId, kycHash);

        _tokenIdCounter.increment();
    }

    /**
     * @dev Overrides the ERC721 transfer hooks to make the token non-transferable (soulbound).
     * Tokens can only be minted (from address 0) and burned (to address 0).
     */
    function _beforeTokenTransfer(address from, address to, uint256 /*tokenId*/) internal virtual override {
        require(from == address(0) || to == address(0), "SBTs are non-transferable");
    }

    /**
     * @dev Returns the base URI for token metadata. Can point to a service that resolves metadata using the IPFS hash.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.coreclimate.network/identity/";
    }
}
