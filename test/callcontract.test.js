const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');

describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genFromPrikey("cd5322548d47cafcd3750cd3a48853d4494a3caa82f77163aac7cb48cdf3a821");
        chain.config.server_base ='http://101.201.122.99:8000/fbs';
        chain.config.rpc_provider = rp;

    });

    describe('#contract.call()', function () {
        it("should transfer", async function () {
            // console.log("kp.hexAddress %s",kp.hexAddress);
            // console.log("kp.hexPrikey %s",kp.hexPrikey);
            // console.log("kp.hexPubkey %s",kp.hexPubkey);
            // console.log("kp.nonce %s",kp.nonce);
            // let from={
            //     keypair:kp
            // }
            
            // let result=await chain.rpc.getBalance(kp.hexAddress);
            // result=JSON.parse(result);
            // from.keypair.nonce=result.nonce;
            // let args={"contract":"940729720e2a83e20aC9Cd7C97bE46D3c3af4e6a","data":"a9059cbb000000000000000000000000fc85cd6c929847621f77bda95ea645f46df2af530000000000000000000000000000000000000000000000000de0b6b3a7640000"}

            // chain.rpc.callContract(from,null,args).then(function(result){
            //     console.log(result)
            // }).catch(function(error){
            //     console.log(error);
            // })

        });
        it("should safemint",async function(){
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBalance(kp.hexAddress);
            console.log(result)
            result=result;
            from.keypair.nonce=result.nonce;
            let args={"to":"c8716ff724b674432cceb16d693f8164f82070e2","data":"d204c45e00000000000000000000000073bd0fa93e4a4e55b571f8ad9b3e86cd38ed3cf500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000033687474703a2f2f34372e39332e38372e37373a383039312f696d672f6c6f676f5f77686974652e30373239376266332e706e6700000000000000000000000000"}

            console.log(await chain.rpc.callContract(from,null,args));
        })
    });
});
