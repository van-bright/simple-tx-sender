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
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const ContractAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getPerson",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "age",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Greeter.Person",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPersons",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "age",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Greeter.Person[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "greet",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_greeting",
                "type": "string"
            }
        ],
        "name": "setGreeting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "age",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Greeter.Person",
                "name": "p",
                "type": "tuple"
            }
        ],
        "name": "setPerson",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "age",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Greeter.Person[]",
                "name": "ps",
                "type": "tuple[]"
            }
        ],
        "name": "setPersons",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const ContractAddresss = '0x038a790aDae18Babf0dE5dB00F79b4eF5Dc2A435';
const privateKey = '0x5e001071c1bcd43e97d45d9629245d1a1dfc19dc0108c8b902f81a8a8fc25b7d';
const hhNodeUrl = 'https://http-testnet.hecochain.com';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let greeter = src_1.ETHContract.from(ContractAddresss, ContractAbi).by(privateKey).at(hhNodeUrl).init();
        let receipt = yield greeter.setGreeting("hello simple tx contract");
        console.log("setNan.txHash: ", receipt.transactionHash);
        receipt = yield greeter.setPerson(["Newton", 1200]);
        console.log("setPerson.txHash: ", receipt.transactionHash);
        receipt = yield greeter.setPersons([["Newton", 1200], ["Tesla", 200], ["Maxswell", 400]]);
        console.log("setPersons.txHash: ", receipt.transactionHash);
        receipt = yield greeter.greet();
        console.log("getNan: ", receipt);
        receipt = yield greeter.getPerson();
        console.log("getPerson: ", receipt);
        receipt = yield greeter.getPersons();
        console.log("getPersons: ", receipt);
    });
}
main().then(() => { }).catch(e => console.log(e));
//# sourceMappingURL=test.js.map