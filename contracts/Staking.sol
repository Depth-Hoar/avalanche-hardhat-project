// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    IERC20 public stakingToken;
    uint256 public constant ONE_HOUR = 1 hours;
    uint256 public constant TWO_HOURS = 2 hours;

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 startTime);
    event Claimed(address indexed user, uint256 amount, uint256 reward);

    constructor(IERC20 _stakingToken) {
        stakingToken = _stakingToken;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0 tokens");

        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = Stake({
            amount: amount,
            startTime: block.timestamp
        });

        emit Staked(msg.sender, amount, block.timestamp);
    }

    function claim() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No staked tokens found");

        uint256 stakingDuration = block.timestamp - userStake.startTime;
        uint256 reward = calculateReward(userStake.amount, stakingDuration);

        uint256 totalAmount = userStake.amount + reward;
        userStake.amount = 0; // Reset stake

        stakingToken.transfer(msg.sender, totalAmount);

        emit Claimed(msg.sender, userStake.amount, reward);
    }

    function calculateReward(
        uint256 amount,
        uint256 duration
    ) internal pure returns (uint256) {
        if (duration >= TWO_HOURS) {
            return (amount * 10) / 100; // 10% reward
        } else if (duration >= ONE_HOUR) {
            return (amount * 5) / 100; // 5% reward
        } else {
            return 0; // No reward for staking less than 1 hour
        }
    }
}
