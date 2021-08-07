// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title ChallengeToken
/// @author Jan Turk
contract ChallengeToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
  bool public upgradeable;

  /// @notice Emitted when upgradeability of contract is killed.
  /// @dev This is only called once.
  /// @param caller Address of the owner that killed the upgradeability.
  event upgradeabilityKilled(address caller);

  /// @notice Initializer function replaces constructor in upgradeable contracts when using proxy pattern.
  /// @dev It initializes ERC20, Access control and Proxy contracts as well as their dependent contracts. Upgradeability is set to true.
  function initialize() initializer public {
    __ERC20_init("ChallengeToken", "CTK");
    __Ownable_init();
    __UUPSUpgradeable_init();
    upgradeable = true;
  }

  /// @notice Used to check whether the contract is allowed to be upgraded or not.
  /// @dev This checks upgradeable global variable that can be toggled to false by the owner.
  modifier onlyUpgradeable{
    require(upgradeable, "Upgradeability of the contract has been disabled");
    _;
  }

  /// @notice Used to upgrade the contract.
  /// @dev This can only be called by owner (can be transferred by transferOwnership()) and only when upgradeability isn't killed.
  /// @param newImplementation Address of the new, upgraded, implementation of the contract.
  function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyOwner
    onlyUpgradeable
  {}

  /// @notice Used to kill the upgradeability of the contract.
  /// @dev This is a one way operation and can't be undone, so use it wisely. It is restricted to be called by owner as well as to only be called when upgradeability is enabled.
  /// @return success Status of succesful upgradeability kill.
  function killUpgradeability() public onlyOwner onlyUpgradeable returns (bool success){
    upgradeable = false;
    emit upgradeabilityKilled(msg.sender);
    return true;
  }

  /// @notice Used to ming eqaul value of tokens as there is Ether sent to the contract.
  /// @dev It uses the internal function inherited from ERC20Upgradeable contract. 
  receive() external payable{
    _mint(msg.sender, msg.value);
  }
}