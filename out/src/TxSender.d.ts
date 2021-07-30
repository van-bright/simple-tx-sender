import Web3 from 'web3';
export interface TxOpt {
    data?: number[];
    gasLimit: number;
}
export interface DeployOpt {
    bytecode: string;
    arguments?: any[];
    gasLimit: number;
}
export declare class TxSender {
    web3: Web3;
    abi: any;
    address: string;
    privateKey: string;
    constructor(url: string, abi: any, address: string, privateKey: string);
    private from;
    private gasPrice;
    private nonce;
    private send;
    private encode;
    deploy(txopt: DeployOpt): Promise<unknown>;
    call(method: string, ...args: any): Promise<any>;
    query(method: string, ...args: any): Promise<any>;
}
