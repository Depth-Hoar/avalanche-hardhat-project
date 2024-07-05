const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
  let staking, token;
  let deployer, addr1, addr2;
  const ONE_HOUR = 3600;
  const TWO_HOURS = 7200;

  beforeEach(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();

    // Deploy the ERC20 token (TESTINGSBDSecond)
    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("TESTINGSBDSecond", "TSS", deployer.address, ethers.parseUnits("1000000000000", 18));
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();  // Get the token address

    // Deploy the Staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(tokenAddress);
    await staking.waitForDeployment();
    const stakeAddress = await staking.getAddress();  // Get the token address

    // Approve staking contract to spend tokens
    await token.connect(deployer).approve(stakeAddress, ethers.parseUnits("10000", 18));
    await token.connect(addr1).approve(stakeAddress, ethers.parseUnits("10000", 18));
    await token.connect(addr2).approve(stakeAddress, ethers.parseUnits("10000", 18));

    // Fund the staking contract and addresses with tokens
    await staking.connect(deployer).fundContract(ethers.parseUnits("2000", 18));
    await token.connect(deployer).transfer(addr1.address, ethers.parseUnits("1000", 18));
    await token.connect(deployer).transfer(addr2.address, ethers.parseUnits("1000", 18));
  });

  it("should allow users to stake tokens", async function () {
    const stakeAmount = ethers.parseUnits("1000", 18);
    
    await staking.connect(deployer).stake(stakeAmount);
    const stake = await staking.stakes(deployer.address);

    expect(stake.amount).to.equal(stakeAmount);
    expect(stake.startTime).to.be.gt(0);
  });

  it("should calculate rewards correctly after 1 hour", async function () {
    const stakeAmount = ethers.parseUnits("1000", 18);
    await staking.connect(addr1).stake(stakeAmount);

    // Fast forward time by 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR]);
    await ethers.provider.send("evm_mine");

    await staking.connect(addr1).claim();

    const finalBalance = await token.balanceOf(addr1.address);
    const expectedRewardBigInt = (stakeAmount * BigInt(5)) / BigInt(100);  // 5% reward
    const expectedBalanceBigInt = stakeAmount + expectedRewardBigInt;

    expect(finalBalance).to.equal(expectedBalanceBigInt);
  });

  it("should calculate rewards correctly after 2 hours", async function () {
    const stakeAmount = ethers.parseUnits("1000", 18);
    await staking.connect(addr1).stake(stakeAmount);
  
    // Fast forward time by 2 hours
    await ethers.provider.send("evm_increaseTime", [TWO_HOURS]);
    await ethers.provider.send("evm_mine");
  
    await staking.connect(addr1).claim();
  
    const finalBalance = await token.balanceOf(addr1.address);
    const expectedRewardBigInt = (stakeAmount * BigInt(10)) / BigInt(100);  // 10% reward
    const expectedBalanceBigInt = stakeAmount + expectedRewardBigInt;
  
    expect(finalBalance).to.equal(expectedBalanceBigInt);
  });

  it("should allow claiming principal without rewards before 1 hour", async function () {
    const stakeAmount = ethers.parseUnits("1000", 18);
  
    await staking.connect(addr1).stake(stakeAmount);
  
    // Fast forward time by less than 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR - 100]);
    await ethers.provider.send("evm_mine");
  
    await staking.connect(addr1).claim();
  
    const finalBalance = await token.balanceOf(addr1.address);
    expect(finalBalance).to.equal(stakeAmount); // Initial 2000 - 1000 staked + 1000 claimed (no rewards)
  });
  

  it("should reset stake after claiming", async function () {
    const stakeAmount = ethers.parseUnits("1000", 18);

    await staking.connect(addr1).stake(stakeAmount);

    // Fast forward time by 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR]);
    await ethers.provider.send("evm_mine");

    await staking.connect(addr1).claim();
    const stake = await staking.stakes(addr1.address);

    expect(stake.amount).to.equal(0);
  });
});
