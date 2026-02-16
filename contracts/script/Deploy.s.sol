// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SmartWallet.sol";
import "../src/SmartWalletFactory.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        address entryPointAddress = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;

        vm.startBroadcast(deployerPrivateKey);

        SmartWallet implementation = new SmartWallet(IEntryPoint(entryPointAddress));
        console.log("SmartWallet Implementation deployed at:", address(implementation));

        SmartWalletFactory factory = new SmartWalletFactory(address(implementation));
        console.log("SmartWalletFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
