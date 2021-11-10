import {ETHContract} from "../src";

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

async function main() {
  let greeter = ETHContract.from(ContractAddresss, ContractAbi).by(privateKey).at(hhNodeUrl).init();

  let receipt = await greeter.setGreeting("hello simple tx contract");
  console.log("setNan.txHash: ", receipt.transactionHash);

  receipt = await greeter.setPerson(["Newton", 1200]);
  console.log("setPerson.txHash: ", receipt.transactionHash);

  receipt = await greeter.setPersons([["Newton", 1200], ["Tesla", 200], ["Maxswell", 400]]);
  console.log("setPersons.txHash: ", receipt.transactionHash);

  receipt = await greeter.greet();
  console.log("getNan: ", receipt);

  receipt = await greeter.getPerson();
  console.log("getPerson: ", receipt);

  receipt = await greeter.getPersons();
  console.log("getPersons: ", receipt);
}

main().then(() => { }).catch(e => console.log(e));