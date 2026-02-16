import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (!clientId) {
    throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID");
}

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14a34",
    rpcTarget: "https://sepolia.base.org",
    displayName: "Base Sepolia",
    blockExplorerUrl: "https://sepolia.basescan.org",
    ticker: "ETH",
    tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

export const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Use Devnet for free tier
    privateKeyProvider,
    uiConfig: {
        appName: "ERC-4337 Smart Wallet",
        mode: "dark",
        loginMethodsOrder: ["google"],
    },
});
