// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title CoreTimelock
 * @dev A TimelockController for the Core DAO.
 * This contract enforces a delay on all administrative actions executed by the DAO,
 * providing a safety buffer for users to react to governance decisions.
 */
contract CoreTimelock is TimelockController {
    /**
     * @param minDelay The minimum delay in seconds between a proposal passing and its execution.
     * @param proposers An array of addresses that are allowed to submit proposals to the timelock. (Typically just the Governor contract).
     * @param executors An array of addresses that are allowed to execute proposals. (Can be anyone, or restricted).
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors, msg.sender) {}
}
