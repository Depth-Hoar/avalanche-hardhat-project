async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the TESTINGSBDSecond token contract
  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy("TESTINGSBDSecond", "TSS");
  await token.deployed();

  console.log("Token deployed to:", token.address);

  // Deploy the Staking contract
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(token.address);
  await staking.deployed();

  console.log("Staking contract deployed to:", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
