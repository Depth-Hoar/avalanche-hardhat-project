const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const AlphaOne = await ethers.getContractFactory("AlphaOne");
  const alphaOne = await AlphaOne.deploy(deployer.address);
  console.log("AlphaOne deployed to:", alphaOne.address);

  const BetaTwo = await ethers.getContractFactory("BetaTwo");
  const betaTwo = await BetaTwo.deploy();
  console.log("BetaTwo deployed to:", betaTwo.address);

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
