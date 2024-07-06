require("dotenv").config();
const express = require("express");
const { ethers, JsonRpcProvider } = require('ethers');

const app = express();
app.use(express.json());

const provider = new JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const stakingContractAddress = "0x155054F1445EF5787cAB029EA39Dc1C65814ab28"; // Replace with your deployed contract address
const stakingAbi = [
  // ABI of the Staking contract
  "function stake(uint256 amount) external",
  "function claim() external",
  "function fundContract(uint256 amount) external",
];

const stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, wallet);

app.post("/stake", async (req, res) => {
  try {
    const { amount } = req.body;
    const tx = await stakingContract.stake(ethers.utils.parseUnits(amount.toString(), 18));
    await tx.wait();
    res.status(200).send({ message: "Staked successfully", txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/claim", async (req, res) => {
  try {
    const tx = await stakingContract.claim();
    await tx.wait();
    res.status(200).send({ message: "Claimed successfully", txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
