// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "openzeppelin-contracts/contracts/utils/Create2.sol";
import "./SmartWallet.sol";

contract SmartWalletFactory {
    address public immutable implementation;

    event AccountCreated(address indexed account, address indexed owner, uint256 salt);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createAccount(address owner, uint256 salt) external returns (address ret) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        
        if (codeSize > 0) {
            return addr;
        }

        bytes memory initData = abi.encodeWithSelector(SmartWallet.initialize.selector, owner);

        ret = address(new ERC1967Proxy{salt: bytes32(salt)}(implementation, initData));

        emit AccountCreated(ret, owner, salt);
    }

    function getAddress(address owner, uint256 salt) public view returns (address) {
        bytes memory initData = abi.encodeWithSelector(SmartWallet.initialize.selector, owner);
        
        bytes memory creationCode = abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(implementation, initData)
        );

        return Create2.computeAddress(bytes32(salt), keccak256(creationCode));
    }
}
