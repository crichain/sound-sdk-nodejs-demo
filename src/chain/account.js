const chain = require("@crichain/kit.js")
const ethers = require("ethers")
const CrichainApi = require("../api/crichain")
chain.config.chainId = 168;

// 生成秘钥对
function genKeypair() {
    let kp = chain.KeyPair.genRandomKey()
    kp.address = "0x" + kp.hexAddress;
    return kp;
}

// 从私钥解析秘钥对
function genFromPrikey(privateKey) {
    let kp = chain.KeyPair.genFromPrikey(privateKey);
    kp.address = "0x" + kp.hexAddress;
    return kp;
}

// 获取账户信息
async function getAccountInfo(address) {
    let account = await CrichainApi.account(address);
    return account.data;
}

// 获取账户信息
async function realauth(address, username, idCardNo) {
    let result = await CrichainApi.realauth(address, username, idCardNo);
    return result.data;
}

// 转账
async function transferCric(keypair, to, amount) {
    let kp = keypair;
    let account = await this.getAccountInfo(kp.hexAddress);
    kp.nonce = account.nonce + 1;
    to = chain.rpc.removePrefix(to);
    let from = {
        keypair: kp
    }
    var args = {
        "recipient": to,
        "amount": ethers.utils.parseEther(amount).toHexString(),
    }
    let signData = await chain.rpc.sign(from, 0, args);
    let result = await CrichainApi.transferCric(signData.tx);
    return result.data;
}

module.exports = {
    genKeypair,
    genFromPrikey,
    transferCric,
    getAccountInfo,
    realauth,
}