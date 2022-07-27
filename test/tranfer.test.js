const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');
const BN=require('bn.js');


describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {

console.log((new BN("176b344f2a78c0000",16)).toString(10))
        // kp=chain.KeyPair.genFromPrikey("ed3b5e6126b4fb4ebc5783e7bf8a83817045297760a17299b0d086dfd043a01d");
        // chain.config.server_base="http://101.201.122.99:8000/fbs";
        kp=chain.KeyPair.genFromPrikey("cd5322548d47cafcd3750cd3a48853d4494a3caa82f77163aac7cb48cdf3a821");
        chain.config.server_base="http://localhost:8000/fbs";
        chain.config.rpc_provider = rp;

    });

    describe('#contract.call()', function () {
        it("should transfer", async function () {
            let from={
                keypair:kp
            }
            
            console.log("kp.addr="+kp.hexAddress);
            let result=await chain.rpc.getBalance(kp.hexAddress);

            from.keypair.nonce=result.nonce;
            
            var args={"recipient":"0xedc32514edb94d6b667ee95f1a5678e6eed45377",
                "amount":"0x8ac7230489e80000"}
            
            let extdata=Buffer.from('huobi transfer',"utf8").toString("hex")
            // chain.rpc.transfer(from,extdata,args).then(function(result){
            //     console.log("result",result)
            // })
            // console.log(parseInt("100000000000000000"))
            // console.log(Buffer.from(parseInt(this.args.amount).toString(16),"hex"))
//0x017aa73a606841b3e17380000000
//0x017aa73a606841b3e17380000000
//0x95c7ec7facc2b39cd2c100
console.log((new BN("52b7d2dcc80cd2e4000000",16)).toString(10))
console.log((new BN("8ac7230489e80000",16)).toString(10))
console.log((new BN("016345785d8a0000",16)).toString(10))

console.log((new BN("3000000000000000000000",10)).toString(16))
        });
    });
});
