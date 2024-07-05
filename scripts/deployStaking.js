async function main() {

  // Deploy the TESTINGSBDSecond token contract
  const Token = await ethers.getContractFactory("ERC20Mock");
  const token = await Token.deploy("TESTINGSBDSecond", "TSS", "0xbA7E2CeE28F4e10f630E9799876D699189b48Bc9", ethers.parseUnits("1000000000000", 18));
  await token.waitForDeployment();
  const tokenReceipt = await token.deploymentTransaction().wait();
  const tokenAddress = await token.getAddress();
  console.log("Token contract deployed to:", tokenAddress);
  console.log("Gas used for AlphaOne deployment:", tokenReceipt.gasUsed.toString());

  // Deploy the Staking contract
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingReceipt = await staking.deploymentTransaction().wait();
  const stakingAddress = await token.getAddress();
  console.log("Staking contract deployed to:", stakingAddress);
  console.log("Gas used for AlphaOne deployment:", stakingReceipt.gasUsed.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
