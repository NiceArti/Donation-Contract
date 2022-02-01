//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Donation is Ownable
{
    address[] private _donators;                    // storring everyone who donated
    mapping(address => uint256) private _donated;   // storring user's sum of donated money

    constructor() Ownable(){}

    // donate main networking cryptocurency
    function donate() public payable returns(bool)
    {
        if(_donated[_msgSender()] == 0)
            _donators.push(_msgSender());
        
        _donated[_msgSender()] += msg.value;

        return true;
    }

    
    // show list of all donators and their donations
    function donators() public view returns(address[] memory)
    {
        require(_donators.length > 0);
        return _donators;
    }

    // shows donations of account you setted
    function getDonation(address account) public view returns(uint)
    {
        return _donated[account];
    }


    // only owner can withdraw donation to specific account
    function withdraw(address account, uint amount) 
    public
    onlyOwner()
    returns(bool)
    {
        require(address(this).balance >= amount, "Donation: insufficient balance");
        payable(address(account)).transfer(amount);

        return true;
    }

    // shows donator by id
    function getDonator(uint id) public view returns(address)
    {
        return id < _donators.length ? _donators[id] : _donators[_donators.length - 1];
    }
}
