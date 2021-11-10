import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
export interface TxOpt {
    data?: number[];
    gasLimit: number;
}
export declare class ETHContract {
    [fn: string]: any;
    web3: Web3 | null;
    abi: AbiItem[];
    address: string;
    privateKey: string;
    private constructor();
    private private2Account;
    private gasPrice;
    private nonce;
    private send;
    private encode;
    private call;
    private query;
    static from(address: string, abi: any): ETHContract;
    by(pk: string): ETHContract;
    at(url: string): ETHContract;
    init(): ETHContract;
}
