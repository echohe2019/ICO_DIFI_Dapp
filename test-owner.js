const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_sepolia/314b29ddca6a6957bcce020d2a1d831b9707e4d3913f20018de8aab87b0c997c');

const abi = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new ethers.Contract('0x2fae32C1397134c6B7c6a779E2E8C149e3735690', abi, provider);

contract.owner()
  .then(owner => console.log('Owner:', owner))
  .catch(error => console.error('Error:', error));
