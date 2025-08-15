# Web3 Frontend Architecture

## 1. Overview

The Web3 frontend is the primary interface for users and node operators to interact with the CoreChain Climate Network. It consists of three main applications:

1.  **Node Operator Dashboard**: For managing IoT devices, monitoring performance, and tracking rewards.
2.  **User Portal**: For staking tokens, trading carbon credit NFTs, and viewing portfolio performance.
3.  **DAO Portal**: For participating in governance by creating and voting on proposals.

## 2. Technology Stack

-   **Framework**: Next.js 14 (with App Router)
-   **Language**: TypeScript
-   **Web3 Integration**: Wagmi & Viem for interacting with the blockchain.
-   **Wallet Connector**: RainbowKit for a seamless multi-wallet connection experience.
-   **UI Components**: Shadcn/UI, built on Tailwind CSS and Radix UI, for a modern, accessible, and customizable design system.
-   **State Management**: Zustand for simple, scalable global state management.
-   **Data Fetching**: TanStack Query (React Query) for efficient data synchronization with the backend.
-   **Charting**: Recharts for data visualizations and dashboards.

## 3. Component Architecture

The frontend will be built using a modular, component-based architecture to maximize reusability and maintainability.

```
/src
├── /app                # Next.js App Router structure
│   ├── /dashboard      # Node Operator Dashboard
│   ├── /portal         # User Portal (Staking, Marketplace)
│   └── /governance     # DAO Portal
├── /components
│   ├── /ui             # Reusable UI elements (Shadcn/UI)
│   ├── /common         # Shared components (Header, Footer)
│   └── /specific       # Components for specific features (e.g., StakingForm)
├── /lib
│   ├── /web3           # Web3 provider, contract instances
│   └── /utils          # Utility functions
├── /hooks              # Custom React hooks (e.g., useStakingInfo)
└── /store              # Zustand state management stores
```

## 4. State Management Strategy

-   **Local State**: Managed within components using `useState` and `useReducer` for simple UI state.
-   **Server State**: Managed by TanStack Query, which handles caching, refetching, and synchronization of backend data.
-   **Global State**: Managed by Zustand for shared client-side state, such as wallet connection status and user authentication.

## 5. Key Features

-   **Responsive Design**: Fully responsive and mobile-first.
-   **Real-time Updates**: WebSocket integration for live data feeds (e.g., token prices, proposal status).
-   **Wallet Agnostic**: Supports a wide range of wallets via RainbowKit.
-   **Type Safety**: End-to-end type safety with TypeScript.
