const BouncerProxy = artifacts.require("BouncerProxy");

module.exports = function(deployer) {
  deployer.deploy(BouncerProxy);
};