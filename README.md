# Nexa Space - Web3 MLM Dapp

## 🌟 Overview

Nexa Space is a decentralized Multi-Level Marketing (MLM) platform built on BNB Chain with smart contracts, wallet integration, and real-time dashboards.

**Status**: 🚀 Production Ready

## ✨ Core Features

### 🔐 Wallet Integration
- MetaMask connection
- Gas-efficient transactions
- Secure wallet authentication

### 👥 User Management
- Smart registration system (0.01 USDT fee)
- Referral tracking
- User profiles & statistics

### 💰 Nexa Matrix (8 Slots)
| Slot | Price | Status |
|------|-------|--------|
| 1 | $6 | Open |
| 2 | $10 | Open |
| 3 | $20 | Open |
| 4 | $40 | Open |
| 5 | $80 | Open |
| 6 | $160 | Open |
| 7 | $320 | Open |
| 8 | $640 | Open |

### 🎯 Commission Structure
```
Level 1 (Direct):   50%
Level 2:            10%
Level 3:            10%
Level 4:            10%
Level 5:             5%
Level 6:             5%
Level 7 (MPS):       5% → Slot Balance
Level 8 (Royalty):   5% → Slot Balance
```

### 💼 Nexa Salary Program
```
Level 1: 200 Team, 20 Direct = 15% Salary
Level 2: 500 Team, 40 Direct = 20% Salary
Level 3: 1000 Team, 70 Direct = 30% Salary
Level 4: 2000 Team, 150 Direct = 35% Salary
```

### 📊 Advanced Features
- Real-time income tracking
- Team hierarchy visualization
- Leaderboard rankings
- Performance analytics
- Multi-level commission distribution

## 🛠 Tech Stack

### Smart Contracts
- **Language**: Solidity ^0.8.0
- **Framework**: Hardhat
- **Standards**: ERC20 (USDT)
- **Network**: BNB Smart Chain (BSC)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Blockchain**: Web3.js, Ethers.js

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Web3**: Web3.js
- **Icons**: React Icons
- **Charts**: Recharts

## 📦 Project Structure

```
nexa/
├── contracts/           # Smart Contracts (Solidity)
│   ├── NexaRegistration.sol
│   ├── NexaMatrix.sol
│   └── hardhat.config.js
├── backend/            # API Server
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── server.js
│   └── package.json
├── frontend/           # React App
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS
│   └── package.json
├── SETUP.md           # Setup instructions
├── README.md          # This file
└── package.json       # Root package.json
```

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js v16+
- MongoDB
- MetaMask
- BNB in wallet (for gas fees)
```

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/pollabislam04-alt/nexa.git
   cd nexa
   ```

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit with your settings
   ```

4. **Deploy Smart Contracts**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network bsc-testnet
   ```

5. **Start Services**
   ```bash
   npm run dev
   # Starts both backend (5000) and frontend (3000)
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📡 API Documentation

See [SETUP.md](./SETUP.md) for complete API documentation.

### Main Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with wallet

**Matrix**
- `GET /api/matrix/data/:wallet` - Get matrix data
- `POST /api/matrix/activate-slot` - Activate slot

**Team**
- `GET /api/team/:wallet` - Get team info
- `GET /api/team/tree/:wallet` - Get team hierarchy

**Salary**
- `GET /api/salary/:wallet` - Get salary info

## 🔐 Security

- ✅ Smart contract audited
- ✅ Reentrancy protection
- ✅ Input validation
- ✅ JWT authentication
- ✅ CORS enabled
- ✅ Private key management via .env

## 📊 Smart Contract Details

### NexaRegistration
- Manages user registrations
- Handles referral system
- Collects registration fees
- User ID mapping

### NexaMatrix
- 8-slot system
- Commission distribution
- Multi-level tracking
- Slot balance management

## 🌐 Blockchain Network

**BNB Smart Chain (BSC)**
- Testnet: Chain ID 97
- Mainnet: Chain ID 56
- Gas-efficient transactions
- USDT token support

## 💡 How It Works

1. **Registration**: Users register with MetaMask (0.01 USDT fee)
2. **Referral**: Each user gets a referral code
3. **Slots**: Activate 8 slots ($6 - $640) sequentially
4. **Commissions**: Earn from referrals on each slot
5. **Salary**: Unlock salary levels based on team size
6. **Dashboard**: Track all earnings in real-time

## 📈 Earning Potential

```
Example: $6 Slot Purchase
- Direct (50%): $3
- Level 2-4 (10% each): $1.80
- Level 5-6 (5% each): $0.60
- MPS/Royalty (5% each): $0.60 → Slot Balance
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 👤 Author

Developed by Nexa Team

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/pollabislam04-alt/nexa/issues)
- Documentation: [SETUP.md](./SETUP.md)
- API Docs: See backend routes

---

**Made with ❤️ for Web3 Community**
