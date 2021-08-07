const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
var chai = require('chai');
var catchRevert = require("./exception_helpers.js").catchRevert;

const ChallengeToken = artifacts.require("ChallengeToken");
const ChallengeTokenV2 = artifacts.require("ChallengeTokenV2");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ChallengeToken", function (accounts) {

  owner = accounts[0];
  user = accounts[1];

  beforeEach(async () => {
    instance = await deployProxy(ChallengeToken, { kind: "uups" })
  });

  async function upgradeInstance() {
    const instanceV2 = await upgradeProxy(instance.address, ChallengeTokenV2);

    return instanceV2;
  }

  context("deployment", function () {
    it("should assign the expected token name, symbol and decimals values", async function () {
      const name = await instance.name();
      const symbol = await instance.symbol();
      const decimals = await instance.decimals();

      chai.assert.equal(name, "ChallengeToken", "Name is not assigned correctly, please check initialize().");
      chai.assert.equal(symbol, "CTK", "Symbol is not assigned correctly, please check initialize().");
      chai.assert.equal(decimals, 18, "Decimals are not assigned correctly, please check initialize().");
    });
  });

  context("minting", function () {
    it("should mint the same amount of token as ether that is sent to the contract", async function (){
      const initialBalance = await instance.balanceOf(user);
      await instance.sendTransaction({ from: user, value: 123 });

      const finalBalance = await instance.balanceOf(user);

      chai.assert.equal(initialBalance, 0, "Initial balance of an account was not 0!");
      chai.assert.equal(finalBalance, 123, "Tokens were not minted when Ether was sent to the smart contract, please check receive().");
    });

    it("should not mint any tokens if 0 ether is sent to the contract", async function (){
      await instance.sendTransaction({ from: user, value: 0 });

      const balance = await instance.balanceOf(user);

      chai.assert.equal(balance, 0, "Tokens were minted when 0 Ether was sent to the smart contract, please check receive().");
    });
  });

  context("ownership", function () {
    it("should allow owner to transfer ownership", async function () {
      const response = await instance.transferOwnership(user, { from: owner });
      const finalOwner = await instance.owner();

      chai.assert.isTrue(response.receipt.status, "Ownership was not transferred successfully!");
      chai.assert.equal(finalOwner, user, "Owner was not set correctly!")
    });

    it("should emit the OvnershipTransferred event when transferring ownership", async function () {
      const response = await instance.transferOwnership(user, { from: owner });

      chai.assert.equal(response.logs[0].event, "OwnershipTransferred", "OwnershipTransferred event is not being emitted when ownership is transferred!");
    });

    it("should not allow someone other than owner to transfer ownership", async function () {
      await catchRevert(instance.transferOwnership(user, { from: user }));
    });

    it("should not allow to transfer ownership to 0x0 address", async function () {
      await catchRevert(instance.transferOwnership("0x0000000000000000000000000000000000000000", { from: owner }));
    });

    it("should allow owner to renunce ownership", async function () {
      await instance.renounceOwnership({ from: owner });
      
      const finalOwner = await instance.owner()

      chai.assert.equal(finalOwner, "0x0000000000000000000000000000000000000000", "Owner is unable to renounce ownership!");
    });
  });

  context("upgradeability", function () {
    it("should mark newly deployed contract as upgradeable", async function () {
      const upgradeable = await instance.upgradeable();

      chai.assert.isTrue(upgradeable, "Newly deployed contract is not marked as upgradeable, please check initialize().")
    });

    it("should allow owner to kill upgradeability of the contract", async function () {
      const response = await instance.killUpgradeability({ from: owner });
      const upgradeable = await instance.upgradeable();

      chai.assert.isTrue(response.receipt.status, "Owner failed to kill the upgradeability of the contract, please check killUpgradeability().")
      chai.assert.isFalse(upgradeable, "Owner failed to kill the upgradeability of the contract, please check killUpgradeability().")
    });

    it("should not allow owner to kill upgradeability of the contract if that has already been done", async function () {
      await instance.killUpgradeability({ from: owner });
      await catchRevert(instance.killUpgradeability({ from: owner }));
    });

    it("should emit upgradeabilityKilled event when upgradeability is killed", async function () {
      const response = await instance.killUpgradeability({ from: owner });

      chai.assert.equal(response.logs[0].event, "upgradeabilityKilled", "upgradeabilityKilled event was not triggerd upon upgradeability being killed, please check killUpgradeability().")
    });

    it("should allow owner to upgrade the contract", async function () {
      const upgradedInstance = await upgradeInstance();

      chai.assert.notEqual(upgradedInstance.address, "0x0000000000000000000000000000000000000000", "Instance upgrade failed!")
    });

    it("should not allow anyone other than owner to upgrade the contract", async function () {
      await instance.transferOwnership(user, { from: owner });
      await catchRevert(upgradeInstance());
    });

    it("should not allow owner to upgrade the contract if the upgradeability has been killed", async function () {
      await instance.killUpgradeability({ from: owner });
      await catchRevert(upgradeInstance());
    });

    it("should preserve balances after the upgrade", async function () {
      await instance.sendTransaction({ from: user, value: 123 });
      const initialBalance = await instance.balanceOf(user);
      await upgradeInstance();

      const finalBalance = await instance.balanceOf(user);

      chai.assert.equal(initialBalance, 123, "Balance was set incorrectly before the upgrade!");
      chai.assert.equal(finalBalance, 123, "Balance is not preserved after the upgrade!");
    });
  });

  context("burning", function () {
    it("should allow owner to set the percentage of ether to be redeemed by an address burning a token", async function () {
      const upgradedInstance = await upgradeInstance();
      
      const response = await upgradedInstance.setPercentageOfEtherToReddemWithBurning(90, { from: owner });
      const percentage = await upgradedInstance.percetnageOfEtherToRedeemWithBurning();

      chai.assert.isTrue(response.receipt.status, "Owner is not able to change the percentage of ether that the user gets when burning the tokens, please check setPercentageOfEtherToReddemWithBurning().");
      chai.assert.equal(percentage, 90, "The percentage of Ether that the user redeems by buringn hte tokens is not set corectly, please check setPercentageOfEtherToReddemWithBurning()");
    });

    it("should not allow anyone other than owner to set the percentage of tokens to redeem when burning tokens", async function () {
      const upgradedInstance = await upgradeInstance();
      
      await catchRevert(upgradedInstance.setPercentageOfEtherToReddemWithBurning(90, { from: user }));
    });

    it("should send the right amount of Ether to the address burning the tokens", async function () {
      const upgradedInstance = await upgradeInstance();
      await upgradedInstance.setPercentageOfEtherToReddemWithBurning(90, { from: owner });
      await upgradedInstance.sendTransaction({ from: user, value: 100 });
      
      const initialContractBalance = parseInt(await web3.eth.getBalance(upgradedInstance.address));
      await upgradedInstance.burnTokens(100, { from: user });
      const finalContractBalance = parseInt(await web3.eth.getBalance(upgradedInstance.address));

      chai.assert.equal(initialContractBalance, finalContractBalance + (initialContractBalance * 0.9), "Incorrect amount of Ether was sent out of the contract after burning tokens, please check burnTokens()");
    });

    it("should not allow to burn tokens until the amount of Ether to be sent back after the burn is set", async function () {
      const upgradedInstance = await upgradeInstance();
      await upgradedInstance.sendTransaction({ from: user, value: 100 });

      await catchRevert(upgradedInstance.burnTokens(100, { from: user }));
    });

    it("should not allow a value of percentage of Ether, to be sent to an account that is burning tokens, to be other than (0, 100]", async function () {
      const upgradedInstance = await upgradeInstance();

      await catchRevert(upgradedInstance.setPercentageOfEtherToReddemWithBurning(0, { from: owner }));
      await catchRevert(upgradedInstance.setPercentageOfEtherToReddemWithBurning(101, { from: owner }));
    });
  });
});
