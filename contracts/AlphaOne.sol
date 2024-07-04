// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlphaOne is ERC20, Ownable {
    address public taxWallet;
    uint256 public taxRate = 5; // 5% tax
    address private constant NO_OWNER = address(0xdead);

    constructor(
        address _taxWallet
    ) ERC20("AlphaOne", "AONE") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
        taxWallet = _taxWallet;
    }

    function renounceOwnership() public override onlyOwner {
        _transferOwnership(NO_OWNER);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 taxAmount = (amount * taxRate) / 100;
        uint256 netAmount = amount - taxAmount;

        _transfer(_msgSender(), taxWallet, taxAmount);
        _transfer(_msgSender(), recipient, netAmount);
        return true;
    }
}
