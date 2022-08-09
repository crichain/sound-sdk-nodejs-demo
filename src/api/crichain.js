const Axios = require('axios');
let url = "http://localhost:3001"
const { v4: uuid } = require('uuid');
let axios = Axios.create({
    baseURL: url,
    timeout: 30000,
    headers: {
        'x-request-id': uuid()
    }
});

function config(baseUrl, timeout) {
    this.url = baseUrl;
    axios = Axios.create({
        baseURL: baseUrl,
        timeout: timeout ? timeout : 30000,
        headers: {
            'x-request-id': uuid()
        }
    });
}

async function callcontract(contractAddress, contractCode, method, functionType, data) {
    let body = {
        method: method,
        functionType: functionType,
        contractCode: contractCode,
        contractAddress: contractAddress,
        operateId: uuid()
    }
    if(functionType == 'view'){
        body['params'] = data;
    }else{
        body['data'] = data;
    }
    console.log("body", body);
    let result = await axios.post('/chain/callcontract.json', body)
    // console.log("result", result.data);
    return result.data;
}

async function account(address) {
    let result = await axios.get('/chain/account.json', {
        params: {
            address: address
        }
    })
    return result.data;
}

async function realauth(address, realName, idCardNo) {
    let result = await axios.post('/chain/realAuth.json', {
        address: address,
        realName: realName,
        idCardNo: idCardNo
    })
    return result.data;
}

async function getTransactionInfo(hash) {
    let result = await axios.get('/chain/transaction.json', {
        params: { hash: hash }
    })
    return result.data;
}

async function transferCric(txData) {
    let result = await axios.post('/chain/transferCric.json', {
        txData: txData
    })
    // console.log("transfer cric",result);
    return result.data;
}

module.exports = {
    config,
    callcontract,
    account,
    getTransactionInfo,
    transferCric,
    realauth,
}