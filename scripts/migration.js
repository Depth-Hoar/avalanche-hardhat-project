const { ethers } = require("hardhat");
const walletAddresses = require('../helpers/wallets');

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
  const [deployer] = await ethers.getSigners();

  // Attach to the deployed AlphaOne contract
  const AlphaOne = await ethers.getContractFactory("AlphaOne");
  const alphaOne = AlphaOne.attach("0x85A49208B1E3af27ca77c3Cd9487bD97cDC4a682");

  // Attach to the deployed BetaTwo contract
  const BetaTwo = await ethers.getContractFactory("BetaTwo");
  const betaTwo = BetaTwo.attach("0xdB79a6f1B9f05F769DeA0449D265CCe836159357");

  // Distribute AlphaOne tokens (amounts received are less than displayed below due to 5% tax)
  const tx1 = await alphaOne.connect(deployer).transfer(walletAddresses[1], ethers.parseUnits("1052.63", 18)); // Adjusted for 5% tax
  await tx1.wait();  // Wait for the transaction to be mined
  console.log(`Transferred tokens to ${walletAddresses[1]}`);

  const tx2 = await alphaOne.connect(deployer).transfer(walletAddresses[2], ethers.parseUnits("2105.26", 18)); // Adjusted for 5% tax
  await tx2.wait();  // Wait for the transaction to be mined
  console.log(`Transferred tokens to ${walletAddresses[2]}`);

  const tx3 = await alphaOne.connect(deployer).transfer(walletAddresses[3], ethers.parseUnits("3157.89", 18)); // Adjusted for 5% tax
  await tx3.wait();  // Wait for the transaction to be mined
  console.log(`Transferred tokens to ${walletAddresses[3]}`);

  // Get list of holders from AlphaOne
  const holders = [walletAddresses[1], walletAddresses[2], walletAddresses[3]];

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