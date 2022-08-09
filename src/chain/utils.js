const ethers = require("ethers")
const chain = require("@crichain/kit.js")
let contracts = {}
function loadContract(path) {
    // console.log("constract lenth", this.contracts.length);
    let contract = require(path)
    if (!contract) {
        contracts[path] = contract;
    }
    return contract;
}
function formatFunctionData(contractCode, method, data) {
    let contractJson = this.loadContract(contractCode);
    // console.log("contract data", contract);
    let contract = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode)
    let abi = contract.interface;
    // console.log("contract abi", abi);
    let dataCode = abi.encodeFunctionData(method, data);
    // console.log("dataCode", dataCode);
    return dataCode;
}
function formatFunctionResult(contractCode, method, data) {
    let contractJson = this.loadContract(contractCode);
    let contract = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode)
    let abi = contract.interface;
    let dataCode = abi.decodeFunctionResult(method, data);
    // console.log("dataCode", dataCode);
    return dataCode;
}
const ContractUtil = {
    // contracts: {},
    loadContract,
    formatFunctionData: formatFunctionData,
    formatFunctionResult: formatFunctionResult
}

module.exports = ContractUtil