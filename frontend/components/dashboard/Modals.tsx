"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Hex } from "viem";

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: string | null;
}

export function SendModal({ isOpen, onClose, balance }: SendModalProps) {
    const { performTransaction } = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !amount) return;

        const amountNum = parseFloat(amount);
        const balanceNum = parseFloat(balance || "0");

        if (amountNum > balanceNum) {
            setError(`Insufficient balance. You have ${balance} ETH`);
            return;
        }

        if (amountNum <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        setError("");
        setIsSending(true);
        try {
            await performTransaction(recipient, amount);
            setRecipient("");
            setAmount("");
            onClose();
        } catch (error) {
            console.error("Send failed:", error);
            setError(error instanceof Error ? error.message : "Transaction failed");
        } finally {
            setIsSending(false);
        }
    };

    const handleClose = () => {
        setRecipient("");
        setAmount("");
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Send ETH</h3>
                        <p className="text-xs text-[#a3a3a3] mt-1">Available: {balance || "0.0000"} ETH</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[#a3a3a3] hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[#ef444420] border border-[#ef4444] rounded-lg">
                        <p className="text-sm text-[#ef4444]">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSend} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Recipient Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#22c55e33] rounded-lg text-white focus:outline-none focus:border-[#22c55e] transition-colors font-mono text-sm"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm text-[#a3a3a3]">Amount (ETH)</label>
                            <button
                                type="button"
                                onClick={() => setAmount(balance || "0")}
                                className="text-xs text-[#22c55e] hover:text-[#16a34a] transition-colors"
                            >
                                Max
                            </button>
                        </div>
                        <input
                            type="number"
                            step="0.0001"
                            placeholder="0.01"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#22c55e33] rounded-lg text-white focus:outline-none focus:border-[#22c55e] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-[#0a0a0a] text-white rounded-lg font-medium hover:bg-[#262626] transition-colors border border-[#22c55e33]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSending}
                            className="flex-1 px-4 py-3 bg-[#22c55e] text-black rounded-lg font-medium hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface ReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: Hex | null;
}

export function ReceiveModal({ isOpen, onClose, address }: ReceiveModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-[#22c55e33] rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Receive ETH</h3>
                    <button
                        onClick={onClose}
                        className="text-[#a3a3a3] hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="text-center">
                    <div className="bg-white p-4 rounded-xl inline-block mb-4">
                        <div className="w-48 h-48 flex items-center justify-center">
                            <p className="text-xs text-black break-all p-2">
                                QR Code for:<br />{address?.slice(0, 10)}...{address?.slice(-8)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-[#a3a3a3] mb-2">Your Wallet Address</p>
                        <div className="bg-[#0a0a0a] border border-[#22c55e33] rounded-lg p-3">
                            <p className="font-mono text-sm text-[#22c55e] break-all">
                                {address || "Loading..."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="w-full px-4 py-3 bg-[#22c55e] text-black rounded-lg font-medium hover:bg-[#16a34a] transition-colors"
                    >
                        {copied ? "Copied!" : "Copy Address"}
                    </button>
                </div>
            </div>
        </div>
    );
}
