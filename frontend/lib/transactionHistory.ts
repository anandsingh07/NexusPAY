import { Hex, createPublicClient, http, parseAbiItem } from "viem";
import { baseSepolia } from "viem/chains";

const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
const BUNDLER_URL = `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";

// EntryPoint v0.6 address
const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as Hex;

export interface UserOpReceipt {
    userOpHash: Hex;
    sender: Hex;
    nonce: string;
    actualGasCost: string;
    actualGasUsed: string;
    success: boolean;
    logs: any[];
    receipt: {
        transactionHash: Hex;
        blockNumber: string;
        blockHash: Hex;
        from: Hex;
        to: Hex | null;
        status: string;
    };
}

export interface TransactionHistory {
    hash: Hex;
    from: Hex;
    to: Hex;
    value: string;
    timestamp: number;
    status: "pending" | "success" | "failed";
    type: "sent" | "received";
    blockNumber?: string;
    transactionHash?: Hex;
    gasUsed?: string;
}

// Create public client for blockchain queries
const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
});

async function pimlicoRequest(method: string, params: any[]) {
    try {
        const response = await fetch(BUNDLER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method,
                params,
            }),
        });

        const data = await response.json();
        if (data.error) {
            console.error(`Pimlico API error (${method}):`, data.error);
            return null;
        }

        return data.result;
    } catch (error) {
        console.error(`Failed to call ${method}:`, error);
        return null;
    }
}

export async function getUserOpReceipt(userOpHash: Hex): Promise<UserOpReceipt | null> {
    return pimlicoRequest("eth_getUserOperationReceipt", [userOpHash]);
}

// LocalStorage for transaction cache
const STORAGE_KEY = "userOp_cache";

interface StoredUserOp {
    hash: Hex;
    from: Hex;
    to: Hex;
    value: string;
    timestamp: number;
}

export function saveUserOpToCache(hash: Hex, from: Hex, to: Hex, value: string) {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const cache: StoredUserOp[] = stored ? JSON.parse(stored) : [];

    const exists = cache.find(h => h.hash === hash);
    if (!exists) {
        cache.unshift({ hash, from, to, value, timestamp: Date.now() });
        const limited = cache.slice(0, 100); // Keep last 100
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    }
}

function getCachedUserOps(): StoredUserOp[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Main function: Use cache with blockchain enrichment
export async function getTransactionHistory(smartWalletAddress: Hex): Promise<TransactionHistory[]> {
    // Get cached transactions (has actual values!)
    const cached = getCachedUserOps();

    // Process cached transactions and fetch their status
    const historyPromises = cached.map(async (item): Promise<TransactionHistory> => {
        const receipt = await getUserOpReceipt(item.hash);

        const isSent = item.from.toLowerCase() === smartWalletAddress.toLowerCase();
        const type: "sent" | "received" = isSent ? "sent" : "received";

        if (receipt) {
            return {
                hash: item.hash,
                from: item.from,
                to: item.to,
                value: item.value,
                timestamp: item.timestamp,
                status: receipt.success ? "success" : "failed",
                type,
                blockNumber: receipt.receipt.blockNumber,
                transactionHash: receipt.receipt.transactionHash,
                gasUsed: receipt.actualGasUsed,
            };
        }

        // Still pending
        return {
            hash: item.hash,
            from: item.from,
            to: item.to,
            value: item.value,
            timestamp: item.timestamp,
            status: "pending",
            type,
        };
    });

    const results = await Promise.all(historyPromises);

    // Sort by timestamp (newest first)
    return results.sort((a, b) => b.timestamp - a.timestamp);
}

export function clearTransactionCache() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
