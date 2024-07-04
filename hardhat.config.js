require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
const privateKey = process.env.PRIVATE_KEY
const alchemyKey = process.env.ALCHEMY_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [privateKey],
    }
  }
};
