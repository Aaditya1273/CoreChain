# CoreChain Climate Network - DePIN Architecture

## 🏗️ System Overview

CoreChain Climate Network is a decentralized physical infrastructure (DePIN) project that combines blockchain, IoT, and AI to create a transparent carbon credit marketplace powered by real-world environmental data.

## 🎯 Core Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ Node Ops    │ │ User Portal │ │ DAO Portal  │      │
│  │ Dashboard   │ │ (Staking)   │ │ (Voting)    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ API Gateway │ │ Auth Service│ │ Caching     │      │
│  │ (GraphQL)   │ │ (JWT/Web3)  │ │ (Redis)     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ IoT Data    │ │ AI Fraud    │ │ Oracle      │      │
│  │ Ingestion   │ │ Detection   │ │ Service     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN LAYER                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ Staking     │ │ Carbon      │ │ DAO         │      │
│  │ Contracts   │ │ Credits     │ │ Governance  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 DATA & STORAGE LAYER                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ PostgreSQL  │ │ InfluxDB    │ │ IPFS/Arweave│      │
│  │ (Metadata)  │ │ (Time-Series)│ │ (Files)     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    IOT DEVICES                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ Climate     │ │ Air Quality │ │ Energy      │      │
│  │ Sensors     │ │ Monitors    │ │ Meters      │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## 📋 Key Components

### 1. **Smart Contracts**
- **Staking**: Token staking with rewards distribution
- **Carbon Credits**: RWA tokenization of verified carbon offsets
- **DAO Governance**: Community voting and proposal management

### 2. **Backend Services**
- **IoT Ingestion**: Real-time sensor data processing
- **AI Fraud Detection**: ML-powered anomaly detection
- **Oracle Service**: External data feeds for contracts

### 3. **Frontend Applications**
- **Node Dashboard**: Device management for operators
- **User Portal**: Staking and trading interface
- **DAO Interface**: Governance participation

### 4. **Middleware**
- **API Gateway**: Single entry point for all client requests (GraphQL)
- **Authentication**: Secure access control using JWT and Web3 signatures
- **Caching**: In-memory data store for performance (Redis)

### 5. **Data & Storage**
- **Relational Database**: For structured data like user profiles (PostgreSQL)
- **Time-Series Database**: For high-frequency IoT sensor data (InfluxDB)
- **Decentralized Storage**: For immutable data and files (IPFS/Arweave)

### 6. **IoT Infrastructure**
- **Environmental Sensors**: Climate, air quality monitoring
- **Edge Computing**: Local data processing and validation
- **Secure Communication**: Encrypted data transmission

## 📚 Detailed Architecture

For a more detailed breakdown of each component, please see the following documents:

- [IoT Data Ingestion](./docs/architecture/iot-data-ingestion.md)
- [AI Fraud Detection Module](./docs/architecture/ai-fraud-detection.md)
- [Web3 Frontend Architecture](./docs/architecture/web3-frontend.md)
- [Scalability Plan](./docs/architecture/scalability-plan.md)

## 🔄 Data Flow

```
IoT Sensors → Edge Processing → AI Validation → Blockchain → User Interface
     ↓              ↓              ↓             ↓           ↓
  Raw Data → Data Cleaning → Fraud Check → Smart Contract → Dashboard
```

## 🎯 Scalability Goals

- **10,000+** concurrent users
- **50,000+** IoT devices
- **1,000+** TPS (Layer 2 scaling)
- **Sub-second** data processing latency
