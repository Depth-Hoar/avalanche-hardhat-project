// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BetaTwo is ERC20 {
    constructor() ERC20("BetaTwo", "BTWO") {
        _mint(msg.sender, 12000000 * 10 ** decimals());
    }
}
