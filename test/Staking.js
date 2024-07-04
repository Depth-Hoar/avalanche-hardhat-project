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
    token = await Token.deploy("TESTINGSBDSecond", "TSS", deployer.address, ethers.utils.parseUnits("10000", 18));
    await token.deployed();

    // Deploy the Staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);
    await staking.deployed();

    // Approve staking contract to spend tokens
    await token.connect(deployer).approve(staking.address, ethers.utils.parseUnits("10000", 18));
    await token.connect(addr1).approve(staking.address, ethers.utils.parseUnits("10000", 18));
    await token.connect(addr2).approve(staking.address, ethers.utils.parseUnits("10000", 18));
  });

  it("should allow users to stake tokens", async function () {
    const stakeAmount = ethers.utils.parseUnits("1000", 18);
    
    await staking.connect(deployer).stake(stakeAmount);
    const stake = await staking.stakes(deployer.address);

    expect(stake.amount).to.equal(stakeAmount);
    expect(stake.startTime).to.be.gt(0);
  });

  it("should calculate rewards correctly after 1 hour", async function () {
    const stakeAmount = ethers.utils.parseUnits("1000", 18);

    await staking.connect(deployer).stake(stakeAmount);

    // Fast forward time by 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR]);
    await ethers.provider.send("evm_mine");

    await staking.connect(deployer).claim();
    const finalBalance = await token.balanceOf(deployer.address);
    const expectedReward = stakeAmount.mul(5).div(100);
    const expectedBalance = stakeAmount.add(expectedReward);

    expect(finalBalance).to.equal(expectedBalance);
  });

  it("should calculate rewards correctly after 2 hours", async function () {
    const stakeAmount = ethers.utils.parseUnits("1000", 18);

    await staking.connect(deployer).stake(stakeAmount);

    // Fast forward time by 2 hours
    await ethers.provider.send("evm_increaseTime", [TWO_HOURS]);
    await ethers.provider.send("evm_mine");

    await staking.connect(deployer).claim();
    const finalBalance = await token.balanceOf(deployer.address);
    const expectedReward = stakeAmount.mul(10).div(100);
    const expectedBalance = stakeAmount.add(expectedReward);

    expect(finalBalance).to.equal(expectedBalance);
  });

  it("should not allow claiming rewards before 1 hour", async function () {
    const stakeAmount = ethers.utils.parseUnits("1000", 18);

    await staking.connect(deployer).stake(stakeAmount);

    // Fast forward time by less than 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR - 100]);
    await ethers.provider.send("evm_mine");

    await expect(staking.connect(deployer).claim()).to.be.revertedWith("No staked tokens found");
  });

  it("should reset stake after claiming", async function () {
    const stakeAmount = ethers.utils.parseUnits("1000", 18);

    await staking.connect(deployer).stake(stakeAmount);

    // Fast forward time by 1 hour
    await ethers.provider.send("evm_increaseTime", [ONE_HOUR]);
    await ethers.provider.send("evm_mine");

    await staking.connect(deployer).claim();
    const stake = await staking.stakes(deployer.address);

    expect(stake.amount).to.equal(0);
  });
});
