## Core Blockchain Deployment

Deploying the smart contracts is the first step to getting the application running on a live network.

1.  **Compile Contracts:**
    Ensure all contracts are compiled without errors.
    ```bash
    npx hardhat compile
    ```

2.  **Run Tests:**
    It's critical to run all tests before deployment.
    ```bash
    npx hardhat test
    ```

3.  **Deploy to a Network:**
    Use the deployment scripts to deploy to your target network (e.g., `localhost`, `sepolia`, `mainnet`). Ensure your `.env` is configured for the target network.
    ```bash
    npx hardhat run scripts/deploy.js --network <network-name>
    ```
