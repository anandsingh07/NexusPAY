export const SMART_WALLET_ABI = [
    {
        "inputs": [
            {
                "internalType": "contract IEntryPoint",
                "name": "_entryPoint",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "ECDSAInvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "ECDSAInvalidSignatureS",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "contract IEntryPoint",
                "name": "entryPoint",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "WalletInitialized",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "entryPoint",
        "outputs": [
            {
                "internalType": "contract IEntryPoint",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "func",
                "type": "bytes"
            }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "initCode",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "callData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint256",
                        "name": "callGasLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "verificationGasLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preVerificationGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPriorityFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "paymasterAndData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct UserOperation",
                "name": "userOp",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "userOpHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "missingAccountFunds",
                "type": "uint256"
            }
        ],
        "name": "validateUserOp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "validationData",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
] as const;

export const SMART_WALLET_FACTORY_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_implementation",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "salt",
                "type": "uint256"
            }
        ],
        "name": "AccountCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "salt",
                "type": "uint256"
            }
        ],
        "name": "createAccount",
        "outputs": [
            {
                "internalType": "address",
                "name": "ret",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "salt",
                "type": "uint256"
            }
        ],
        "name": "getAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "implementation",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
