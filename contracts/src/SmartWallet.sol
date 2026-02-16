// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "account-abstraction/interfaces/IAccount.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract SmartWallet is IAccount {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public owner;
    IEntryPoint public immutable entryPoint;
    uint256 private _initialized;

    uint256 internal constant SIG_VALIDATION_SUCCESS = 0;
    uint256 internal constant SIG_VALIDATION_FAILED = 1;

    event WalletInitialized(IEntryPoint indexed entryPoint, address indexed owner);
    event OwnerChanged(address indexed newOwner);

    modifier onlyEntryPoint() {
        require(msg.sender == address(entryPoint), "only EntryPoint");
        _;
    }

    modifier onlyOwnerOrEntryPoint() {
        require(
            msg.sender == address(entryPoint) || msg.sender == owner,
            "not owner or entry point"
        );
        _;
    }

    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;
        _initialized = 1;
    }

    function initialize(address _owner) external {
        require(_initialized == 0, "already initialized");
        _initialized = 1;
        owner = _owner;
        emit WalletInitialized(entryPoint, owner);
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external virtual override onlyEntryPoint returns (uint256 validationData) {
        validationData = _validateSignature(userOp, userOpHash);
        _payPrefund(missingAccountFunds);
    }

    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view returns (uint256 validationData) {
        bytes32 ethSignedMessageHash = userOpHash.toEthSignedMessageHash();
        (address recoveredSigner, ECDSA.RecoverError error, ) = ethSignedMessageHash.tryRecover(userOp.signature);

        if (error != ECDSA.RecoverError.NoError || recoveredSigner != owner) {
            return SIG_VALIDATION_FAILED;
        }
        return SIG_VALIDATION_SUCCESS;
    }

    function setOwner(address newOwner) external onlyEntryPoint {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
        emit OwnerChanged(newOwner);
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4) {
        (address recovered, ECDSA.RecoverError error, ) = ECDSA.tryRecover(hash, signature);
        if (error == ECDSA.RecoverError.NoError && recovered == owner) {
            return 0x1626ba7e; 
        }
        return 0xffffffff;
    }

    function _payPrefund(uint256 missingAccountFunds) internal {
        if (missingAccountFunds != 0) {
            (bool success, ) = payable(msg.sender).call{
                value: missingAccountFunds,
                gas: type(uint256).max
            }("");
            require(success, "Prefund payment failed");
        }
    }

    function execute(address dest, uint256 value, bytes calldata func)
        external
        onlyOwnerOrEntryPoint
    {
        _call(dest, value, func);
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    receive() external payable {}
}
