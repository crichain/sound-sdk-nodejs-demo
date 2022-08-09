const chain = require('../src');

async function main() {
    chain.Config.init({
        // baseUrl: "http://test.open-api.crichain.cn",
        baseUrl: "http://localhost:3001",
        contract: { path: "../../contracts/abi/NFT_A.json", code: "NFT_A" }
    });
    // 测试合约地址
    // 0x10a35e43698ca65009c61550b5e9f20226042609
    // 解析发行商私钥
    // 0x8fa5914ae97735b19d5cfaac0bf4e04ab55a4dab
    let kp = chain.Account.genFromPrikey("e6779259efd057970aa83ea5cc9db62d72695ce95de9cb117c8b635418605e5d");

    // 初始化账户
    let kpA = chain.Account.genKeypair();
    // tokenId不能重复
    let tokenId = 4;

    console.log("kpA", kpA);

    // 实名认证
    let result1 = await chain.Account.realauth(kpA.hexAddress, "张东乐", "410526199203078739");
    console.log("realauth", result1);


    let account = await chain.Account.getAccountInfo(kp.address);
    console.log("account", account);

    // 铸造
    let result2 = await chain.Contract.safeMint(kp, "0x10a35e43698ca65009c61550b5e9f20226042609", kp.address, tokenId, "https://www.baidu.com");
    console.log("safeMint", result2);

    // 转移NFT
    setTimeout(async function () {
        let result3 = await chain.Contract.safeTransfer(kp, "0x10a35e43698ca65009c61550b5e9f20226042609", kpA.address, tokenId);
        console.log("safeTransfer", result3);
    }, 2 * 1000);

    setTimeout(async function () {
        // 转账CRIC
        let result4 = await chain.Account.transferCric(kp, kpA.hexAddress, "0.1");
        console.log("transferCric", result4);
    }, 2 * 1000);

    setTimeout(async function () {
        // 销毁NFT
        let result5 = await chain.Contract.burn(kpA, "0x10a35e43698ca65009c61550b5e9f20226042609", tokenId);
        console.log("burn", result5);
    }, 3 * 1000);

}

main()
    .then(() => function () {
        console.log("结束执行")
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });