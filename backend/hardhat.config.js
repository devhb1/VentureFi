/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
    solidity: "0.8.0",
    paths: {
        sources: "./contracts", // Location of your contracts
        tests: "./test",        // Location of your tests
        cache: "./cache",       // Cache folder
        artifacts: "./artifacts" // Artifacts folder
    },
    networks: {
        sepolia: {
            url: process.env.ETH_SEP_INFURA_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_INFURA_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        baseMainnet: {
            url: process.env.BASE_MAINNET_INFURA_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY,
            base: process.env.BASESCAN_API_KEY
        }
    }
};