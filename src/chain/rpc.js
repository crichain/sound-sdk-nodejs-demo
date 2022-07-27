import Method from './method.js'
import _ from 'lodash'
import utils from './utils.js';
import config from "./config.js"
import TransactionInfo from "./transaction.js"
import KeyPair from "./keypair.js";
import BN from 'bn.js';
import proto from './protos.js'
import sha3 from 'sha3';

class PatternMethod extends Method {
	constructor(pattern, uri) {
		super(pattern)
		this.pattern = pattern;
		this.uri = uri;
	}
	static _(pattern, uri) {
		return new PatternMethod(pattern, uri)
	}
	static _(pattern, mod, cmd) {
		var uri = "/" + mod + "/pb" + cmd + ".do";
		return new PatternMethod(pattern, uri.toLowerCase());
	}
	request(args, opts) {
		var content;
		opts = opts || {};
		// content = JSON.stringify(args);
		var baseUrl = opts.server_base || global.server_base || config.server_base;
		var rpcprovider = config.rpc_provider;
		if (rpcprovider) {
			let result = rpcprovider({
				baseUrl: baseUrl,
				uri: this.uri,
				method: 'POST',
				body: args,
				json: true
			});
			return result;
		} else {
			return new Promise((resolve, reject) => {
				reject("rpc provider not found")
			});;
		}
	}

}

var getBlockByNumber = PatternMethod._(_.template('{"height":"<%- args[0] %>"}'), "bct", "gbn");
var getBalance = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "act", "gac");
var getBlockByMax = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "bct", "glb");
var getBlockByHash = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "bct", "gbh");
var getTransaction = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "tct", "gth");
var getStorageValue = PatternMethod._(_.template('{"address":"<%- args[0] %>","key":["<%- args[1] %>"]}'), "cvm", "gcs");
var sendRawTransaction = PatternMethod._(_.template('""'), "tct", "mtx");

var validOpts = function (opts) {
	var keypair = opts.keypair;
	var from = opts.from;
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("brewchain.rpc:from not set or type error:" + from);
		});
	}
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}
}

var __sign = function (from, type, exdata, args) {
	// console.log("rpc sign", args);
	//发送交易
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("brewchain.rpc:from not set or type error:" + from);
		});
	}
	var keypair = from.keypair;
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}

	var opts = {};

	switch (type) {

		case transactionType.EVFS_AUTH:

			let ContractEVFS = proto.load("ContractEVFS");
			let code = ContractEVFS.create();
			code.function = ContractEVFSFunction.EVNODE_BUY;

			let EVNode = proto.load("EVNode");
			let evNode = EVNode.create();
			if (args.nodeUuid) {
				evNode.nodeUuid = Buffer.from(removePrefix(args.nodeUuid), 'hex');
			}
			if (args.licenseFee) {
				evNode.licenseFee = new BN(args.licenseFee).toArrayLike(Buffer);//.toArrayLike(Buffer);
			}
			if (args.licensePrice) {
				evNode.licensePrice = new BN(args.licensePrice).toArrayLike(Buffer);//.toArrayLike(Buffer);
			}
			if (args.licenseFee || args.licensePrice) {
				code.function = ContractEVFSFunction.EVNODE_UPDATE;
			}
			if (args.tos) {
				let tos = [];
				for (let j = 0; j < args.tos.length; j++) {
					tos.push(Buffer.from(removePrefix(args.tos[j]), "hex"));
				}
				code.tos = tos;
			}
			if (args.hasOwnProperty("values")) {
				if (args.values) {
					let values = [];
					for (let j = 0; j < args.values.length; j++) {
						values.push(new BN(args.values[j]).toArrayLike(Buffer));
					}
					code.values = values;
				}
			}
			code.from = Buffer.from(removePrefix(from.keypair.hexAddress), 'hex');
			code.evNode = evNode;
			opts = getTransactionOpts(from, type, exdata, Buffer.from(ContractEVFS.encode(code).finish(), "hex"));

			break;
		//evfs_token创建
		case transactionType.EVFS_CREATETOKEN:
			opts = getTransactionOpts(from, transactionType.EVFS_AUTH, null, Buffer.from(args.data, "hex"));
			break;
		case transactionType.XVM_CONTRACT:
			if (!args || !args.data) {
				return new Promise((resolve, reject) => {
					reject("缺少参数data")
				});
			} else {
				// let CVMContract = proto.load("CVMContract");
				// let cvmContract = CVMContract.create();
				// cvmContract.parrallel = (args.parrallel == null ? false : args.parrallel);
				// cvmContract.datas=args.data;
				// let codedata=CVMContract.encode(cvmContract).finish();
				let codedata = Buffer.from(args.data, "hex")
				opts = getTransactionOpts(from, type, exdata, codedata, args);
			}
			break;
		default:
			// console.log("type default");
			// let outs = generateOutputs(args);
			opts = getTransactionOpts(from, type, exdata, null, args);
			break;
	}
	return new TransactionInfo(opts).genBody();
}
var __sendTxTransaction = function (from, type, extdata, args) {
	let result = __sign(from, type, extdata, args);
	return sendRawTransaction.request(result);
};

var generateOutputs = function (outputs) {
	let outs = [];
	let pams = outputs;

	for (let i = 0; i < pams.length; i++) {
		let pm = pams[i];
		let out = {
			address: Buffer.from(removePrefix(pm.address), "hex"),
			amount: new BN(0).toArrayLike(Buffer),
		};
		if (pm.amount) {
			out.amount = new BN(pm.amount).toArrayLike(Buffer);
		}
		if (pm.token && pm.tokenAmount) {
			out.token = Buffer.from(pm.token, "ascii");
			out.tokenAmount = new BN(pm.tokenAmount).toArrayLike(Buffer);
		}
		if (pm.cryptoToken && pm.symbol) {
			let cryTokens = [];
			for (let j = 0; j < pm.cryptoToken.length; j++) {
				cryTokens.push(Buffer.from(pm.cryptoToken[j], "hex"));
			}
			out.symbol = Buffer.from(pm.symbol, "ascii");
			out.cryptoToken = cryTokens;
		}
		outs.push(out);
	}
	return outs;
}

var getTransactionOpts = function (from, type, extdata, codedata, args) {
	var opts = {};
	opts.keypair = from.keypair;
	let nonce = from.keypair.nonce;
	opts.nonce = (nonce === 0 || isNaN(nonce)) ? null : nonce;
	opts.inner_codetype = type;
	opts.ext_data = extdata || null;
	opts.code_data = codedata || null;
	// opts.outputs = outputs || null;

	if (args.to) {
		opts.recipient = args.to;
	} else
		if (args.address) {
			opts.recipient = args.address;
		} else
			if (args.recipient) {
				opts.recipient = args.recipient;
			}

	if (args.value) {
		opts.amount = args.value;
	}
	else
		if (args.amount) {
			opts.amount = args.amount;
		}

	return opts;
}
//transfer类型
var transactionType = {
	NORMAL: 0,//普通交易
	MULI_SIGN: 1,//多重签名交易
	RC20_CONTRACT: 2,//RC20交易
	RC721_CONTRACT: 3,//RC721交易
	XVM_CONTRACT: 4,//CVM合约调用
	EVFS_AUTH: 6,
	EVFS_CREATETOKEN: 16
};
//crc20类型
var functionType = {
	CONSTRUCT_FIXSUPPLY: 1,
	CONSTRUCT_PRINTABLE: 2,
	TRANSFERS: 3,
	PRINT: 4,
	BURN: 5,
	ADDMANAGERS: 6,
	RMMANAGERS: 7
}
var ContractEVFSFunction = {
	EVNODE_PUT: 11,
	EVNODE_BUY: 15,
	EVNODE_UPDATE: 16
}

var removePrefix = function (addr) {
	if (addr.startsWith('0x')) {
		return addr.substring(2);
	} else {
		return addr;
	}
}

function base64Encode(input) {
	var rv;
	rv = encodeURIComponent(input);
	rv = unescape(rv);
	rv = window.btoa(rv);
	return rv;
}
export default {
	removePrefix: function (addr) {
		if (addr.startsWith('0x') || addr.startsWith('0x')) {
			return addr.substring(2);
		} else {
			return addr;
		}
	},
	/**
	 * 获取balance
	 * @param {*} args 0x59514f8d87c964520fcaf515d300e3f704bf6fcb
	 * @param {*} opts 
	 */
	getBalance: function (args, opts) {
		return getBalance.request({ "address": removePrefix(args) }, opts);
	},
	/**
	 * 按高度获取区块信息
	 * @param {*} args  100
	 * @param {*} opts 
	 */
	getBlockByNumber: function (args, opts) {
		return getBlockByNumber.request({ "height": args, "type": 1 }, opts);
	},
	getBlockByHash: function (args, opts) { return getBlockByHash.request({ "hash": removePrefix(args) }, opts); },
	getBlockByMax: function (args, opts) { return getBlockByMax.request(args, opts); },
	/**
	 * 查交易
	 * @param {*} args "0xaabc6be80cb8f2f2c3657532833bde26692986c38421ab4a2141f882cee2b0f1"
	 * @param {*} opts 
	 */
	getTransaction: function (args, opts) {
		return getTransaction.request({ "hash": removePrefix(args) }, opts);
	},
	/**
	 * 
	 * @param {*} args 0x59514f8d87c964520fcaf515d300e3f704bf6fcb
	 * @param {*} opts ["","",""]
	 */
	getStorageValue: function (args, opts) {
		return getStorageValue.request({ "address": removePrefix(args), "key": [opts] });
	},
	/**
	 * 获取交易类型
	 */
	getTransType: function () {
		return transactionType;
	},
	/**
	 * transfer normal
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
	 */
	transfer: function (from, exdata, args) {
		return __sendTxTransaction(from, transactionType.NORMAL, exdata, args);
	},
	/**
	 * sign transfer normal
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
	 */
	signTransfer: function (from, exdata, args) {
		return __sign(from, transactionType.NORMAL, exdata, args);
	},
	/**
	 * create contract
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args {"data":"hexstring"}
	 */
	createContract: function (from, exdata, args) {
		return __sendTxTransaction(from, transactionType.XVM_CONTRACT, exdata, args);
	},
	/**
	 * sign create contract
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args {"data":"hexstring"}
	 */
	signCreateContract: function (from, exdata, args) {
		return __sign(from, transactionType.XVM_CONTRACT, exdata, args);
	},
	/**
	 * call contract
	 * @param {*} from 
	 * @param {*} exdata
	 * @param {*} args {"to":"", "data":"hexstring", "amount":""}
	 */
	callContract: function (from, exdata, args) {
		return __sendTxTransaction(from, transactionType.XVM_CONTRACT, exdata, args);
	},
	sendTransaction: function (result) {
		return sendRawTransaction.request(result);
	},
	/**
	 * sign call contract
	 * @param {*} from 
	 * @param {*} exdata
	 * @param {*} args {"to":"", "data":"hexstring", "amount":""}
	 */
	signCallContract: function (from, exdata, args) {
		return __sign(from, transactionType.XVM_CONTRACT, exdata, args);
	},
	/**
	 * 发布token
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":12} 
	 */
	createToken: function (from, exdata, args) {
		args.function = functionType.CONSTRUCT_PRINTABLE;
		return __sendTxTransaction(from, transactionType.RC20_CONTRACT, exdata, args);
	},
	/**
	 * sign 发布token
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} exdata
	 * @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":12} 
	 */
	signCreateToken: function (from, exdata, args) {
		args.function = functionType.CONSTRUCT_PRINTABLE;
		return __sign(from, transactionType.RC20_CONTRACT, exdata, args);
	},
	/**
	 * transfer token 
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} token
	 * @param {*} args {"tos":["",""], "values":["",""]} 
	 */
	transferToken: function (from, token, args) {
		args.function = functionType.TRANSFERS;
		args.tokenAddress = token;
		return __sendTxTransaction(from, transactionType.RC20_CONTRACT, null, args);
	},
	/**
	 * sign transfer token 
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} token
	 * @param {*} args {"tos":["",""], "values":["",""]} 
	 */
	signTransferToken: function (from, token, args) {
		args.function = functionType.TRANSFERS;
		args.tokenAddress = token;
		return __sign(from, transactionType.RC20_CONTRACT, null, args);
	},
	/**
	 * sign
	 * @param {*} from 
	 * @param {*} args 
	 */
	sign: function (from, type, args) {
		// return __sendTxTransaction(from, transactionType.NORMAL, null, args);
		// console.log("args", args);
		return __sign(from, type, null, args);
	},
	/**
	 * 交易hash签名
	 * @param {*} from {"keypair":{"address":"","privateKey":""}}
	 * @param {*} exdata 
	 * @param {*} args {data:"交易hash"} 
	 */
	signTx: function (from, args) {
		var d = new Date().getTime();
		var buf = new BN(d).toArrayLike(Buffer, d, 32);
		console.log(buf.toString('hex'))

		return {
			sign: from.keypair.ecHexSign(args.data + buf.toString('hex')),
			timestamp: d,
			tx: args.data
		};
	},
	/**
	 * 创建evfs_token
	 * @param {*} from 
	 * @param {*} args {"data":"hexstring"} 
	 */
	createEvfsToken: function (from, args) {
		return __sendTxTransaction(from, transactionType.EVFS_CREATETOKEN, null, args);
	},
	/**
	 * evfs上链签名
	 * @param {*} from 
	 * @param {*} args { 
	 * 	"tokenAddrOrSymbol":"evs","nodeSize":10000,"nodeName":"",
	 * 	"extDesc":"","replicas":3,"slices":10,"tos":["",""],licenseFee:10,licensePrice:100,"permissions":"4"
	 * }
	 */
	signReqUpload: function (from, args) {
		let ReqEVNode = proto.load("ReqEVNode")
		let reqEVNode = ReqEVNode.create();

		reqEVNode.from = Buffer.from(removePrefix(from.keypair.hexAddress), 'hex');
		reqEVNode.tokenAddrOrSymbol = args.tokenAddrOrSymbol;
		let EVNode = proto.load("EVNode");
		let evNode = EVNode.create();
		var buffer = Buffer.alloc(1)
		buffer[0] = args.permissions;
		evNode.permissions = buffer;
		evNode.nodeSize = args.nodeSize;
		evNode.nodeName = Buffer.from(args.nodeName, "ascii");//ByteString.copyFrom(uploadFile.getName().getBytes())
		evNode.extDesc = Buffer.from(args.extDesc, "ascii");//ByteString.copyFrom("test".getBytes())
		evNode.salts = Date.now();
		evNode.replicas = args.replicas;
		evNode.slices = args.slices;

		buffer = new Uint8Array(8);
		buffer[7] = args.licenseFee;
		evNode.licenseFee = buffer;
		buffer[7] = args.licensePrice
		evNode.licensePrice = buffer;

		let randSeed = Math.abs(evNode.salts);
		let domainAddress = Buffer.from(evNode.domainAddress, 'hex');
		let ownerAddress = Buffer.from(evNode.ownerAddress, 'hex');
		let uuid = Buffer.concat([domainAddress, ownerAddress], domainAddress.length + ownerAddress.length);
		let nonceBuffer = new BN(from.keypair.nonce).toArrayLike(Buffer);

		let randSeedBuffer = new BN(randSeed).toArrayLike(Buffer);
		uuid = Buffer.concat([uuid, nonceBuffer], uuid.length + nonceBuffer.length)
		uuid = Buffer.concat([uuid, randSeedBuffer], uuid.length + randSeedBuffer.length);

		let hash = sha3(256);
		hash.update(Buffer.from(uuid));
		let hashuuid = utils.toHex(hash.digest());
		evNode.nodeUuid = hashuuid;
		reqEVNode.node = evNode;

		let ContractEVFS = proto.load("ContractEVFS");
		let code = ContractEVFS.create();
		code.function = ContractEVFSFunction.EVNODE_PUT;
		if (args.tos) {
			let tos = [];
			for (let j = 0; j < args.tos.length; j++) {
				tos.push(Buffer.from(args.tos[j], "hex"));
			}
			code.tos = tos;
		}
		if (args.values) {
			let values = [];
			for (let j = 0; j < args.values.length; j++) {
				values.push(new BN(args.values[j]).toArrayLike(Buffer));
			}
			code.values = values;
		}
		code.from = reqEVNode.from;
		code.symbol = reqEVNode.tokenAddrOrSymbol;
		code.evNode = evNode;

		let TransactionBody = proto.load("TransactionBody");
		let txbody = TransactionBody.create();
		txbody.address = reqEVNode.from;
		txbody.nonce = from.keypair.nonce;
		txbody.timestamp = new Date().getTime();
		txbody.innerCodetype = 6;
		txbody.codeData = Buffer.from(ContractEVFS.encode(code).finish(), 'hex');
		let ecdata = Buffer.from(TransactionBody.encode(txbody).finish());
		let ecdataSign = from.keypair.ecHexSign(ecdata);

		reqEVNode.sign = Buffer.from(ecdataSign, "hex");
		//Buffer.from(ReqEVNode.encode(reqEVNode).finish(),"hex")

		let req = {}, reqNode = {};
		reqNode.permissions = Buffer.from(evNode.permissions, "hex").toString("hex");
		reqNode.node_size = evNode.nodeSize;
		reqNode.node_name = evNode.nodeName;
		reqNode.ext_desc = evNode.extDesc;
		reqNode.salts = evNode.salts;
		reqNode.replicas = args.replicas;
		reqNode.slices = args.slices;
		reqNode.license_fee = "0x".concat(new BN(args.licenseFee).toString(16));//.toArrayLike(Buffer);
		reqNode.license_price = "0x".concat(new BN(args.licensePrice).toString(16));//.toArrayLike(Buffer);
		req.from = reqEVNode.from.toString("hex");
		req.token_addr_or_symbol = reqEVNode.tokenAddrOrSymbol;
		req.node = reqNode;
		req.sign = reqEVNode.sign.toString("hex");
		return req;
	},
	/**
	 * evfs授权
	 * @param {*} from 
	 * @param {*} args { "nodeUuid":"0x00","tos":[],"values":[] }
	 */
	signEvfsAuth: function (from, args) {
		return __sign(from, transactionType.EVFS_AUTH, null, args);
	},
	/**
	 * evfs价格修改
	 * @param {*} from 
	 * @param {*} args { "nodeUuid":"0x00","tos":[],"values":[],"licensePrice":"","licenseFee":"" }
	 */
	signEvfsUpdatePrice: function (from, args) {
		return __sign(from, transactionType.EVFS_AUTH, null, args);
	},
	/**
	 * 签名反序列化
	 * @param {*} args 
	 */
	signDecode: function (args) {
		let transactionInfo = proto.load("TransactionInfo");
		// console.log(args.tx)
		return transactionInfo.decode(Buffer.from(args.tx, "hex"));
	}

}