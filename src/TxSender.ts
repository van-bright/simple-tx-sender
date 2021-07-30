import Web3 from 'web3';
const EthereumTx = require('ethereumjs-tx');

type TxData = any;

export interface TxOpt {
  data?: number[], // for calling or querying operation
  gasLimit: number,

}

export interface DeployOpt {
  bytecode: string,
  arguments?: any[],
  gasLimit: number,
}

export class TxSender {
  web3: Web3;
  abi: any;
  address: string;
  privateKey: string;

  constructor(url: string, abi: any, address: string, privateKey: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    this.abi = abi;
    this.address = address;
    this.privateKey = privateKey;
  }

  private from() {
    return this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
  }

  private async gasPrice() {
    return Web3.utils.toHex(await this.web3.eth.getGasPrice());
  }

  private async nonce() {
    const account = this.from();
    const pubkey = account.address
    return Web3.utils.toHex(await this.web3.eth.getTransactionCount(pubkey));
  }

  private async send(tx: TxOpt): Promise<any> {
    return new Promise(async (resolve, reject) => {
      //  获取nonce,使用本地私钥发送交易
      // const chainId = await this.web3.eth.getChainId();
      const gasPrice = await this.gasPrice();
      const nonce = await this.nonce();
      const txParams: TxData = {
        nonce,
        gasPrice,
        gasLimit: Web3.utils.toHex(tx.gasLimit),
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
    });
  }

  private async encode(pubkey: string, method: string, ...args: any): Promise<TxOpt> {
    const instance = new this.web3.eth.Contract(this.abi, this.address);
    const data = await instance.methods[method](...args).encodeABI();
    const gasLimit = await instance.methods[method](...args).estimateGas({from: pubkey});
    return {data, gasLimit};
  }

  async deploy(txopt: DeployOpt) {
    return new Promise(async (resolver, rejector) => {
      const from = this.from();
      const frompub = from.address;
      console.log('frompub: ', frompub);
      const gasPrice = await this.gasPrice();
      let contract = new this.web3.eth.Contract(this.abi);
      contract.deploy({
        data: txopt.bytecode,
        // arguments: txopt?.arguments ?? []
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
      .on('transactionHash', (transactionHash) => { console.log('transactionHash: ',transactionHash); })
      .on('confirmation', (confirmationNumber, receipt) => { console.log('confirmation: ', confirmationNumber) })
      .then((newContractInstance) => {
          console.log('newInstance', newContractInstance.options.address) // instance with the new contract address
          resolver(newContractInstance.options.address);
      });
    });
  }

  async call(method: string, ...args: any) {
    const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    const pubkey = account.address
    const tx = await this.encode(pubkey, method, ...args);
    return await this.send(tx);
  }

  async query(method: string, ...args: any) {
      const instance = new this.web3.eth.Contract(this.abi, this.address);
      const result = await instance.methods[method](...args).call();
      return result;
  }
}