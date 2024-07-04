// async function migrateBalances(alphaOne, betaTwo, holders) {
//   for (let i = 0; i < holders.length; i++) {
//     const holder = holders[i];
//     const balance = await alphaOne.balanceOf(holder);

//     if (balance.gt(0)) {
//       await betaTwo.transfer(holder, balance);
//     }
//   }
// }

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   // Assuming you have deployed AlphaOne and BetaTwo contracts
//   const AlphaOne = await ethers.getContractFactory("AlphaOne");
//   const alphaOne = await AlphaOne.deploy(deployer.address);

//   const BetaTwo = await ethers.getContractFactory("BetaTwo");
//   const betaTwo = await BetaTwo.deploy();

//   // Get list of holders from AlphaOne (this might involve off-chain logic)
//   const holders = [/* list of holder addresses */];

//   // Migrate balances
//   await migrateBalances(alphaOne, betaTwo, holders);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });