# CoreChain Climate Network - Project Structure

## 📁 Core Directories

```
CoreChain/
├── 📁 contracts/                    # Smart contracts
├── 📁 backend/                      # Backend services
├── 📁 frontend/                     # Web3 frontend
├── 📁 iot/                         # IoT device code
├── 📁 docs/                        # Documentation
├── 📁 scripts/                     # Deployment scripts
└── 📁 tests/                       # Testing suite
```

## 🔧 Smart Contracts Structure

```
contracts/
├── 📁 staking/
│   ├── StakingPool.sol
│   ├── StakingRewards.sol
│   └── StakingGovernance.sol
├── 📁 carbon/
│   ├── CarbonCreditNFT.sol
│   ├── CarbonMarketplace.sol
│   └── CarbonVerification.sol
├── 📁 dao/
│   ├── DAOGovernance.sol
│   ├── ProposalManager.sol
│   └── VotingMechanism.sol
└── 📁 utils/
    ├── AccessControl.sol
    └── ReentrancyGuard.sol
```

## 🖥️ Backend Services Structure

```
backend/
├── 📁 iot-ingestion/
│   ├── 📁 src/
│   ├── 📁 config/
│   └── package.json
├── 📁 ai-fraud-detection/
│   ├── 📁 src/
│   ├── 📁 models/
│   └── requirements.txt
├── 📁 oracle-service/
│   ├── 📁 src/
│   └── package.json
└── 📁 api-gateway/
    ├── 📁 src/
    └── package.json
```

## 🌐 Frontend Structure

```
frontend/
├── 📁 src/
│   ├── 📁 components/
│   ├── 📁 pages/
│   ├── 📁 hooks/
│   └── 📁 utils/
├── 📁 public/
├── next.config.js
└── package.json
```

## 🔌 IoT Structure

```
iot/
├── 📁 firmware/
│   ├── 📁 climate-sensor/
│   ├── 📁 air-quality/
│   └── 📁 energy-meter/
├── 📁 edge-computing/
└── 📁 simulators/
```

## 🏛️ Architecture Documentation

This project structure is based on the detailed architecture defined in the following documents:

- [Overall System Architecture](../ARCHITECTURE.md)
- [IoT Data Ingestion](./docs/architecture/iot-data-ingestion.md)
- [AI Fraud Detection Module](./docs/architecture/ai-fraud-detection.md)
- [Web3 Frontend Architecture](./docs/architecture/web3-frontend.md)
- [Scalability Plan](./docs/architecture/scalability-plan.md)
