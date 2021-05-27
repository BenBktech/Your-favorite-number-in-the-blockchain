var FavoriteNumber = artifacts.require("./FavoriteNumber.sol");

module.exports = function(deployer) {
  deployer.deploy(FavoriteNumber);
};
