const CrichainApi = require('../api/crichain')

async function getTransactionInfo(hash) {
    let result = CrichainApi.getTransactionInfo(hash);
    return result;
}

module.exports = {
    getTransactionInfo,
}