// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title MockNodeIdentity
 * @dev Mock contract for testing NodeIdentity functionality
 */
contract MockNodeIdentity {
    mapping(address => uint256) private _balances;
    
    /**
     * @dev Sets the balance for a given address (for testing purposes)
     */
    function setBalance(address account, uint256 balance) external {
        _balances[account] = balance;
    }
    
    /**
     * @dev Returns the balance of the given address
     */
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }
}
