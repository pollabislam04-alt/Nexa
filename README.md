# Nexa Space - Web3 MLM Dapp

A decentralized Multi-Level Marketing (MLM) platform built on BNB Chain with smart contracts, wallet integration, and real-time dashboard.

## Features

- ✅ Wallet Connect (MetaMask)
- ✅ User Registration & Login (0.01 USDT = 0.00002 BNB)
- ✅ Nexa Matrix Slot System (8 Slots: $6 - $640 USDT)
- ✅ MLM Structure with Direct Partners & Team
- ✅ Real-time Income Tracking
- ✅ Leaderboard
- ✅ Nexa Salary Program
- ✅ User Profile Management
- ✅ Referral System

## Tech Stack

- **Smart Contracts**: Solidity (BNB Chain)
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js + React + TailwindCSS
- **Wallet**: MetaMask
- **Blockchain**: BNB Smart Chain (BSC)

## Installation

### Prerequisites
- Node.js v16+
- MetaMask Wallet
- MongoDB
- Hardhat

### Setup

1. Clone the repository
```bash
git clone https://github.com/pollabislam04-alt/nexa.git
cd nexa
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

4. Deploy smart contracts
```bash
cd contracts
npx hardhat run scripts/deploy.js --network bsc-testnet
```

5. Start backend server
```bash
cd backend
npm run dev
```

6. Start frontend
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

## Wallet Addresses

- **Registration Fee Wallet**: `0xb7F926070eAa24C4ff29C3c14D403A2f3e13ED2F`
- **Slot Payment Wallet**: `0x050b82f6Dae0947FF15B372E7AD95454162cA001`

## Contract Configuration

### Registration Fee
- Amount: 0.01 USDT (0.00002 BNB)

### Slot Prices (USDT)
1. Slot 1: $6
2. Slot 2: $10
3. Slot 3: $20
4. Slot 4: $40
5. Slot 5: $80
6. Slot 6: $160
7. Slot 7: $320
8. Slot 8: $640

### Nexa Salary Program
- 200 Team, 20 Direct Partners = 15% Salary
- 500 Team, 40 Direct Partners = 20% Salary
- 1000 Team, 70 Direct Partners = 30% Salary
- 2000 Team, 150 Direct Partners = 35% Salary

## License

MIT
