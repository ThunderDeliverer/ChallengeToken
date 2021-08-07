const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ChallengeToken = artifacts.require("ChallengeToken");

module.exports = async function(deployer) {
  const instance = await deployProxy(ChallengeToken, { deployer, kind: 'uups' });
  console.log("Deployed at: " + instance.address);
};
