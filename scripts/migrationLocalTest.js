const { ethers } = require("hardhat");

async function migrateBalances(deployer, alphaOne, betaTwo, holders) {
  for (let i = 0; i < holders.length; i++) {
    const holder = holders[i];
    const balance = await alphaOne.balanceOf(holder);

    if (balance > 0) {
      // Mint equivalent balance in BetaTwo for each holder
      await betaTwo.connect(deployer).transfer(holder, balance);
    }
  }
}

async function main() {
  const [deployer, addr1, addr2, addr3, taxWallet] = await ethers.getSigners();

  // Deploy AlphaOne contract
  const AlphaOne = await ethers.getContractFactory("AlphaOne");
  const alphaOne = await AlphaOne.deploy(taxWallet.address);
  await alphaOne.waitForDeployment();

  // Distribute AlphaOne tokens (amounts received are less than displayed below due to 5% tax)
  await alphaOne.connect(deployer).transfer(addr1.address, ethers.parseUnits("1052.63", 18)); // Adjusted for 5% tax
  await alphaOne.connect(deployer).transfer(addr2.address, ethers.parseUnits("2105.26", 18)); // Adjusted for 5% tax
  await alphaOne.connect(deployer).transfer(addr3.address, ethers.parseUnits("3157.89", 18)); // Adjusted for 5% tax

  // Deploy BetaTwo contract
  const BetaTwo = await ethers.getContractFactory("BetaTwo");
  const betaTwo = await BetaTwo.deploy();
  await betaTwo.waitForDeployment();

  // Get list of holders from AlphaOne
  const holders = [addr1.address, addr2.address, addr3.address];

  // Migrate balances
  await migrateBalances(deployer, alphaOne, betaTwo, holders);

  console.log("Migration completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });