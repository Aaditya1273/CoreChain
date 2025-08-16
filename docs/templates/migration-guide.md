## Testnet/Mainnet Migration Guide

Migrating from a testnet to mainnet involves careful planning and execution.

1.  **Configuration:** Update your `hardhat.config.js` and `.env` file with the correct RPC URLs, chain IDs, and a secure private key for your deployment wallet.

2.  **Security Audit:** Before deploying to mainnet, it is highly recommended to get a full security audit of your smart contracts from a reputable firm.

3.  **Gas Planning:** Mainnet deployment can be expensive. Analyze gas costs and choose a time with lower network congestion.

4.  **Deployment Command:**
    ```bash
    # Example for mainnet
    npm run deploy:mainnet
    ```

5.  **Verification:** After deployment, verify your contracts on a block explorer like Etherscan. This provides transparency and trust.
    ```bash
    npm run verify:etherscan -- --network mainnet
    ```

6.  **Update Frontend:** Update the contract addresses in your frontend application to interact with the newly deployed mainnet contracts.
