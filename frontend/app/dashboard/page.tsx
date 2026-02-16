"use client";

import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SendModal, ReceiveModal } from "@/components/dashboard/Modals";
import { getTransactionHistory, TransactionHistory } from "@/lib/transactionHistory";

export default function DashboardPage() {
    const { isLoggedIn, isInitialized, smartWalletAddress, eoaAddress, balance, userInfo, logout } = useWallet();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [showSendModal, setShowSendModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
    const [isLoadingTx, setIsLoadingTx] = useState(false);

    const refreshTransactions = async () => {
        if (!smartWalletAddress) return;

        setIsLoadingTx(true);
        try {
            const history = await getTransactionHistory(smartWalletAddress);
            setTransactions(history);
        } catch (error) {
            console.error("Failed to fetch transaction history:", error);
        } finally {
            setIsLoadingTx(false);
        }
    };

    useEffect(() => {
        if (smartWalletAddress) {
            refreshTransactions();
            const interval = setInterval(refreshTransactions, 5000);
            return () => clearInterval(interval);
        }
    }, [smartWalletAddress]);

    useEffect(() => {
        if (isInitialized && !isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, isInitialized, router]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-[#22c55e] text-xl">Loading...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    const balanceUSD = balance ? (parseFloat(balance) * 2500).toFixed(2) : "0.00";
    const userInitial = userInfo?.name?.charAt(0).toUpperCase() || "U";

    return (
        <>
            <div className="min-h-screen bg-black">
                <div className="flex h-screen">
                    <aside className="w-64 bg-[#0a0a0a] border-r border-[#22c55e33] flex flex-col">
                        <div className="p-6 border-b border-[#22c55e33]">
                            <h1 className="text-2xl font-bold text-[#22c55e]">Smart Wallet</h1>
                            <p className="text-xs text-[#a3a3a3] mt-1">ERC-4337 AA</p>
                        </div>

                        <nav className="flex-1 p-4">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full mb-2 transition-colors ${activeTab === "overview"
                                    ? "bg-[#1a1a1a] text-white"
                                    : "text-[#a3a3a3] hover:bg-[#262626] hover:text-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("activity")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full mb-2 transition-colors ${activeTab === "activity"
                                    ? "bg-[#1a1a1a] text-white"
                                    : "text-[#a3a3a3] hover:bg-[#262626] hover:text-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Activity</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("assets")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full mb-2 transition-colors ${activeTab === "assets"
                                    ? "bg-[#1a1a1a] text-white"
                                    : "text-[#a3a3a3] hover:bg-[#262626] hover:text-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Assets</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${activeTab === "settings"
                                    ? "bg-[#1a1a1a] text-white"
                                    : "text-[#a3a3a3] hover:bg-[#262626] hover:text-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Settings</span>
                            </button>
                        </nav>

                        <div className="p-4 border-t border-[#22c55e33]">
                            <div className="flex items-center gap-3 px-4 py-3">
                                {userInfo?.profileImage ? (
                                    <img src={userInfo.profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-black font-bold">
                                        {userInitial}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{userInfo?.name || "User"}</p>
                                    <p className="text-[#a3a3a3] text-xs truncate">{userInfo?.email || "Connected"}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full mt-2 px-4 py-2 bg-[#1a1a1a] text-[#ef4444] rounded-lg text-sm hover:bg-[#262626] transition-colors border border-[#ef444433]"
                            >
                                Logout
                            </button>
                        </div>
                    </aside>

                    <main className="flex-1 overflow-auto">
                        <header className="bg-[#0a0a0a] border-b border-[#22c55e33] px-8 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {activeTab === "overview" && "Dashboard"}
                                    {activeTab === "activity" && "Activity"}
                                    {activeTab === "assets" && "Assets"}
                                    {activeTab === "settings" && "Settings"}
                                </h2>
                                {smartWalletAddress && (
                                    <p className="text-xs text-[#a3a3a3] font-mono mt-1">
                                        {smartWalletAddress.slice(0, 6)}...{smartWalletAddress.slice(-4)}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowSendModal(true)}
                                    className="px-4 py-2 bg-[#22c55e] text-black rounded-lg font-medium hover:bg-[#16a34a] transition-colors"
                                >
                                    Send
                                </button>
                                <button
                                    onClick={() => setShowReceiveModal(true)}
                                    className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg font-medium hover:bg-[#262626] transition-colors border border-[#22c55e33]"
                                >
                                    Receive
                                </button>
                            </div>
                        </header>

                        <div className="p-8">
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                            <h3 className="text-[#a3a3a3] text-sm mb-2">Total Balance</h3>
                                            <p className="text-4xl font-bold text-white mb-1">{balance || "0.0000"} ETH</p>
                                            <p className="text-[#a3a3a3] text-sm">${balanceUSD}</p>
                                        </div>

                                        <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                            <h3 className="text-[#a3a3a3] text-sm mb-2">Network</h3>
                                            <p className="text-2xl font-bold text-[#22c55e] mb-1">Base Sepolia</p>
                                            <p className="text-[#a3a3a3] text-sm">Testnet</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-4">Your Wallet</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-[#a3a3a3] mb-2">Smart Wallet Address (Click to copy)</p>
                                                <button
                                                    onClick={() => {
                                                        if (smartWalletAddress) {
                                                            navigator.clipboard.writeText(smartWalletAddress);
                                                            const btn = document.getElementById('copy-wallet-btn');
                                                            if (btn) {
                                                                btn.textContent = 'Copied! ✓';
                                                                setTimeout(() => {
                                                                    btn.textContent = smartWalletAddress || 'Loading...';
                                                                }, 2000);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full p-3 bg-[#0a0a0a] border border-[#22c55e33] rounded-lg hover:border-[#22c55e] transition-colors text-left group"
                                                >
                                                    <p id="copy-wallet-btn" className="font-mono text-sm text-[#22c55e] break-all group-hover:text-[#16a34a] transition-colors">
                                                        {smartWalletAddress || "Loading..."}
                                                    </p>
                                                </button>
                                                <p className="text-xs text-[#a3a3a3] mt-2 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Use this address to receive funds
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                                        {transactions.length === 0 ? (
                                            <div className="text-center py-12">
                                                <svg className="w-16 h-16 mx-auto mb-4 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-[#a3a3a3]">No transactions yet</p>
                                                <p className="text-[#a3a3a3] text-sm mt-2">Your transaction history will appear here</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {transactions.slice(0, 5).map((tx) => (
                                                    <div key={tx.hash} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#262626] transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            {tx.type === "sent" ? (
                                                                <div className="w-10 h-10 rounded-full bg-[#ef444420] flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-[#22c55e20] flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-white font-medium capitalize">{tx.type}</p>
                                                                <p className="text-xs text-[#a3a3a3]">
                                                                    {tx.type === "sent"
                                                                        ? `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                                                                        : `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-medium ${tx.type === "sent" ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
                                                                {tx.type === "sent" ? "-" : "+"}{tx.value} ETH
                                                            </p>
                                                            <div className="flex items-center gap-1 justify-end mt-1">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${tx.status === "success" ? "bg-[#22c55e]" :
                                                                    tx.status === "pending" ? "bg-[#fbbf24] animate-pulse" :
                                                                        "bg-[#ef4444]"
                                                                    }`} />
                                                                <span className="text-xs text-[#a3a3a3] capitalize">{tx.status}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {transactions.length > 5 && (
                                                    <button
                                                        onClick={() => setActiveTab("activity")}
                                                        className="w-full py-2 text-sm text-[#22c55e] hover:text-[#16a34a] transition-colors"
                                                    >
                                                        View all {transactions.length} transactions →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === "activity" && (
                                <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">Transaction History</h3>
                                        {isLoadingTx && (
                                            <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
                                                <div className="w-3 h-3 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                                                Syncing...
                                            </div>
                                        )}
                                    </div>
                                    {transactions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-[#a3a3a3]">No transactions yet</p>
                                            <p className="text-[#a3a3a3] text-sm mt-2">Your transaction history will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {transactions.map((tx) => (
                                                <div key={tx.hash} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#22c55e22] hover:border-[#22c55e44] transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${tx.status === "success" ? "bg-[#22c55e]" :
                                                                tx.status === "pending" ? "bg-[#fbbf24] animate-pulse" :
                                                                    "bg-[#ef4444]"
                                                                }`} />
                                                            <div className="flex items-center gap-2">
                                                                {tx.type === "sent" ? (
                                                                    <svg className="w-4 h-4 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                                    </svg>
                                                                )}
                                                                <span className="text-white font-medium capitalize">
                                                                    {tx.type}
                                                                </span>
                                                            </div>
                                                            <span className={`text-xs px-2 py-0.5 rounded ${tx.status === "success" ? "bg-[#22c55e22] text-[#22c55e]" :
                                                                tx.status === "pending" ? "bg-[#fbbf2422] text-[#fbbf24]" :
                                                                    "bg-[#ef444422] text-[#ef4444]"
                                                                }`}>
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                        <span className="text-[#a3a3a3] text-xs">
                                                            {new Date(tx.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#a3a3a3]">{tx.type === "sent" ? "To:" : "From:"}</span>
                                                            <span className="text-white font-mono text-xs">
                                                                {tx.type === "sent"
                                                                    ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                                                                    : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#a3a3a3]">Amount:</span>
                                                            <span className={`font-medium ${tx.type === "sent" ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
                                                                {tx.type === "sent" ? "-" : "+"}{tx.value} ETH
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#a3a3a3]">UserOp Hash:</span>
                                                            <span className="text-white font-mono text-xs">
                                                                {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                                            </span>
                                                        </div>
                                                        {tx.transactionHash && (
                                                            <div className="flex justify-between">
                                                                <span className="text-[#a3a3a3]">Tx Hash:</span>
                                                                <a
                                                                    href={`https://sepolia.basescan.org/tx/${tx.transactionHash}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#22c55e] hover:text-[#16a34a] font-mono text-xs underline flex items-center gap-1"
                                                                >
                                                                    {tx.transactionHash.slice(0, 8)}...{tx.transactionHash.slice(-6)}
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </a>
                                                            </div>
                                                        )}
                                                        {tx.blockNumber && (
                                                            <div className="flex justify-between">
                                                                <span className="text-[#a3a3a3]">Block:</span>
                                                                <span className="text-white text-xs">
                                                                    #{parseInt(tx.blockNumber, 16).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {tx.gasUsed && (
                                                            <div className="flex justify-between">
                                                                <span className="text-[#a3a3a3]">Gas Used:</span>
                                                                <span className="text-white text-xs">
                                                                    {parseInt(tx.gasUsed, 16).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "assets" && (
                                <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Your Assets</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-black font-bold">
                                                    Ξ
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">Ethereum</p>
                                                    <p className="text-xs text-[#a3a3a3]">ETH</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">{balance || "0.0000"} ETH</p>
                                                <p className="text-xs text-[#a3a3a3]">${balanceUSD}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "settings" && (
                                <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[#0a0a0a] rounded-lg">
                                            <p className="text-white font-medium mb-1">Network</p>
                                            <p className="text-sm text-[#a3a3a3]">Base Sepolia Testnet</p>
                                        </div>
                                        <div className="p-4 bg-[#0a0a0a] rounded-lg">
                                            <p className="text-white font-medium mb-1">Version</p>
                                            <p className="text-sm text-[#a3a3a3]">v1.0.0</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <SendModal
                isOpen={showSendModal}
                onClose={() => {
                    setShowSendModal(false);
                    refreshTransactions();
                }}
                balance={balance}
            />
            <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} address={smartWalletAddress} />
        </>
    );
}
