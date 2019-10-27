pragma solidity >=0.4.21 <0.6.0;

/*

  This is just a very simple example contract used to demonstrate the BouncerProxy making calls to it

*/


contract Example {

  constructor() public { }

  //it keeps a count to demonstrate stage changes
  uint public count = 0;
  string public constant name = "ExampleChk";

  //it can receive funds
  function () external payable { emit Received(msg.sender, msg.value); }

  event Received (address indexed sender, uint value);

  //and it can add to a count
  function addAmount(uint256 amount) public returns (bool) {
    count = count + amount;
    return true;
  }

  // only for test
  function ecrecoverCustom(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
    return ecrecover(msgHash, v, r, s);
  }
}