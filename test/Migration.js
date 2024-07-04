const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Migration", function () {
  let alphaOne, betaTwo;
  let deployer, addr1, addr2, taxWallet;

  before(async function () {
    [deployer, addr1, addr2, addr3, taxWallet] = await ethers.getSigners();

    // Deploy AlphaOne contract
    const AlphaOne = await ethers.getContractFactory("AlphaOne");
    alphaOne = await AlphaOne.deploy(taxWallet.address);
    await alphaOne.waitForDeployment()

    // Distribute AlphaOne tokens (amounts received are less than displayed below due to 5% tax)
    await alphaOne.connect(deployer).transfer(addr1.address, ethers.parseUnits("1000", 18));
    await alphaOne.connect(deployer).transfer(addr2.address, ethers.parseUnits("2000", 18));
    await alphaOne.connect(deployer).transfer(addr3.address, ethers.parseUnits("3000", 18));

    // Deploy BetaTwo contract
    const BetaTwo = await ethers.getContractFactory("BetaTwo");
    betaTwo = await BetaTwo.deploy();
    await betaTwo.waitForDeployment()
  });

  it("should migrate balances from AlphaOne to BetaTwo", async function () {
    // Migrate balances
    const holders = [addr1.address, addr2.address, addr3.address];
    for (let i = 0; i < holders.length; i++) {
      const holder = holders[i];
      const balance = await alphaOne.balanceOf(holder);

      if (balance > 0) {
        await betaTwo.connect(deployer).transfer(holder, balance);
      }
    }

    balanceAddr1alpha = await alphaOne.balanceOf(addr1.address)
    balanceAddr1Beta = await betaTwo.balanceOf(addr1.address)
    balanceAddr2Beta = await betaTwo.balanceOf(addr2.address)
    balanceAddr3Beta = await betaTwo.balanceOf(addr3.address)

    // Check BetaTwo balances
    expect(await betaTwo.balanceOf(addr1.address)).to.equal(ethers.parseUnits("950", 18));
    expect(await betaTwo.balanceOf(addr2.address)).to.equal(ethers.parseUnits("1900", 18));
    expect(await betaTwo.balanceOf(addr3.address)).to.equal(ethers.parseUnits("2850", 18));
  });
});






// ----------------------------------------------------------------


// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Token Migration", function () {
//   let alphaOne, betaTwo;
//   let deployer, addr1, addr2, taxWallet;

//   before(async function () {
//     [deployer, addr1, addr2, taxWallet] = await ethers.getSigners();

//     // Deploy AlphaOne contract
//     const AlphaOne = await ethers.getContractFactory("AlphaOne");
//     alphaOne = await AlphaOne.deploy(taxWallet.address);
//     await alphaOne.deployed();

//     // Distribute AlphaOne tokens to addr1 and addr2
//     await alphaOne.transfer(addr1.address, ethers.utils.parseUnits("1000", 18));
//     await alphaOne.transfer(addr2.address, ethers.utils.parseUnits("2000", 18));

//     // Deploy BetaTwo contract
//     const BetaTwo = await ethers.getContractFactory("BetaTwo");
//     betaTwo = await BetaTwo.deploy();
//     await betaTwo.deployed();
//   });

//   it("should migrate balances from AlphaOne to BetaTwo", async function () {
//     // Get balances from AlphaOne
//     const addr1Balance = await alphaOne.balanceOf(addr1.address);
//     const addr2Balance = await alphaOne.balanceOf(addr2.address);

//     // Mint equivalent balances in BetaTwo to deployer
//     await betaTwo.connect(deployer).transfer(addr1.address, addr1Balance);
//     await betaTwo.connect(deployer).transfer(addr2.address, addr2Balance);

//     // Verify BetaTwo balances
//     expect(await betaTwo.balanceOf(addr1.address)).to.equal(addr1Balance);
//     expect(await betaTwo.balanceOf(addr2.address)).to.equal(addr2Balance);
//   });
// });