const CrichainApi = require('../api/crichain')
const chain = require('@crichain/kit.js')
const utils = require('./utils')
const ethers = require('ethers')
const config = require('./config.js')
const Account = require('./account')

function getContractAbi() {
    let contractJson = utils.loadContract(config.contract.path);
    let contract = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode)
    let abi = contract.interface;
    return abi;
}

async function callcontract(keypair, contractAddress, method, functionType, params) {
    console.log("callcontract data", params);
    let data = null;
    if (functionType == 'tx') {
        let abi = this.getContractAbi();
        dataCode = abi.encodeFunctionData(method, params);
        dataCode = dataCode.substr(2)
        var args = {
            "recipient": contractAddress,
            "data": dataCode,
        }
        let account = await Account.getAccountInfo(keypair.address);

        keypair.nonce = account.nonce;
        let from = {
            keypair: keypair,
        }

        signData = await chain.rpc.sign(from, 4, args);
        data = signData.tx;
    } else {
        data = params;
    }

    let result = await CrichainApi.callcontract(contractAddress, config.contract.code, method, functionType, data);

    return result.data;
}

// 铸造
async function safeMint(keypair, contractAddress, to, tokenId, uri) {
    return await this.callcontract(keypair, contractAddress, "safeMint", "tx", [to, tokenId, uri]);
}

// 转账
async function safeTransfer(keypair, contractAddress, to, tokenId) {
    return await this.callcontract(keypair, contractAddress, "safeTransfer", "tx", [keypair.address, to, tokenId]);
}

// 销毁
async function burn(keypair, contractAddress, tokenId) {
    return await this.callcontract(keypair, contractAddress, "burn", "tx", [tokenId]);
}

// 获取tokenURI
async function tokenURI(keypair, contractAddress, tokenId) {
    return await this.callcontract(keypair, contractAddress, "tokenURI", "view", [tokenId]);
}

module.exports = {
    callcontract,
    safeMint,
    safeTransfer,
    burn,
    tokenURI,
    getContractAbi,
}