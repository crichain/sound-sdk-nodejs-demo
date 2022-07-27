const brewchain = require("@brewchain/kit.js")
const { ethers } = require("hardhat");
const rp = require('request-promise');

describe("签名验签", async function () {
    let kp = null, passwd = "000000";
    before(function () {
        kp = brewchain.KeyPair.genFromPrikey("cd5322548d47cafcd3750cd3a48853d4494a3caa82f77163aac7cb48cdf3a821");
        brewchain.config.server_base = hre.config.defaultNetwork.url;
        brewchain.config.rpc_provider = rp;
    });
    it("数据签名", async function () {
        // let res = brewchain.rpc.signCallContract(kp, "", {
        //     "to": "",
        //     "data": "hexstring",
        //     "amount": ""
        // });
        let res = kp.ecHexSign("123123");
        console.log("签名结果", res);
    });

    it("发送交易", async function () {
        let from = {
            keypair: kp
        }
        var args = {
            "to": "0xc61098682d4862343c051ab7781703a4619ccff9",
        }
        let result = brewchain.rpc.sign(from, 4, args);
        console.log("签名结果", result);
        brewchain.sendRawTransaction.request(result);
    });
    it("数据验签", async function () {
        let res = kp.ecHexVerify("123123", "220388786b806e586f1ed1a2e45d8eb3e057d116487142cb8aa3426f38cae5d42057df14e7e85034bc38606449cb6c8939c08ebed440842bf5d9befbba885df373bd0fa93e4a4e55b571f8ad9b3e86cd38ed3cf5609ca02df9342e8f065fbd5ff17aa19fd9618c4c0374059da3d7118419180877875617216eede8be920740e6ac32d511cb64befbeaed1f263a5ace728047cb38");
        console.log("验签结果", res);
    })
})