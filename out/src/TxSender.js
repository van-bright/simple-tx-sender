"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxSender = void 0;
const web3_1 = __importDefault(require("web3"));
const EthereumTx = require('ethereumjs-tx');
class TxSender {
    constructor(url, abi, address, privateKey) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
        this.abi = abi;
        this.address = address;
        this.privateKey = privateKey;
    }
    from() {
        return this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    }
    gasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_1.default.utils.toHex(yield this.web3.eth.getGasPrice());
        });
    }
    nonce() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.from();
            const pubkey = account.address;
            return web3_1.default.utils.toHex(yield this.web3.eth.getTransactionCount(pubkey));
        });
    }
    send(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                //  获取nonce,使用本地私钥发送交易
                // const chainId = await this.web3.eth.getChainId();
                const gasPrice = yield this.gasPrice();
                const nonce = yield this.nonce();
                const txParams = {
                    nonce,
                    gasPrice,
                    gasLimit: web3_1.default.utils.toHex(tx.gasLimit),
                    // 注意这里是代币合约地址
                    to: this.address,
                    // 调用合约转账value这里留空
                    value: '0x00',
                    data: tx.data,
                };
                const etx = new EthereumTx(txParams);
                // 引入私钥，并转换为16进制
                const privateKeyHex = Buffer.from(this.privateKey.replace(/^0x/, ''), 'hex');
                // 用私钥签署交易
                etx.sign(privateKeyHex);
                // // 序列化
                const serializedTx = etx.serialize();
                const signedTxHex = `0x${serializedTx.toString('hex')}`;
                // const txHash = `0x${etx.hash().toString('hex')}`;
                this.web3.eth.sendSignedTransaction(signedTxHex)
                    .on('receipt', (receipt) => resolve(receipt))
                    .on('error', (e) => reject(e));
            }));
        });
    }
    encode(pubkey, method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new this.web3.eth.Contract(this.abi, this.address);
            const data = yield instance.methods[method](...args).encodeABI();
            const gasLimit = yield instance.methods[method](...args).estimateGas({ from: pubkey });
            return { data, gasLimit };
        });
    }
    deploy(txopt) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolver, rejector) => __awaiter(this, void 0, void 0, function* () {
                const from = this.from();
                const frompub = from.address;
                console.log('frompub: ', frompub);
                const gasPrice = yield this.gasPrice();
                let contract = new this.web3.eth.Contract(this.abi);
                contract.deploy({
                    data: txopt.bytecode,
                })
                    .send({
                    from: frompub,
                    gas: txopt.gasLimit,
                    gasPrice,
                })
                    .on('error', (error) => { rejector(error); })
                    .on('receipt', (receipt) => {
                    // resolver(receipt.contractAddress);
                    console.log('receipt : ', receipt.contractAddress);
                })
                    .on('transactionHash', (transactionHash) => { console.log('transactionHash: ', transactionHash); })
                    .on('confirmation', (confirmationNumber, receipt) => { console.log('confirmation: ', confirmationNumber); })
                    .then((newContractInstance) => {
                    console.log('newInstance', newContractInstance.options.address); // instance with the new contract address
                    resolver(newContractInstance.options.address);
                });
            }));
        });
    }
    call(method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
            const pubkey = account.address;
            const tx = yield this.encode(pubkey, method, ...args);
            return yield this.send(tx);
        });
    }
    query(method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new this.web3.eth.Contract(this.abi, this.address);
            const result = yield instance.methods[method](...args).call();
            return result;
        });
    }
}
exports.TxSender = TxSender;
//# sourceMappingURL=TxSender.js.map