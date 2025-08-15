require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: { evmVersion: "shanghai" },
      },
      {
        version: "0.8.24",
        settings: { evmVersion: "shanghai" },
      },
    ],
  },
  networks: {
    coreTestnet: {
      url: process.env.CORE_TESTNET_RPC_URL || "https://rpc.test.btcs.network",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 1115,
    },
    coreMainnet: {
      url: process.env.CORE_MAINNET_RPC_URL || "https://rpc.coredao.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 1116,
    },
  },
  etherscan: {
    apiKey: {
      coreTestnet: process.env.CORESCAN_API_KEY,
    },
    customChains: [
      {
        network: "coreTestnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network",
        },
      },
      {
        network: "coreMainnet",
        chainId: 1116,
        urls: {
          apiURL: "https://api.scan.coredao.org/api",
          browserURL: "https://scan.coredao.org",
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Optional: for price conversion
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
