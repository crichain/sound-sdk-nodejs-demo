const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');

describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genFromPrikey("ee353e42dab6de236e0071257bddeb1402dbf56de5d003ef2c08fc976f016380");
        chain.config.server_base ='http://localhost:8000/fbs';
        chain.config.rpc_provider = rp;

    });

    describe('#contract.call()', function () {
        it("should transfer", async function () {
            let from={
                keypair:kp
            }

            let result=await chain.rpc.getBalance(kp.hexAddress);
            from.keypair.nonce=result.nonce;

            console.log(chain.rpc.signCallContract(from,null,args));
        });
    });
});
