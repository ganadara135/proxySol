const Web3 = require('web3');
// const BN = require('bn.js')
//const BigNumber = Web3.BigNumber;

const KingToken = artifacts.require("KingToken");
const BouncerProxy = artifacts.require("BouncerProxy");

//web3 = new Web3(new Web3.providers.HttpProvider(clevisConfig.provider))
// const web3 = new Web3() // 'ws://127.0.0.1:9545');
// const eventProvider = new Web3.providers.WebsocketProvider('ws://localhost:9545');
// web3.setProvider(eventProvider);
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
// web3.eth.personal.sign("Hello world", "0x7ca0774532c0287a05a1786bd7966d8a5c467cf0", "a27b1b366a4f527d920cc17e46949b996ee4c4ee4b7b0b28b7f75fbe8c0d1c56")
// .then( result => console.log("result : ", result));

//////////  위에 web3.eth.personal.sign() 이 작동이 안돼서 ethereumjs-util.ecsign() 으로 변경
const EthUtil = require('ethereumjs-util')

const Example = artifacts.require("Example.sol");
const BigNumber = web3.BigNumber
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

    

contract("KingToken", (accounts) => {
    describe('#KingToken 작동여부 체크', function() {
        it("이름호출 ", () => {
            KingToken.deployed()
            .then(instance => instance.name())
            .then(name => {
                //console.log("name : ", name)
                assert.equal(name,"KING","name is not Correct");
            })
            .catch( e => {
                console.log(e);
            });
        });
    });
});

/*
    // 시그니처 만들기 테스트용 // 정상 작동 확인
    // await web3.eth.personal.sign("Hello world", "0x7ca0774532c0287a05a1786bd7966d8a5c467cf0", "a27b1b366a4f527d920cc17e46949b996ee4c4ee4b7b0b28b7f75fbe8c0d1c56")
    const message = EthUtil.keccak256('Message to sign here.')          // return Buffer
                                    // ecsign(Buffer msgHash, Buffer privateKey, chainId)
    const signature = await EthUtil.ecsign(message, new Buffer('02c03f3cd759719eb51ff3e2a42a901082d69378659ea19a9056cc91c70b4260', 'hex') ) // return Object
                                                            //0x02c03f3cd759719eb51ff3e2a42a901082d69378659ea19a9056cc91c70b4260
                                                            // ganache 에 5 번째 주소 사용해서 메소드 호출 account[5]
    console.log("message : ", web3.utils.bytesToHex(message))
    console.log("signature.r : ", signature.r)
    console.log("signature.s : ", signature.s)
    console.log("signature.v : ", web3.utils.toHex(signature.v))
    // message 와   signature  를  전달         // String, String
    accountClient = web3.eth.accounts.recover({
        messageHash: web3.utils.bytesToHex(message),
        r: web3.utils.bytesToHex(signature.r),
        s: web3.utils.bytesToHex(signature.s),
        v: web3.utils.toHex(signature.v)
    });
    console.log("계좌 비교 원본 : ", accounts[5])
    console.log("계좌 비교 생성 : ", accountClient)
    
*/    

 //  게시판 글 등록금 대납자 검증
 contract.only('BouncerProxy', async function (accounts) {
    beforeEach(async function () {
        this.contract = await BouncerProxy.new();
    })
    //const handlerOfExample = await Example.deployed();        // 이거는 제대로 instance 생성하지 못함

    it("호출요청자 검증", async function () {
       //const message = EthUtil.sha3('Message to sign here.')
       //const message = EthUtil.sha256('Message to sign here.')
        const message = await EthUtil.keccak256('Message to sign here.')
        const signature = await EthUtil.ecsign(message, new Buffer('b0fa901a6e44c8b030ef45cd58bf124f90a7e4c660c78550fec868d3bb3a0288', 'hex') )

        //console.log("signature : ", signature.yellow)
        const recoveredAddress = await this.contract.ecrecoverCustom(
      //  const recoveredAddress = await handlerOfExample.contract.methods.ecrecoverCustom(
            '0x' + message.toString('hex'),
            signature.v,
            '0x' + signature.r.toString('hex'),
            '0x' + signature.s.toString('hex'))//.send({from: accounts[0], gas:1000000 });

        recoveredAddress.should.be.equal('0x4900e556e41080E355e0B4c31B7820c63B1f3C86', 'The recovered address should match the signing address')
        //console.log("recoveredAddress : ", recoveredAddress.red);
    })
});


contract("BouncerProxy", async (accounts) => {

    // let abiExample = await Example.deployed().then(instance => instance.abi);
    // let addressExample = await Example.deployed().then(instance => instance.address);
    // let abiBouncerProxy = await BouncerProxy.deployed().then(instance => instance.abi);
    // let addressBouncerProxy = await BouncerProxy.deployed().then(instance => instance.address);
    const handlerOfBouncerProxy = await BouncerProxy.deployed();
    const handlerOfKingToken = await KingToken.deployed();
    let abiKingToken = handlerOfKingToken.abi;
    let addressKingToken = handlerOfKingToken.address;
    let abiBouncerProxy = handlerOfBouncerProxy.abi;
    let addressBouncerProxy = handlerOfBouncerProxy.address;

    // 이 부분은 위에서 처리함
    // describe('#호출요청자 검증', async function() {
    //   //  console.log(accounts)
    //     it("시그니처 검증", async function() {

    //         // 게시판 쪽에서 할 행위 가정한 데이터 message,  signature
    //         const message = await EthUtil.keccak256('Message to sign here.')          // return Buffer
    //         const signature = await EthUtil.ecsign(message, new Buffer('0e36f7232b6e57c06e651bcc673da94680bc35cfbdf329a7a7b952302e8d8544', 'hex') ) // return Object
    //                                                                 // ganache 에 5 번째 주소 사용해서 메소드 호출 account[5]
    //         console.log("signature : ", signature)
    //         accountClient = web3.eth.accounts.recover({
    //             messageHash: web3.utils.bytesToHex(message),
    //             r: web3.utils.bytesToHex(signature.r),
    //             s: web3.utils.bytesToHex(signature.s),
    //             v: web3.utils.toHex(signature.v)
    //         });
    //         accountClient.should.be.equal(accounts[5], 'The recovered address should match the signing address')
    //     });
    // })
    
 
    // 화이트리스트에 등록되었는지 확인,
    describe('#BouncerProxy 작동여부 체크', async function() {
        it("whitelist msg.sender 체크", () => {
            BouncerProxy.deployed()
            .then(instance => instance.whitelist.call(accounts[0]))
            .then( result => {
                assert.equal(result,true,"accounts[0] 가 화이트리스트에 작동권한 없음")
            })
            .catch( e => {
                console.log(e);
            });
        });
    });

    describe('#meta TX', async function() {
        it("meta TX 검증", async function() {
        //    this.timeout(60000)
            
                                                                                        // ganache 에 0 번째 주소 사용해서 메소드 호출, 대리자
            var data = (new web3.eth.Contract(abiKingToken, addressKingToken)).methods.registerArticle(accounts[0]).encodeABI()
            //var data = (new web3.eth.Contract(abiKingToken, addressKingToken)).methods.addAmount(5).encodeABI()
            //var data = handlerOfExample.addAmount(5).encodeABI();     // 이거는 작동 안함
   //         console.log("DATA: ",data)

            //const nonce = await BouncerProxy.deployed().then(instance => instance.nonce.call(accounts[0]));
            const nonce = await handlerOfBouncerProxy.nonce.call(accounts[0]);  // BouncerProxy owner 주소로 호출
  //          console.log("nonce : ", nonce);

        // const { soliditySha3 } = require('web3-utils');
            // web3.utils.soliditySha3()
            const rewardAddress = "0x0000000000000000000000000000000000000000"          //  보상을 안 받음
            const rewardAmount = 0;
            const parts = [
                addressBouncerProxy,
                accounts[0],                        // BouncerProxy owner 주소로 호출
                addressKingToken,
                web3.utils.toTwosComplement(0),
                data,
                rewardAddress,
                web3.utils.toTwosComplement(rewardAmount),
                web3.utils.toTwosComplement(nonce),
            ]
        // console.log("PARTS",parts)
            const hashOfMessage = web3.utils.soliditySha3(...parts);
            const message = hashOfMessage;

            let sig = await web3.eth.sign(message, accounts[0]) // BouncerProxy owner 주소로 호출

 //           console.log("message: "+message+" sig: ",sig)

            
        //   const hashResult = await handlerOfBouncerProxy.getHash(accounts[0], addressExample, 0, data, rewardAddress, rewardAmount)
        //   console.log("hashResult : ", hashResult)
            

            const result = await handlerOfBouncerProxy.forward(sig, accounts[0], addressKingToken, 0, data, rewardAddress, rewardAmount);
        
            printTxResult(result)
           
           // 아래 이벤트는 에러 발생하고 안되네요.          
        /*    handlerOfBouncerProxy.contract.events.LogMessage({}, function(err, event) {
                console.log('event : ', event)
                console.log('err : ', err)
            })
            .on('error', console.error);

            handlerOfBouncerProxy.contract.events.allEvents('LogMessage',{  }, (err, event) => {
                console.log('err : ', err)
                console.log('event : ', event)
            })  */

            // 이벤트 처리는 getPastEvents() 만 됨
            handlerOfBouncerProxy.contract.getPastEvents('LogMessage',{  }, (err, event) => {
                console.log('err : ', err)
                console.log('event : ', event)
            })
            
        })
    })


    const tab = "\t\t";
    function printTxResult(result){
        if(!result||!result.receipt){
          console.log("ERROR".red,"MISSING TX HASH".yellow)
        }else{
          console.log(tab, result.receipt.transactionHash.green, (" "+result.receipt.gasUsed).yellow)
        }
    }
    
});