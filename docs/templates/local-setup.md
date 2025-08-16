## Local Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/CoreChain.git
    cd CoreChain
    ```

2.  **Install Dependencies:**
    ```bash
    # Install root, frontend, and backend dependencies
    npm install
    cd frontend && npm install && cd ..
    cd backend && npm install && cd ..
    ```

3.  **Configure Environment:**
    Create a `.env` file from the example and add your configuration details, such as API keys and private keys.
    ```bash
    cp .env.example .env
    ```

4.  **Run a Local Blockchain:**
    Open a terminal and start a local Hardhat node.
    ```bash
    npx hardhat node
    ```

5.  **Start Development Servers:**
    Open two additional terminals to run the frontend and backend.
    ```bash
    # Terminal 2: Start Frontend (http://localhost:3000)
    cd frontend
    npm run dev
    
    # Terminal 3: Start Backend
    cd ../backend
    npm run dev
    ```
