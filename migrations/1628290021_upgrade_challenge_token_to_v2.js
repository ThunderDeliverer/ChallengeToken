const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const ChallengeToken = artifacts.require("ChallengeToken");
const ChallengeTokenV2 = artifacts.require("ChallengeTokenV2");

module.exports = async function(deployer) {
  const existing = await ChallengeToken.deployed();
  const instance = await upgradeProxy(existing.address, ChallengeTokenV2, { deployer, kind: 'uups' });
  console.log("Upgraded to:"+ instance.address);
};
