import { createPublicClient, http, Hex, encodeFunctionData, createClient, WalletClient, Address, concat, keccak256, toHex, pad, encodeAbiParameters, parseAbiParameters } from "viem";
import { baseSepolia } from "viem/chains";
import { SMART_WALLET_ABI } from "./abi";

const ENTRYPOINT_ADDRESS_V06 = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const BUNDLER_URL = process.env.NEXT_PUBLIC_BUNDLER_URL;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

if (!BUNDLER_URL) throw new Error("Missing NEXT_PUBLIC_BUNDLER_URL");
if (!PAYMASTER_URL) throw new Error("Missing NEXT_PUBLIC_PAYMASTER_URL");
if (!RPC_URL) throw new Error("Missing NEXT_PUBLIC_RPC_URL");

const ENTRYPOINT_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            { "internalType": "uint192", "name": "key", "type": "uint192" }
        ],
        "name": "getNonce",
        "outputs": [{ "internalType": "uint256", "name": "nonce", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export async function sendTransaction(
    smartWalletAddress: Address,
    to: Address,
    value: bigint,
    signer: WalletClient
) {
    // Transaction flow started

    const addresses = await signer.getAddresses();
    if (addresses.length === 0) throw new Error("No signer address found");

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL!)
    });

    const bundlerRequest = async (method: string, params: any[], retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(BUNDLER_URL!, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                return data.result;
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    };

    // Fetching nonce
    const nonce = await publicClient.readContract({
        address: ENTRYPOINT_ADDRESS_V06,
        abi: ENTRYPOINT_ABI,
        functionName: "getNonce",
        args: [smartWalletAddress, 0n]
    });
    // Nonce retrieved

    const callData = encodeFunctionData({
        abi: SMART_WALLET_ABI,
        functionName: "execute",
        args: [to, value, "0x"]
    });

    let initCode: Hex = "0x";

    const code = await publicClient.getBytecode({ address: smartWalletAddress });
    if (!code) {
        // Generating initCode for wallet deployment
        const { FACTORY_ADDRESS } = await import("./smartAccount");
        const { SMART_WALLET_FACTORY_ABI } = await import("./abi");

        const factoryData = encodeFunctionData({
            abi: SMART_WALLET_FACTORY_ABI,
            functionName: "createAccount",
            args: [addresses[0], 0n]
        });

        initCode = concat([FACTORY_ADDRESS, factoryData]);
    } else {
        // Wallet already deployed
    }

    let userOp: any = {
        sender: smartWalletAddress,
        nonce: toHex(nonce),
        initCode: initCode,
        callData: callData,
        callGasLimit: "0x0",
        verificationGasLimit: "0x0",
        preVerificationGas: "0x0",
        maxFeePerGas: "0x0",
        maxPriorityFeePerGas: "0x0",
        paymasterAndData: "0x",
        signature: "0x"
    };

    try {
        console.log("Fetching Pimlico Gas Prices...");
        const gasPrices = await bundlerRequest("pimlico_getUserOperationGasPrice", []);
        console.log("Pimlico Gas Prices:", gasPrices);

        if (gasPrices.standard) {
            userOp.maxFeePerGas = gasPrices.standard.maxFeePerGas;
            userOp.maxPriorityFeePerGas = gasPrices.standard.maxPriorityFeePerGas;
        } else {
            const gasPrice = await publicClient.getGasPrice();
            userOp.maxFeePerGas = toHex(gasPrice * 120n / 100n);
            userOp.maxPriorityFeePerGas = toHex(gasPrice * 120n / 100n);
        }
    } catch (error) {
        console.warn("Failed to fetch Pimlico gas prices, using fallback:", error);
        const gasPrice = await publicClient.getGasPrice();
        userOp.maxFeePerGas = toHex(gasPrice * 150n / 100n);
        userOp.maxPriorityFeePerGas = toHex(gasPrice * 150n / 100n);
    }

    // Requesting paymaster sponsorship
    try {
        const pmResponse = await fetch(PAYMASTER_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "pm_sponsorUserOperation",
                params: [userOp, ENTRYPOINT_ADDRESS_V06]
            }),
        });
        const pmData = await pmResponse.json();

        if (pmData.error) {
            throw new Error(`Paymaster Error: ${pmData.error.message}`);
        }

        if (pmData.result) {
            // Paymaster sponsorship approved
            userOp.paymasterAndData = pmData.result.paymasterAndData;
            userOp.callGasLimit = pmData.result.callGasLimit;
            userOp.verificationGasLimit = pmData.result.verificationGasLimit;
            userOp.preVerificationGas = pmData.result.preVerificationGas;

            if (pmData.result.maxFeePerGas) userOp.maxFeePerGas = pmData.result.maxFeePerGas;
            if (pmData.result.maxPriorityFeePerGas) userOp.maxPriorityFeePerGas = pmData.result.maxPriorityFeePerGas;
        }
    } catch (e) {
        console.error("Paymaster sponsorship failed:", e);
        throw e;
    }

    const chainId = await publicClient.getChainId();

    const packedUserOp = encodeAbiParameters(
        parseAbiParameters('address, uint256, bytes32, bytes32, uint256, uint256, uint256, uint256, uint256, bytes32'),
        [
            userOp.sender,
            BigInt(userOp.nonce),
            keccak256(userOp.initCode),
            keccak256(userOp.callData),
            BigInt(userOp.callGasLimit),
            BigInt(userOp.verificationGasLimit),
            BigInt(userOp.preVerificationGas),
            BigInt(userOp.maxFeePerGas),
            BigInt(userOp.maxPriorityFeePerGas),
            keccak256(userOp.paymasterAndData)
        ]
    );

    const userOpHashRaw = keccak256(packedUserOp);

    const userOpHash = keccak256(encodeAbiParameters(
        parseAbiParameters('bytes32, address, uint256'),
        [userOpHashRaw, ENTRYPOINT_ADDRESS_V06, BigInt(chainId)]
    ));

    // UserOp hash generated

    const signature = await signer.signMessage({
        account: addresses[0],
        message: { raw: userOpHash }
    });

    userOp.signature = signature;

    // Submitting UserOp to bundler
    const userOpHashRes = await bundlerRequest("eth_sendUserOperation", [userOp, ENTRYPOINT_ADDRESS_V06]);

    return userOpHashRes;
}
