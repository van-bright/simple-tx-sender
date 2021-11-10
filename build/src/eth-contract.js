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
exports.ETHContract = void 0;
const web3_1 = __importDefault(require("web3"));
const EthereumTx = require('ethereumjs-tx');
class ETHContract {
    constructor(address, abi) {
        this.web3 = null;
        this.privateKey = "";
        this.abi = abi;
        this.address = address;
    }
    private2Account() {
        return this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    }
    gasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_1.default.utils.toHex(yield this.web3.eth.getGasPrice());
        });
    }
    nonce() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this.private2Account();
            const pubkey = account.address;
            return web3_1.default.utils.toHex(yield this.web3.eth.getTransactionCount(pubkey));
        });
    }
    send(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.privateKey.length === 0)
                    throw new Error("private key is empty");
                //  获取nonce,使用本地私钥发送交易
                const gasPrice = yield this.gasPrice();
                const nonce = yield this.nonce();
                const chainId = yield this.web3.eth.net.getId();
                const txParams = {
                    chainId,
                    nonce,
                    gasPrice,
                    gasLimit: web3_1.default.utils.toHex(tx.gasLimit),
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
    static from(address, abi) { return new ETHContract(address, abi); }
    by(pk) {
        this.privateKey = pk;
        return this;
    }
    at(url) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
        return this;
    }
    init() {
        for (const a of this.abi) {
            this[a.name] = (...args) => __awaiter(this, void 0, void 0, function* () {
                if (a.stateMutability === 'view') {
                    return yield this.query(a.name, ...args);
                }
                else {
                    return yield this.call(a.name, ...args);
                }
            });
        }
        return this;
    }
}
exports.ETHContract = ETHContract;
//# sourceMappingURL=eth-contract.js.map