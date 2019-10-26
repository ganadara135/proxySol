const Web3 = require('web3');
// const BN = require('bn.js')
//const BigNumber = Web3.BigNumber;

const Example = artifacts.require("Example");
const BouncerProxy = artifacts.require("BouncerProxy");

//web3 = new Web3(new Web3.providers.HttpProvider(clevisConfig.provider))
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:9545"));


contract("Example", (accounts) => {
    describe('#Example 작동여부 체크', function() {
        it("Example ", () => {
            Example.deployed()
            .then(instance => instance.name())
            .then(name => {
                //console.log("name : ", name)
                assert.equal(name,"ExampleChk","name is not Correct");
            })
            .catch( e => {
                console.log(e);
            });
        });
    });
});


contract("BouncerProxy", (accounts) => {
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
        it("should build meta transaction into data, sign it as accountIndexSigner and send it as accountIndexSender ", async function() {
        //    this.timeout(60000)

            
            // let abiExample = await Example.deployed().then(instance => instance.abi);
            // let addressExample = await Example.deployed().then(instance => instance.address);
            // let abiBouncerProxy = await BouncerProxy.deployed().then(instance => instance.abi);
            // let addressBouncerProxy = await BouncerProxy.deployed().then(instance => instance.address);
            const handlerOfBouncerProxy = await BouncerProxy.deployed();
            const handlerOfExample = await Example.deployed();
            let abiExample = handlerOfExample.abi;
            let addressExample = handlerOfExample.address;
            let abiBouncerProxy = handlerOfBouncerProxy.abi;
            let addressBouncerProxy = handlerOfBouncerProxy.address;


            var data = (new web3.eth.Contract(abiExample,addressExample)).methods.addAmount(5).encodeABI()
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
                addressExample,
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
            

            const result = await handlerOfBouncerProxy.forward(sig, accounts[0], addressExample, 0, data, rewardAddress, rewardAmount);
        //   console.log("result : ", result)
            printTxResult(result)
        })

        // 체크 Example count 변화된 결과
        describe('#Example count 체크', function() {
            it("count ", () => {
                Example.deployed()
                .then(instance => instance.count())
                .then(count => {
                    assert.equal(count, 5, "count is changed");
                })
                .catch( e => {
                    console.log(e);
                });
            });
        });
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