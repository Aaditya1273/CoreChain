// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title NodeIdentity
 * @dev A Soulbound Token (SBT) contract for Decentralized Identity (DID).
 * Each token represents a verified node operator and is non-transferable.
 */
contract NodeIdentity is ERC721Enumerable, Ownable, Pausable {
    uint256 private _tokenIdCounter;

    // Mapping from an operator's address to their KYC verification hash (IPFS CID).
    mapping(address => string) private _kycHashes;

    // Mapping from a token ID to the operator's address.
    mapping(uint256 => address) private _tokenOwners;

    event KYCVerified(address indexed operator, string kycHash);

    /**
     * @dev Sets the name and symbol for the SBT collection.
     */
    constructor() ERC721("CoreNodeIdentity", "CNI") {}

    /**
     * @dev Overrides the ERC721 transfer hooks to make the token non-transferable (soulbound).
     * Tokens can only be minted (from address 0) and burned (to address 0).
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        require(from == address(0) || to == address(0), "SBTs are non-transferable");
    }

    /**
     * @dev Mints a new SBT for a verified node operator.
     * @param _operator The address of the node operator.
     * @param _kycHash The IPFS CID of the operator's KYC documents.
     */
    function mint(address _operator, string memory _kycHash) external onlyOwner {
        require(_operator != address(0), "Cannot mint to the zero address");
        require(balanceOf(_operator) == 0, "Operator already has an identity token");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(_operator, newTokenId);
        _kycHashes[_operator] = _kycHash;
        _tokenOwners[newTokenId] = _operator;

        emit KYCVerified(_operator, _kycHash);
    }

    /**
     * @dev Burns the SBT of a node operator, revoking their identity.
     * @param _operator The address of the node operator whose token to burn.
     */
    function burn(address _operator) external onlyOwner {
        require(balanceOf(_operator) > 0, "Operator does not have an identity token");
        uint256 tokenId = tokenOfOwnerByIndex(_operator, 0);
        _burn(tokenId);
        delete _kycHashes[_operator];
        delete _tokenOwners[tokenId];
    }

    /**
     * @dev Returns the KYC hash for a given node operator.
     * @param _operator The address of the node operator.
     * @return The IPFS CID string of the KYC documents.
     */
    function getKycHash(address _operator) external view returns (string memory) {
        return _kycHashes[_operator];
    }

    // Required override for multiple inheritance
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
