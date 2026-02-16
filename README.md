# 💳 NexusPAY - ERC-4337 Smart Wallet

A production-ready smart wallet built with **Account Abstraction (ERC-4337)**, featuring social login, gasless transactions, and a modern terminal-inspired UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)

---

## ✨ Features

- 🔐 **Social Login** - Login with Google, Twitter, or Discord (Web3Auth)
- ⛽ **Gasless Transactions** - Sponsored by Pimlico paymaster
- 🎯 **Account Abstraction** - ERC-4337 compliant smart wallet
- 💼 **Self-Custody** - You control your wallet, not us
- 📊 **Transaction History** - Real-time blockchain tracking
- 🌐 **Cross-Device** - Access from any device
- 🎨 **Modern UI** - Terminal green aesthetic

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Foundry (for smart contracts)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anandsingh07/NexusPAY.git
cd NexusPAY
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install contract dependencies**
```bash
cd contracts
forge install
```

### Configuration

1. **Frontend Environment Variables**

Copy the example file:
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Get from https://dashboard.web3auth.io/
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id

# Get from https://dashboard.pimlico.io/
NEXT_PUBLIC_PIMLICO_API_KEY=your_pimlico_api_key

NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${NEXT_PUBLIC_PIMLICO_API_KEY}
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${NEXT_PUBLIC_PIMLICO_API_KEY}
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Add after deploying contracts
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
NEXT_PUBLIC_WALLET_IMPLEMENTATION=0xYourImplementationAddress
```

2. **Smart Contract Environment Variables**

Create `contracts/.env`:
```env
PRIVATE_KEY=your_private_key_for_deployment
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key_optional
```

### Deploy Smart Contracts

```bash
cd contracts

# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployScript --rpc-url base-sepolia --broadcast --verify

# Copy the deployed addresses to frontend/.env.local
```

### Run the Application

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Getting API Keys

### Web3Auth
1. Visit [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Create a new project → "Plug and Play" → "Web"
3. Copy the Client ID
4. Add to `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`

### Pimlico
1. Visit [Pimlico Dashboard](https://dashboard.pimlico.io/)
2. Sign up and create an API key
3. Copy the API key
4. Add to `NEXT_PUBLIC_PIMLICO_API_KEY`

### Base Sepolia Testnet
- **RPC**: `https://sepolia.base.org`
- **Chain ID**: `84532`
- **Faucet**: [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

---

## 📁 Project Structure

```
NexusPAY/
├── contracts/                      # Smart contracts (Foundry)
│   ├── src/
│   │   ├── SmartWallet.sol        # ERC-4337 wallet implementation
│   │   └── SmartWalletFactory.sol # Wallet factory with CREATE2
│   ├── script/Deploy.s.sol        # Deployment script
│   └── test/                      # Contract tests
│
└── frontend/                      # Next.js frontend
    ├── app/
    │   ├── page.tsx              # Landing page
    │   └── dashboard/page.tsx    # Wallet dashboard
    ├── components/
    │   └── dashboard/Modals.tsx  # Send/Receive modals
    ├── context/WalletContext.tsx # Global wallet state
    ├── lib/
    │   ├── web3auth.ts           # Web3Auth configuration
    │   ├── smartAccount.ts       # Smart wallet utilities
    │   ├── transaction.ts        # UserOp creation
    │   └── transactionHistory.ts # Transaction tracking
    └── .env.example              # Environment template
```

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** 0.8.19
- **Foundry** - Development framework
- **OpenZeppelin** - Security libraries
- **ERC-4337** - Account Abstraction standard

### Frontend
- **Next.js** 14 - React framework
- **TypeScript** - Type safety
- **Viem** - Ethereum library
- **Web3Auth** - Social login
- **Tailwind CSS** - Styling
- **Pimlico** - Bundler & Paymaster

### Blockchain
- **Base Sepolia** - L2 testnet
- **EntryPoint v0.6** - ERC-4337 singleton

---

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
forge test
forge test -vvv  # Verbose output
```

### Frontend
```bash
cd frontend
npm run build  # Verify production build
```

---

## 🔒 Security

- ✅ Smart contracts follow ERC-4337 standard
- ✅ OpenZeppelin security libraries
- ✅ No private keys in code
- ✅ Environment variables for secrets
- ✅ Production-ready for testnet

**⚠️ For mainnet deployment:**
- Get professional security audit
- Implement multi-sig for factory ownership
- Add emergency pause mechanism
- Move API keys to backend proxy

---

## 📖 How It Works

1. **Login** - User authenticates with Google/Twitter/Discord via Web3Auth
2. **Wallet Creation** - Smart wallet address calculated deterministically
3. **Send Transaction** - UserOperation created and signed
4. **Gas Sponsorship** - Pimlico paymaster covers gas fees
5. **Execution** - Bundler submits to EntryPoint contract
6. **Confirmation** - Transaction confirmed on blockchain

---

## 🎯 Use Cases

- 💸 **Payments** - Send ETH without gas fees
- 🎮 **Gaming** - Gasless in-game transactions
- 🛒 **E-commerce** - Crypto payments without complexity
- 👥 **Social** - Easy onboarding for non-crypto users

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Troubleshooting

### "Cannot find module" errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "Transaction failed" errors
- Verify Pimlico API key is valid
- Check contract addresses in `.env.local`
- Ensure paymaster has funds

### "Web3Auth login fails"
- Verify Web3Auth Client ID
- Check redirect URLs in dashboard
- Clear browser cache and try again

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/anandsingh07/NexusPAY/issues)
- **Discussions**: [GitHub Discussions](https://github.com/anandsingh07/NexusPAY/discussions)

---

## 🌟 Acknowledgments

- [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) - Account Abstraction standard
- [Pimlico](https://pimlico.io/) - ERC-4337 infrastructure
- [Web3Auth](https://web3auth.io/) - Social login
- [Base](https://base.org/) - L2 blockchain
- [OpenZeppelin](https://openzeppelin.com/) - Security libraries

---

**Built with ❤️ for the future of Web3 UX**
