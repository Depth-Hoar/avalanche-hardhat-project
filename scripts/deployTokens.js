require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {  
  const AlphaOne = await ethers.getContractFactory("AlphaOne");
  const alphaOne = await AlphaOne.deploy("0xbA7E2CeE28F4e10f630E9799876D699189b48Bc9");
  const alphaOneReceipt = await alphaOne.deploymentTransaction().wait();
  await alphaOne.waitForDeployment()
  const alphaOneAddress = await alphaOne.getAddress();
  console.log("AlphaOne deployed to:", alphaOneAddress);
  console.log("Gas used for AlphaOne deployment:", alphaOneReceipt.gasUsed.toString());

  const BetaTwo = await ethers.getContractFactory("BetaTwo");
  const betaTwo = await BetaTwo.deploy();
  await betaTwo.waitForDeployment()
  const betaTwoReceipt = await alphaOne.deploymentTransaction().wait();
  const betaTwoAddress = await betaTwo.getAddress();
  console.log("BetaTwo deployed to:", betaTwoAddress);
  console.log("Gas used for AlphaOne deployment:", betaTwoReceipt.gasUsed.toString());

  // Renounce ownership of AlphaOne token
  await alphaOne.renounceOwnership();
  console.log("Ownership of AlphaOne renounced");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
