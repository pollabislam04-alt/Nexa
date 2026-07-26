# SETUP INSTRUCTIONS FOR NEXA SPACE

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- MetaMask Wallet
- Git

### Installation & Setup

#### 1. Clone Repository
```bash
git clone https://github.com/pollabislam04-alt/nexa.git
cd nexa
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp ../.env.example .env

# Update .env with your values:
# - DB_URL: MongoDB connection string
# - JWT_SECRET: Your secret key
# - PORT: 5000

# Start backend
npm run dev
```

#### 3. Deploy Smart Contracts
```bash
cd ../contracts
npm install

# Create .env file with your private key
echo "PRIVATE_KEY=your_private_key_here" > .env

# Deploy to BSC Testnet
npx hardhat run scripts/deploy.js --network bsc-testnet

# Save contract addresses from deployment output
```

#### 4. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start frontend (port 3000)
npm run dev
```

#### 5. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 📋 System Architecture

### Smart Contracts (Solidity)

#### NexaRegistration.sol
- User registration with referral system
- Registration fee: 0.01 USDT
- Manages user profiles and ID mapping

#### NexaMatrix.sol
- 8 Slot system ($6 - $640)
- Commission distribution (50%, 10%, 10%, 10%, 5%, 5%, 5%, 5%)
- MPS Foundation & Royalty balances in slots
- Multi-level income tracking

### Backend API (Node.js + Express + MongoDB)

#### Routes
- `/api/auth` - Login/Register
- `/api/users` - User profiles
- `/api/matrix` - Slot management & commissions
- `/api/dashboard` - Dashboard data
- `/api/leaderboard` - Rankings
- `/api/team` - Team hierarchy & stats
- `/api/salary` - Nexa Salary program

### Frontend (Next.js + React)

- Authentication with MetaMask
- Real-time dashboard
- Slot activation & management
- Team hierarchy visualization
- Income tracking
- Leaderboard

---

## 💰 Commission Structure

### Slot Payment Flow ($6 Example)
```
Total: $6
├─ Level 1 (Direct): 50% = $3 (if has Slot 1)
├─ Level 2: 10% = $0.60 (if has Slot 1)
├─ Level 3: 10% = $0.60 (if has Slot 1)
├─ Level 4: 10% = $0.60 (if has Slot 1)
├─ Level 5: 5% = $0.30 (if has Slot 1)
├─ Level 6: 5% = $0.30 (if has Slot 1)
├─ Level 7 (MPS): 5% = $0.30 → Slot Balance
└─ Level 8 (Royalty): 5% = $0.30 → Slot Balance
```

### Commission Conditions
- Commission only paid if upline has the **same slot activated**
- MPS Foundation (Level 7) & Royalty (Level 8) go to **slot balance**
- Other commissions go to **income balance**

### Nexa Salary Program
```
Level 1: 200 Team + 20 Direct Partners = 15% Salary
Level 2: 500 Team + 40 Direct Partners = 20% Salary
Level 3: 1000 Team + 70 Direct Partners = 30% Salary
Level 4: 2000 Team + 150 Direct Partners = 35% Salary
```

---

## 🔐 Wallet Addresses

- **Registration Wallet**: `0xb7F926070eAa24C4ff29C3c14D403A2f3e13ED2F`
- **Slot Payment Wallet**: `0x050b82f6Dae0947FF15B372E7AD95454162cA001`
- **MPS Foundation**: `0xb7F926070eAa24C4ff29C3c14D403A2f3e13ED2F`

---

## 📊 API Endpoints

### Authentication
```bash
POST /api/auth/register
{
  "walletAddress": "0x...",
  "userName": "username",
  "referrerId": 1
}

POST /api/auth/login
{
  "walletAddress": "0x..."
}
```

### Matrix/Slots
```bash
GET /api/matrix/data/:walletAddress
GET /api/matrix/slot/:walletAddress/:slotNumber
GET /api/matrix/commission-structure
POST /api/matrix/activate-slot
{
  "walletAddress": "0x...",
  "slotNumber": 1
}
```

### Team
```bash
GET /api/team/:walletAddress
GET /api/team/tree/:walletAddress
GET /api/team/stats/:walletAddress
```

### Salary
```bash
GET /api/salary/:walletAddress
POST /api/salary/calculate
{
  "totalProfit": 1000,
  "teamSize": 200,
  "directPartners": 20
}
```

---

## 🌐 BNB Chain Configuration

### Testnet
- Network: BNB Smart Chain Testnet
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-b.binance.org:8545
- Explorer: https://testnet.bscscan.com

### Mainnet
- Network: BNB Smart Chain
- Chain ID: 56
- RPC: https://bsc-dataseed.binance.org
- Explorer: https://bscscan.com

---

## 📱 Features

✅ Wallet Connect (MetaMask)
✅ User Registration & Login
✅ Nexa Matrix (8 Slots)
✅ Multi-level Commission System
✅ Team Management & Hierarchy
✅ Real-time Dashboard
✅ Leaderboard
✅ Nexa Salary Program
✅ Income Tracking
✅ User Profiles

---

## 🚨 Important Notes

1. **Private Key Security**: Never commit `.env` files with private keys
2. **MongoDB**: Use MongoDB Atlas for production
3. **Contract Verification**: Verify contracts on BScScan after deployment
4. **Testing**: Always test on testnet before mainnet
5. **Token Approval**: Users must approve USDT spending before transactions

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check the documentation
- Review API endpoints

---

## 📄 License

MIT License - See LICENSE file for details
