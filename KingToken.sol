
/*
pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
// import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol';
// import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract KingToken is ERC20Mintable {
  using SafeMath for uint256;

  string public constant name = "KING";
  string public constant symbol = "KING";
  uint public constant decimals = 18;
  uint public constant INITIAL_SUPPLY = 1000 * (10 ** decimals);


  // Airdrop
  mapping (address => uint256) public airDropHistory;
  event MintAirDrop(address _receiver, uint256 _amount);


  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

  function mintAirDrop(address _to, uint256 _amount)  public returns (bool) {
    require(_to != address(0),"Don't use Null Address");
    require(_amount != 0, "Not to input 0 of amount");

    _mint(_to, _amount);
    airDropHistory[_to].add(_amount);

    emit MintAirDrop(_to,_amount);
    emit Transfer(address(0), _to, _amount);  // 첫번재 인자는 Null
    return true;
  }
}

*/