const axios = require('axios');
// let BaseUrl = "http://localhost:3001";
const CrichainApi = require("../api/crichain");
let contract = {
    path: "./"
}
function loadContract(path) {
    // console.log("constract lenth", this.contracts.length);
    // "../contracts/abi/" + name + ".json"
    let contract = require(path)
    if (!contract) {
        contracts[path] = contract;
    }
    return contract;
}

function init(data) {
    CrichainApi.config(data.baseUrl, data.timeout);
    this.contract = data.contract;
}

module.exports = {
    // BaseUrl: this.BaseUrl,
    init,
    contract,
}