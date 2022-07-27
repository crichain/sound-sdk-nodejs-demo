const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');

describe('Brewchain.accounts', function () {

    describe('#generateAccount()', function () {
        it("should generate a new account", async function () {
            let kp=chain.KeyPair.genRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);

            kp=chain.KeyPair.genRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);

            kp=chain.KeyPair.genRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);

            kp=chain.KeyPair.genRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });

        // it("should generate account from prikey", async function () {
        //     const kp=chain.KeyPair.genFromPrikey("3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8");
        //     console.log("kp.hexAddress %s",kp.hexAddress);
        //     console.log("kp.hexPrikey %s",kp.hexPrikey);
        //     console.log("kp.hexPubkey %s",kp.hexPubkey);
        //     console.log("kp.nonce %s",kp.nonce);
        // });

        it("should generate account from prikey", async function () {
            const kp=chain.KeyPair.genFromPrikey("58c8c8657ed99a2a10e56a48af07fbc2b5f1b1b01cf89fd2fd6207522998d35c");
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });

        

        it("should generate a new account for cvn", async function () {
            // const kp=chain.KeyPair.genCVNRandomKey();
            // console.log("kp.hexAddress %s",kp.hexAddress);
            // console.log("kp.hexPrikey %s",kp.hexPrikey);
            // console.log("kp.hexPubkey %s",kp.hexPubkey);
            // console.log("kp.nonce %s",kp.nonce);
        });

        // it("should generate account from prikey for cvn", async function () {
        //     const kp=chain.KeyPair.genCVNFromPrikey("3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8");
        //     console.log("kp.hexAddress %s",kp.hexAddress);
        //     console.log("kp.hexPrikey %s",kp.hexPrikey);
        //     console.log("kp.hexPubkey %s",kp.hexPubkey);
        //     console.log("kp.nonce %s",kp.nonce);
        // });
    });
});

// //73bd0fa93e4a4e55b571f8ad9b3e86cd38ed3cf5
// System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("cd5322548d47cafcd3750cd3a48853d4494a3caa82f77163aac7cb48cdf3a821"))));
// //        66330eeb3271a39a8f8b11690e84deda054d6a97
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("ed3b5e6126b4fb4ebc5783e7bf8a83817045297760a17299b0d086dfd043a01d"))));
//         //120e02260ba3518d8e2d21b990983a488d3e07be
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("8511a6081a2b498f7665622fe0175a78ee8dd4c75a516a7af40466d896596f34"))));
//         //82480d3c6faaffaac3da84ae678cc75aae491937
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("f97df0467c9c932f99c0973ad26976efcaed78dbdd56ac324843caaa5fa77a6c"))));
//         //f3d1b46d307491dc6615203df68120d427f1ed95
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("c07a437fc403eb2155338c9d8e7b9ead35e9d47f7799b5b811dfd81f6b0830a2"))));
//         //a9207ac9e446cc3f3658c9a26a48a7a2a1460b8c
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("71a4cdbda857cece6876d43750cabfe48b87470a53377ed65ccd76b5c55b2372"))));
//         //6864f68d255d629728c1dad55eeb00ee0bf9ea28
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("0086e41e2f3293c63ea825328acf913e7a99482627ce07f92d99d04144713612"))));
//         //9cdbb520508ad9ab5406c9d69b02adc284eb31bb
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("348d72f44053df317d08989104e12ce94083c1a7adeaf326dfab9c4c7111f530"))));
//         //13b36bfe6f84558314e35a75c51f75a42a964c41
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("5682dc35bb96c104a35308b91861b79a4e50886d2140349a5cc5ed557ea01a25"))));
//         //76bba21a9ba5720185c07673979cc5c560359a8e
//         System.out.println("sigAddr = "+crypto.bytesToHexStr(crypto.privateKeyToAddress(crypto.hexStrToBytes("ab24416c3c7d0b26fcec898100966450917ea16784b25ec180ae5163e553d979"))));