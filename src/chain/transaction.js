"use strict";

import proto from './protos.js'
import config from "./config.js"
import utils from './utils.js'
import Method from './method.js'
import BN from 'bn.js';

class Transaction extends Method {
	/**
	 * 
	 * @param {*} this.args 
	 * this.args:{
	 * 	from:"",to:"",amount:"",
	 * }
	 */
	constructor(args) {
		// code
		super(args);
		this.args = args;
		this.uri = "/txt/pbmtx.do"
	}
	genBody() {	//override by implements
		return {};
	}
	//
	// methods
	toJSONPayload(args) {
		return { "address": args[0] };
	}
}

export default class TransactionInfo extends Transaction {
	constructor(args) {
		super(args);
	}
	genBody() {
		// console.log("transaction args", this.args);
		let TransactionBody = proto.load('TransactionBody');
		var txbody = NaN;
		let keypair = this.args.keypair;
		// let timestamp = new Date().getTime();
		txbody = TransactionBody.create();

		// console.log(JSON.stringify(this.args))

		if (this.args.nonce) {
			txbody.nonce = this.args.nonce;
		}
		txbody.address = Buffer.from(this.removePrefix(keypair.hexAddress), 'hex');

		if (this.args.ext_data) {
			txbody.extData = Buffer.from(this.args.ext_data, 'hex');
		}

		if (this.args.code_data) {
			txbody.codeData = Buffer.from(this.args.code_data, 'hex');
		}

		// console.log("args="+JSON.stringify(this.args))
		if (this.args.recipient) {
			if (typeof this.args.recipient === 'string') {
				txbody.recipient = Buffer.from(this.removePrefix(this.args.recipient), 'hex');
			} else {
				txbody.recipient = this.args.recipient;
			}
		} else
			if (this.args.to) {
				if (typeof this.args.to === 'string') {
					txbody.recipient = Buffer.from(this.removePrefix(this.args.to), 'hex');
				} else {
					txbody.recipient = this.args.to;
				}
			}

		// console.log("recipient="+txbody.recipient);

		if (this.args.amount && typeof this.args.amount === 'string') {
			if (this.args.amount.startsWith('0x')) {
				txbody.amount = Buffer.from(this.args.amount.substring(2), 'hex');
			} else {
				txbody.amount = Buffer.from(parseInt(this.args.amount).toString(16), "hex");
			}
			// console.log("txbody.amount=="+txbody.amount);
		}
		// if(this.args.amount){
		// txbody.amount=new BN(this.args.amount).toArrayLike(Buffer);
		// }

		// console.log("amount=="+this.args.amount);
		// console.log("txbody.amount=="+txbody.amount.toString());
		txbody.timestamp = new Date().getTime();
		txbody.innerCodetype = this.args.inner_codetype != 0 ? this.args.inner_codetype : null;
		txbody.version = Buffer.from(Buffer.from(config.version, "utf8"), 'hex');
		txbody.chainId = config.chainId;

		let ecdata = Buffer.from(TransactionBody.encode(txbody).finish());
		let ecdataSign = keypair.ecHexSign(ecdata);

		let transactionInfo = proto.load("TransactionInfo");
		let tinfo = transactionInfo.create({
			body: txbody,
			signature: Buffer.from(ecdataSign, "hex")
		});

		// console.log("tinfo==="+ JSON.stringify(this.args.to));
		let tx = Buffer.from(transactionInfo.encode(tinfo).finish(), "hex").toString("hex");

		return { "tx": tx };
	}
}