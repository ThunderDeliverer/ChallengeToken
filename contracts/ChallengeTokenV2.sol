// SPDX-License-Identifier: MIT
pragma solidity =0.8.6;

import "./ChallengeToken.sol";

/// @title ChallengeTokenV2
/// @author Jan Turk
contract ChallengeTokenV2 is ChallengeToken {
  uint8 public percetnageOfEtherToRedeemWithBurning;
  bool reentrancyGuard;

  /// @notice Used to set the percentage of ETH the address gets back when burning tokens.
  /// @dev This could be hardcoded, but it makes more sense to have it dynamically set.
  /// @param _percentage Percentage to be used when calculating how much ETH should the user receive for burning tokens. It should be (0,100].
  /// @return success Status of successful execution of function.
  function setPercentageOfEtherToReddemWithBurning(uint8 _percentage) public onlyOwner returns(bool success){
    require(0 < _percentage && 100 >= _percentage, "_percentage value has to be between 0 and 100");
    percetnageOfEtherToRedeemWithBurning = _percentage;
    return true;
  }

  /// @notice Used to burn the tokens in order to receive a percentage of ETH back.
  /// @dev Setting the percentage of ETH to be sent to the user after burning the tokens is prerequisite for this function.
  /// @param _amount Amount of tokens to be burned. The amount of tokens to be burned should be multiplied by the decimal spaces used. In our case that is if you want to burn one token, the calculation should be: 1 * 10^18.
  /// @return success Status of successful execution of the function.
  function burnTokens(uint256 _amount) public returns(bool success){
    require(percetnageOfEtherToRedeemWithBurning != 0, "Percetage of Ether to receive when burning tokens is not yet set");
    require(!reentrancyGuard, "Reentrancy guard is active");
    reentrancyGuard = true;
    _burn(msg.sender, _amount);
    payable(msg.sender).transfer(_amount * uint256(percetnageOfEtherToRedeemWithBurning) / 100);
    reentrancyGuard = false;
    return true;
  }
}
