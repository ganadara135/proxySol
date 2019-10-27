const Web3 = require('web3');
// const BN = require('bn.js')
//const BigNumber = Web3.BigNumber;

const KingToken = artifacts.require("KingToken");
const BouncerProxy = artifacts.require("BouncerProxy");

//web3 = new Web3(new Web3.providers.HttpProvider(clevisConfig.provider))
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:9545"));
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

    /*  클라이언트에서 sign  값 만들기 테스트
contract.only('Example', async function (accounts) {
    beforeEach(async function () {
        this.contract = await Example.new();
    })
   // const handlerOfExample = await Example.deployed();

    it("ecrecover: should pass", async function () {
       //const message = EthUtil.sha3('Message to sign here.')
       //const message = EthUtil.sha256('Message to sign here.')
       const message = EthUtil.keccak256('Message to sign here.')
        const signature = await EthUtil.ecsign(message, new Buffer('907570bfd5e48faa71b59fd6d48c9d12dfd639ff0c5f715e9211feb7abfa5edf', 'hex') )

        //console.log("signature : ", signature.yellow)
        const recoveredAddress = await this.contract.ecrecoverCustom(
        //const recoveredAddress = await handlerOfExample.methods.ecrecoverCustom(
            '0x' + message.toString('hex'),
            signature.v,
            '0x' + signature.r.toString('hex'),
            '0x' + signature.s.toString('hex'))//.send({from: accounts[0], gas:1000000 });

        recoveredAddress.should.be.equal('0x5e54317f3599ea5d026baaca7d9857abeca9c01d', 'The recovered address should match the signing address')
        //console.log("recoveredAddress : ", recoveredAddress.red);
    })
});
*/







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


contract("BouncerProxy", async (accounts) => {
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


    // 시그니처 만들기  
    // let signature;
    // await web3.eth.personal.sign("Hello world", "0x7ca0774532c0287a05a1786bd7966d8a5c467cf0", "a27b1b366a4f527d920cc17e46949b996ee4c4ee4b7b0b28b7f75fbe8c0d1c56")
    const message = EthUtil.keccak256('Message to sign here.')          // return Buffer
                                    // ecsign(Buffer msgHash, Buffer privateKey, chainId)
    const signature = await EthUtil.ecsign(message, new Buffer('a27b1b366a4f527d920cc17e46949b996ee4c4ee4b7b0b28b7f75fbe8c0d1c56', 'hex') ) // return Object

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
    console.log("계좌 비교 원본 : ", accounts[0])
    console.log("계좌 비교 생성 : ", accountClient)
    // 위 계좌 비교가 통과하면 아래 메소드를 실행
    
/*
    let accountClient;
    let metaTxData;
    // 클라이언트가 보내주는 메시지 파싱
    describe('#Client Msg Parsing ', async function(clientMsg) {
        it("Parsing 고객들이 보내는 파일 ", (clientMsg) => {
            console.log("clientMsg:",clientMsg)
            metaTxData = JSON.parse(clientMsg.data)
            console.log(metaTxData)
            console.log("/tx",metaTxData)
            accountClient = web3.eth.accounts.recover(metaTxData.message,metaTxData.sig)
            console.log("RECOVERED:",accountClient)
        });
    });
*/


    describe('#meta TX', async function() {
        it("should build meta transaction into data, sign it as account[0] and send it as account[0] ", async function() {
        //    this.timeout(60000)
            
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


            
            var data = (new web3.eth.Contract(abiKingToken, addressKingToken)).methods.registerArticle(accounts[0]).encodeABI()
            //var data = (new web3.eth.Contract(abiKingToken, addressKingToken)).methods.addAmount(5).encodeABI()
            //var data = handlerOfExample.addAmount(5).encodeABI();     // 이거는 작동 안함
            console.log("DATA:",data)

            //const nonce = await BouncerProxy.deployed().then(instance => instance.nonce.call(accounts[0]));
            const nonce = await handlerOfBouncerProxy.nonce.call(accounts[0]);
            console.log("nonce : ", nonce);

        // const { soliditySha3 } = require('web3-utils');
            // web3.utils.soliditySha3()
            const rewardAddress = "0x0000000000000000000000000000000000000000"          //  보상을 안 받음
            const rewardAmount = 0;
            const parts = [
                addressBouncerProxy,
                accounts[0],                        // 여기도 바꿈
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

            let sig = await web3.eth.sign(message, accounts[0]) // 다른 주소로 수행

            console.log("message: "+message+" sig: ",sig)


            
        //   const hashResult = await handlerOfBouncerProxy.getHash(accounts[0], addressExample, 0, data, rewardAddress, rewardAmount)
        //   console.log("hashResult : ", hashResult)
            

            const result = await handlerOfBouncerProxy.forward(sig, accounts[0], addressKingToken, 0, data, rewardAddress, rewardAmount);
        //   console.log("result : ", result)
            printTxResult(result)
        })

        // 체크 KingToken count 변화된 결과
        // describe('#addressKingToken count 체크', function() {
        //     it("count ", () => {
        //         KingToken.deployed()
        //         .then(instance => instance.count())
        //         .then(count => {
        //             assert.equal(count, 5, "count is changed");
        //         })
        //         .catch( e => {
        //             console.log(e);
        //         });
        //     });
        // });
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