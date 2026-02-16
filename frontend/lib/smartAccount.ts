import { createPublicClient, http, Hex, encodeFunctionData, PublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { createSmartAccountClient, SmartAccountClient } from "permissionless";

import { SMART_WALLET_FACTORY_ABI, SMART_WALLET_ABI } from "./abi";

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Hex;
export const WALLET_IMPLEMENTATION = process.env.NEXT_PUBLIC_WALLET_IMPLEMENTATION as Hex;

if (!FACTORY_ADDRESS || !WALLET_IMPLEMENTATION) {
    throw new Error("Missing Smart Wallet Contract Addresses in .env.local");
}

const BUNDLER_URL = process.env.NEXT_PUBLIC_BUNDLER_URL;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

if (!BUNDLER_URL) throw new Error("Missing NEXT_PUBLIC_BUNDLER_URL");

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
if (!RPC_URL) throw new Error("Missing NEXT_PUBLIC_RPC_URL");

export const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
});

export async function getSmartWalletAddress(ownerAddress: Hex, salt: bigint = 0n): Promise<Hex> {
    const address = await publicClient.readContract({
        address: FACTORY_ADDRESS,
        abi: SMART_WALLET_FACTORY_ABI,
        functionName: "getAddress",
        args: [ownerAddress, salt]
    });
    return address;
}
