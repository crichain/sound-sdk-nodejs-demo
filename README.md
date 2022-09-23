### @crichain/sdk
-----------------------

### Install

```
$ npm install @crichain/sdk
```

### Super simple to use

Setting up the config
```js
const brew=require('@crichain/sdk');
chain.Config.init({
    // baseUrl: "http://test.open-api.crichain.cn",
    baseUrl: "http://localhost:3001",
    contract: { 
        path: "../../contracts/abi/NFT_A.json", 
        code: "NFT_A" }
});
```