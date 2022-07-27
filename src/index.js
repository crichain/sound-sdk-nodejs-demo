
import Buffer from 'buffer'
import KeyPair  from "./chain/keypair.js"
import Protos	from "./chain/protos.js"
import keystore	from "./chain/keystore.js"
import config	from "./chain/config.js"
import utils	from "./chain/utils.js"
import rpc 	from  './chain/rpc.js'
import TransactionInfo from './chain/transaction.js'

const VERSION = "v2022.1.0";

export default {
	version:VERSION,
   	KeyPair:KeyPair,
   	protos:Protos,
   	keystore:keystore,
   	utils:utils,
   	config:config,
   	Buffer:Buffer,
	rpc:rpc,
	TransactionInfo,
};

