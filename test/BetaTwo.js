const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BetaTwo", function () {
  let betaTwo;
  // let deployer, addr1, addr2, taxWallet;
  const initialSupply = ethers.parseUnits("12000000", 18);

  before(async function () {
    [deployer, addr1, addr2, taxWallet] = await ethers.getSigners();

    // Deploy BetaTwo contract
    const BetaTwo = await ethers.getContractFactory("BetaTwo");
    betaTwo = await BetaTwo.deploy();
    await betaTwo.waitForDeployment()
  });

  it("should have the correct total supply", async function () {
    const totalSupply = await betaTwo.totalSupply();
    expect(totalSupply).to.equal(initialSupply);
  });

});