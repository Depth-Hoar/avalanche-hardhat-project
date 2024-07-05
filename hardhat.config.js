require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
const privateKey = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: `https://api.avax-test.network/ext/bc/C/rpc`,
        accounts: [privateKey],
        // gasPrice: 30000000000,
        // blockNumber: 19357137,
      }
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [privateKey],
    },
    sepolia: {
      url: 'https://eth-sepolia.api.onfinality.io/public',
      accounts: [privateKey],
    }
    
  }
};
