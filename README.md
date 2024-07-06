# Sample Hardhat Project

setup

```shell
git clone https://github.com/Depth-Hoar/avalanche-hardhat-project.git
cd avalanche-hardhat-project
npm install
```

make a `.env` file

```shell
PRIVATE_KEY=your_private_key_here
```

hardhat commands

````shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js


tests
```shell
npx hardhat test test/AlphaOne.js
npx hardhat test test/BetaTwo.js
npx hardhat test test/Migration.js
npx hardhat test test/Staking.js
````

test locally in a seperate terminal run `npx hardhat node`

```shell
npx hardhat run scripts/deployTokens.js --network localhost
npx hardhat run scripts/migrationLocalTest.js --network localhost
npx hardhat run scripts/deployStaking.js --network localhost
npx hardhat run scripts/useStaking.js --network localhost
```

for `useStaking.js` update the addresses accordingly in the file after running deployStaking.js

run api server

```shell
node server.js
```
