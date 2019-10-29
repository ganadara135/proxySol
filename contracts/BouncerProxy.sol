pragma solidity >=0.4.21 <0.6.0;

contract BouncerProxy {
  //whitelist the deployer so they can whitelist others
  constructor() public {
     whitelist[msg.sender] = true;
  }
  //to avoid replay
  mapping(address => uint) public nonce;
  // allow for third party metatx account to make transactions through this
  // contract like an identity but make sure the owner has whitelisted the tx
  mapping(address => bool) public whitelist;


  event UpdateWhitelist(address _account, bool _value);
  event Received (address indexed sender, uint value);
  event LogMessage (address what);

  function () external payable {
    emit Received(msg.sender, msg.value);
  }

  function updateWhitelist(address _account, bool _value) public returns(bool) {
    require(whitelist[msg.sender],"BouncerProxy::updateWhitelist Account Not Whitelisted");
    whitelist[_account] = _value;
    emit UpdateWhitelist(_account,_value);
    return true;
  }

  function getHash(address signer, address destination, uint value, bytes memory data, address rewardToken, uint rewardAmount)
  public view returns(bytes32){
    return keccak256(abi.encodePacked(address(this), signer, destination, value, data, rewardToken, rewardAmount, nonce[signer]));
  }

  function forward(bytes memory sig, address signer, address destination, uint value, bytes memory data, address rewardToken, uint rewardAmount) public {
      // msg.sender log to see
      emit LogMessage(msg.sender);
      
      //the hash contains all of the information about the meta transaction to be called
      bytes32 _hash = getHash(signer, destination, value, data, rewardToken, rewardAmount);
      //increment the hash so this tx can't run again
      nonce[signer]++;
      //this makes sure signer signed correctly AND signer is a valid bouncer
      require(signerIsWhitelisted(_hash,sig),"BouncerProxy::forward Signer is not whitelisted");
      //make sure the signer pays in whatever token (or ether) the sender and signer agreed to
      // or skip this if the sender is incentivized in other ways and there is no need for a token
      // 이 부분은 현재 프로젝트에는 필요치 않음
      if(rewardAmount>0){
        //Address 0 mean reward with ETH
        if(rewardToken==address(0)){
          //REWARD ETHER
          //require(msg.sender.call.value(rewardAmount)(''),'Not enough for gas');
          //require(msg.sender.call.value(rewardAmount)(""),"ppp");
          require(msg.sender.send(rewardAmount),"block send reward");

        }else{
          //REWARD TOKEN
          require((StandardToken(rewardToken)).transfer(msg.sender,rewardAmount));
        }
      }
      //execute the transaction with all the given parameters
      require(executeCall(destination, value, data));
      emit Forwarded(sig, signer, destination, value, data, rewardToken, rewardAmount, _hash);
  }
  // when some frontends see that a tx is made from a bouncerproxy, they may want to parse through these events to find out who the signer was etc
  event Forwarded (bytes sig, address signer, address destination, uint value, bytes data,address rewardToken, uint rewardAmount,bytes32 _hash);


  function executeCall(address to, uint256 value, bytes memory data) internal returns (bool success) {
    assembly {
    // call(g, a, v, in, insize, out, outsize)	
    // call contract at address a with input mem[in..(in+insize)) providing g gas and v wei and
    // output area mem[out..(out+outsize)) returning 0 on error  (eg. out of gas) and 1 on success
       success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
    }
  }

  //borrowed from OpenZeppelin's ESDA stuff:
  function signerIsWhitelisted(bytes32 _hash, bytes memory _signature) internal view returns (bool){
    bytes32 r;
    bytes32 s;
    uint8 v;
    // Check the signature length
    if (_signature.length != 65) {
      return false;
    }
    // Divide the signature in r, s and v variables
    // ecrecover takes the signature parameters, and the only way to get them
    // currently is to use assembly.
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      r := mload(add(_signature, 32))
      s := mload(add(_signature, 64))
      v := byte(0, mload(add(_signature, 96)))
    }
    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }
    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return false;
    } else {
      // solium-disable-next-line arg-overflow
      return whitelist[ecrecover(keccak256(             // ecrecover 는 opcode 임, 어셈블리 코드
        abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
      ), v, r, s)];
    }
  }


  // only for test
  function ecrecoverCustom(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
    return ecrecover(msgHash, v, r, s);
  }
}

contract StandardToken {
  function transfer(address _to,uint256 _value) public returns (bool) { }
}