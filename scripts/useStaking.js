require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer account:", deployer.address);

  const stakingAddress = "YOUR_STAKING_CONTRACT_ADDRESS"; // Replace with your staking contract address
  const tokenAddress = "YOUR_ERC20_TOKEN_ADDRESS"; // Replace with your ERC20 token address

  const stakingAbi = [
    "function fundContract(uint256 amount) external",
    "function stake(uint256 amount) external",
    "function claim() external",
    "function stakes(address) view returns (uint256 amount, uint256 startTime)",
  ];

  const tokenAbi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, deployer);
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, deployer);

  const amountToStake = ethers.utils.parseUnits("1000", 18);
  const amountToFund = ethers.utils.parseUnits("5000", 18);

  // Approve the staking contract to spend tokens
  await tokenContract.approve(stakingAddress, amountToFund);
  console.log("Approved staking contract to spend tokens.");

  // Fund the staking contract
  const fundTx = await stakingContract.fundContract(amountToFund);
  await fundTx.wait();
  console.log("Funded staking contract with transaction hash:", fundTx.hash);

  // Stake tokens
  await tokenContract.approve(stakingAddress, amountToStake);
  const stakeTx = await stakingContract.stake(amountToStake);
  await stakeTx.wait();
  console.log("Staked tokens with transaction hash:", stakeTx.hash);

  // Fast forward time by 1 hour
  await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
  await ethers.provider.send("evm_mine");

  // Claim tokens after 1 hour
  const claimTx1 = await stakingContract.claim();
  await claimTx1.wait();
  console.log("Claimed tokens after 1 hour with transaction hash:", claimTx1.hash);

  // Fast forward time by another hour (2 hours total)
  await tokenContract.transfer(deployer.address, amountToStake); // Transfer more tokens to test again
  await tokenContract.approve(stakingAddress, amountToStake);
  await stakingContract.stake(amountToStake);
  await ethers.provider.send("evm_increaseTime", [3600]); // 1 more hour
  await ethers.provider.send("evm_mine");

  // Claim tokens after 2 hours
  const claimTx2 = await stakingContract.claim();
  await claimTx2.wait();
  console.log("Claimed tokens after 2 hours with transaction hash:", claimTx2.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });