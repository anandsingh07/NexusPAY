"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { web3auth } from "@/lib/web3auth";
import { getSmartWalletAddress } from "@/lib/smartAccount";
import { IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { createWalletClient, custom, Hex } from "viem";
import { baseSepolia } from "viem/chains";
import { saveUserOpToCache } from "@/lib/transactionHistory";
import toast from "react-hot-toast";

interface WalletContextType {
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    isInitialized: boolean;
    smartWalletAddress: Hex | null;
    eoaAddress: Hex | null;
    balance: string | null;
    provider: IProvider | null;
    userInfo: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    performTransaction: (to: string, value: string) => Promise<any>;
    refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [smartWalletAddress, setSmartWalletAddress] = useState<Hex | null>(null);
    const [eoaAddress, setEoaAddress] = useState<Hex | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                if (web3auth.connected && web3auth.provider) {
                    setProvider(web3auth.provider);
                    setIsLoggedIn(true);
                    await fetchAccountDetails(web3auth.provider);
                }
            } catch (error) {
                console.error("Error initializing Web3Auth:", error);
            } finally {
                setIsInitialized(true);
            }
        };
        init();
    }, []);

    const fetchAccountDetails = async (authProvider: IProvider) => {
        try {
            const user = await web3auth.getUserInfo();
            setUserInfo(user);

            const client = createWalletClient({
                chain: baseSepolia,
                transport: custom(authProvider),
            });

            const [address] = await client.getAddresses();
            setEoaAddress(address);

            const swAddress = await getSmartWalletAddress(address, 0n);
            setSmartWalletAddress(swAddress);

            await fetchBalance(swAddress);

        } catch (error) {
            console.error("Error fetching account details:", error);
        }
    };

    const fetchBalance = async (address: Hex) => {
        try {
            const { publicClient } = await import("@/lib/smartAccount");
            const balanceBigInt = await publicClient.getBalance({ address });
            const { formatEther } = await import("viem");
            setBalance(formatEther(balanceBigInt));
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    const login = async () => {
        if (isLoggingIn) return;
        try {
            setIsLoggingIn(true);
            const web3authProvider = await web3auth.connect();
            if (web3authProvider) {
                setProvider(web3authProvider);
                setIsLoggedIn(true);
                await fetchAccountDetails(web3authProvider);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = async () => {
        try {
            await web3auth.logout();
            setProvider(null);
            setIsLoggedIn(false);
            setSmartWalletAddress(null);
            setEoaAddress(null);
            setUserInfo(null);
            setBalance(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const performTransaction = async (to: string, value: string) => {
        if (!provider || !smartWalletAddress) {
            console.error("Provider or Smart Wallet not ready");
            return;
        }

        const loadingToast = toast.loading("Sending transaction...");

        try {
            const client = createWalletClient({
                chain: baseSepolia,
                transport: custom(provider),
            });
            const { parseEther } = await import("viem");
            const { sendTransaction } = await import("@/lib/transaction");

            const hash = await sendTransaction(
                smartWalletAddress,
                to as Hex,
                parseEther(value),
                client
            );

            saveUserOpToCache(hash, smartWalletAddress, to as Hex, value);

            toast.success(
                `Transaction sent! UserOp Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
                { id: loadingToast, duration: 5000 }
            );

            setTimeout(() => {
                fetchBalance(smartWalletAddress);
            }, 5000);

            return hash;
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error(
                `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                { id: loadingToast, duration: 5000 }
            );
        }
    };

    return (
        <WalletContext.Provider
            value={{
                isLoggedIn,
                isLoggingIn,
                isInitialized,
                smartWalletAddress,
                eoaAddress,
                balance,
                provider,
                userInfo,
                login,
                logout,
                performTransaction,
                refreshBalance: async () => { if (smartWalletAddress) await fetchBalance(smartWalletAddress) }
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
