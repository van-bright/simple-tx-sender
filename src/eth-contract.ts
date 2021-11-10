import Web3 from 'web3';
import {AbiItem} from 'web3-utils';

const EthereumTx = require('ethereumjs-tx');

type TxData = any;

export interface TxOpt {
  data?: number[], // for calling or querying operation
  gasLimit: number,

}

export class ETHContract {
  [fn: string]: any;

  web3: Web3 | null = null;
  abi: AbiItem[];
  address: string;
  privateKey: string = "";

  private constructor(address: string, abi: any) {
    this.abi = abi as AbiItem[];
    this.address = address;
  }

  private private2Account() {
    return this.web3!.eth.accounts.privateKeyToAccount(this.privateKey);
  }

  private async gasPrice() {
    return Web3.utils.toHex(await this.web3!.eth.getGasPrice());
  }

  private async nonce() {
    const account = this.private2Account();
    const pubkey = account.address
    return Web3.utils.toHex(await this.web3!.eth.getTransactionCount(pubkey));
  }

  private async send(tx: TxOpt): Promise<any> {
    return new Promise(async (resolve, reject) => {

      if (this.privateKey.length === 0) throw new Error("private key is empty");

      //  获取nonce,使用本地私钥发送交易
      const gasPrice = await this.gasPrice();
      const nonce = await this.nonce();
      const chainId = await this.web3!.eth.net.getId();

      const txParams: TxData = {
        chainId,
        nonce,
        gasPrice,
        gasLimit: Web3.utils.toHex(tx.gasLimit),
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
      this.web3!.eth.sendSignedTransaction(signedTxHex)
        .on('receipt', (receipt) => resolve(receipt))
        .on('error', (e) => reject(e));
    });
  }

  private async encode(pubkey: string, method: string, ...args: any): Promise<TxOpt> {
    const instance = new this.web3!.eth.Contract(this.abi, this.address);
    const data = await instance.methods[method](...args).encodeABI();
    const gasLimit = await instance.methods[method](...args).estimateGas({from: pubkey});
    return {data, gasLimit};
  }

  private async call(method: string, ...args: any) {
    const account = this.web3!.eth.accounts.privateKeyToAccount(this.privateKey);
    const pubkey = account.address
    const tx = await this.encode(pubkey, method, ...args);
    return await this.send(tx);
  }

  private async query(method: string, ...args: any) {
      const instance = new this.web3!.eth.Contract(this.abi, this.address);
      const result = await instance.methods[method](...args).call();
      return result;
  }

  public static from(address: string, abi: any): ETHContract { return new ETHContract(address, abi); }

  by(pk: string): ETHContract {
    this.privateKey = pk;
    return this;
  }

  at(url: string): ETHContract {
    this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    return this;
  }

  init(): ETHContract {
    for (const a of this.abi) {
      this[a.name!] = async (...args: any) => {
        if (a.stateMutability === 'view') {
          return await this.query(a.name!, ...args);
        } else {
          return await this.call(a.name!, ...args);
        }
      }
    }

    return this;
  }
}