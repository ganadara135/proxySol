pragma solidity >=0.4.21 <0.6.0;

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
  //mapping (address => uint256) private _balances;
  address public owner;
  uint public constant feeOfregister = 50;
  // 테스트 체크용 상태 변수
  uint public count = 0;

  event Register(address _writer, uint256 _amount);

  // Airdrop
  mapping (address => uint256) public airDropHistory;
  event MintAirDrop(address _receiver, uint256 _amount);


  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);      // ERC20 _totalSupply 값도 초기화 시켜줌
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "only Owner can use");
    _;
  }

  function mintAirDrop(address _to, uint256 _amount)  public onlyOwner returns (bool) {
    require(_to != address(0),"Don't use Null Address");
    require(_amount != 0, "Not to input 0 of amount");

    _mint(_to, _amount);
    airDropHistory[_to].add(_amount);

    emit MintAirDrop(_to,_amount);
    emit Transfer(address(0), _to, _amount);  // 첫번재 인자는 Null
    return true;
  }


  //  게시글 등록시 호출하는 메소드, 게시글 등록시에 50 토큰이 차감됨
  function registerArticle(address _to)  public returns (bool) {
    require(_to != address(0),"ERC20: using from the zero address");
    require(balanceOf(_to) > feeOfregister, "Not enough token");

    //_balances[_to] = _balances[_to].sub(50);    // 50  토큰 차감 (KingToken)
    _burn(_to, feeOfregister);

    emit Register(_to, feeOfregister);  // 첫번재 인자는 Null
    return true;
  }


  function addAmount(uint256 amount) public returns (bool) {
    count = count + amount;
    return true;
  }
}
