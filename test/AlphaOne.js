const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlphaOne", function () {
  let alphaOne;
  let deployer, addr1, taxWallet;

  before(async function () {
    [deployer, addr1, taxWallet] = await ethers.getSigners();
    // Deploy AlphaOne contract
    const AlphaOne = await ethers.getContractFactory("AlphaOne");
    alphaOne = await AlphaOne.deploy(taxWallet.address);
    await alphaOne.waitForDeployment()
  });

  it("should have the correct total supply", async function () {
    const totalSupply = await alphaOne.totalSupply();
    expect(totalSupply).to.equal(ethers.parseUnits("1000000", 18));
  });

  it("should have the correct owner", async function () {
    const owner = await alphaOne.owner();
    expect(owner).to.equal(deployer.address);
  });

  it("should renounce ownership", async function () {
    await alphaOne.renounceOwnership();
    const owner = await alphaOne.owner();
    expect(owner).to.equal("0x000000000000000000000000000000000000dEaD");
  });

  it("should correctly transfer tokens with tax", async function () {
    const amount = ethers.parseUnits("1000", 18);
    const taxAmount = ethers.parseUnits("50", 18); // 5% tax
    const netAmount = ethers.parseUnits("950", 18); // 95% to recipient

    // Transfer tokens from deployer to addr1
    await alphaOne.connect(deployer).transfer(addr1.address, amount);

    // Check balances
    const deployerBalance = await alphaOne.balanceOf(deployer.address);
    const addr1Balance = await alphaOne.balanceOf(addr1.address);
    const taxWalletBalance = await alphaOne.balanceOf(taxWallet.address);

    expect(deployerBalance).to.equal(ethers.parseUnits("999000", 18));
    expect(addr1Balance).to.equal(netAmount);
    expect(taxWalletBalance).to.equal(taxAmount);
  });
});
