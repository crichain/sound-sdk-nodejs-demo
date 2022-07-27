const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');

describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genFromPrikey("ee353e42dab6de236e0071257bddeb1402dbf56de5d003ef2c08fc976f016380");
        chain.config.server_base ='http://119.13.103.220:8000/fbs';
        chain.config.rpc_provider = rp;
    });

    describe('#chain.query()', function () {
        it("should getBalance", async function () {
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBalance(kp.hexAddress);
            console.log(result)
        });

        it("should getBlockByNumber", async function () {
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBlockByNumber(33610266);
            console.log(JSON.stringify(result))
        });

        it("should getTransaction", async function () {
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getTransaction("acf605ae469de403fbb22730de70695fec18b2f9f780df5b3957735adbb2061c");
            console.log(JSON.stringify(result))
        });

        
    });
});
