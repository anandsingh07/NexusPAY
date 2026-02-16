"use client";

import { useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const {
        isLoggedIn,
        login,
        isLoggingIn,
        isInitialized,
    } = useWallet();

    const router = useRouter();

    useEffect(() => {
        if (isInitialized && isLoggedIn) {
            router.push("/dashboard");
        }
    }, [isLoggedIn, isInitialized, router]);

    if (!isInitialized || isLoggingIn) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
                <div className="animate-pulse text-2xl font-bold text-[#22c55e]">
                    {!isInitialized ? "Loading..." : "Connecting..."}
                </div>
            </main>
        );
    }

    if (isLoggedIn) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <div className="max-w-4xl mx-auto px-8 text-center">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#22c55e] to-[#10b981] bg-clip-text text-transparent">
                        Smart Wallet
                    </h1>
                    <p className="text-xl text-[#a3a3a3] mb-2">
                        ERC-4337 Account Abstraction
                    </p>
                    <p className="text-sm text-[#a3a3a3]">
                        Gasless transactions • Social login • Non-custodial
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                        <div className="text-[#22c55e] text-3xl mb-3">⚡</div>
                        <h3 className="text-lg font-semibold mb-2">Gasless</h3>
                        <p className="text-sm text-[#a3a3a3]">
                            Sponsored transactions via Pimlico paymaster
                        </p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                        <div className="text-[#22c55e] text-3xl mb-3">🔐</div>
                        <h3 className="text-lg font-semibold mb-2">Secure</h3>
                        <p className="text-sm text-[#a3a3a3]">
                            Non-custodial with Web3Auth social login
                        </p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                        <div className="text-[#22c55e] text-3xl mb-3">🚀</div>
                        <h3 className="text-lg font-semibold mb-2">Modern</h3>
                        <p className="text-sm text-[#a3a3a3]">
                            Built on ERC-4337 standard with smart contracts
                        </p>
                    </div>
                </div>

                <button
                    onClick={login}
                    disabled={isLoggingIn}
                    className="px-8 py-4 bg-[#22c55e] text-black rounded-xl font-bold text-lg hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoggingIn ? "Connecting..." : "Login with Google"}
                </button>

                <div className="mt-12 pt-8 border-t border-[#22c55e33]">
                    <p className="text-xs text-[#a3a3a3]">
                        Powered by Web3Auth • Pimlico • Base Sepolia
                    </p>
                </div>
            </div>
        </main>
    );
}
