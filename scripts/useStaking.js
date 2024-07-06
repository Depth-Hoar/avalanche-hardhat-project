require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer account:", deployer.address);

  const stakingAddress = "0xc07dD2736fa70059d00e927671EF76496b1050Bf"; // Replace with your staking contract address
  const tokenAddress = "0x3Fce2bD1Cb657901298fFFC1a8b1696070b7B8c3"; // Replace with your ERC20 token address

  const stakingAbi = require("../artifacts/contracts/Staking.sol/Staking.json");
  const tokenAbi = require("../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json");

  const stakingContract = new ethers.Contract(stakingAddress, stakingAbi.abi, deployer);
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi.abi, deployer);

  const amountToStake = ethers.parseUnits("10", 18);
  const amountToFund = ethers.parseUnits("50", 18);

  let deployerBalance = await tokenContract.balanceOf(deployer.address);
  console.log("Deployer balance before funding:", ethers.formatUnits(deployerBalance, 18));

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