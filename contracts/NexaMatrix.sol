// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface INexaRegistration {
    function isRegistered(address _address) external view returns (bool);
    function userIdToAddress(uint256 _userId) external view returns (address);
    function users(address _address) external view returns (
        uint256 userId,
        address walletAddress,
        string memory userName,
        uint256 joiningDate,
        bool isActive,
        uint256 referrerId,
        string memory profileImage
    );
}

contract NexaMatrix is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    INexaRegistration public registrationContract;
    
    address public slotPaymentWallet = 0x050b82f6Dae0947FF15B372E7AD95454162cA001;
    address public mpsFoundationWallet = 0xb7F926070eAa24C4ff29C3c14D403A2f3e13ED2F;
    
    uint256[] public slotPrices = [6e18, 10e18, 20e18, 40e18, 80e18, 160e18, 320e18, 640e18];
    
    // Commission percentages (in basis points, 100 = 1%)
    uint256[] public commissionPercentages = [5000, 1000, 1000, 1000, 500, 500, 500, 500]; // 50%, 10%, 10%, 10%, 5%, 5%, 5%, 5%
    
    struct MatrixSlot {
        uint256 slotId;
        uint256 slotNumber;
        address owner;
        bool isActive;
        uint256 purchaseDate;
        uint256 income;
        uint256 directDownline;
        uint256 teamDownline;
        uint256 mpsFoundationBalance;
        uint256 royaltyBalance;
    }
    
    struct UserMatrix {
        uint256 totalProfit;
        uint256 directPartners;
        uint256 totalTeam;
        uint256 activeSlots;
        uint256 nexaSalary;
        MatrixSlot[] slots;
    }
    
    mapping(address => UserMatrix) public userMatrix;
    mapping(address => mapping(uint256 => bool)) public hasSlot;
    mapping(address => mapping(uint256 => MatrixSlot)) public userSlots;
    mapping(uint256 => address) public slotOwner;
    mapping(uint256 => bool) public slotActive;
    
    event SlotActivated(
        address indexed user,
        uint256 indexed slotNumber,
        uint256 price,
        uint256 timestamp
    );
    
    event CommissionDistributed(
        address indexed recipient,
        uint256 amount,
        uint256 level,
        address indexed from,
        uint256 timestamp
    );
    
    event IncomeGenerated(
        address indexed user,
        uint256 amount,
        string incomeType,
        uint256 timestamp
    );
    
    constructor(address _usdtToken, address _registrationContract) {
        usdtToken = IERC20(_usdtToken);
        registrationContract = INexaRegistration(_registrationContract);
    }
    
    function activateSlot(uint256 _slotNumber) external nonReentrant {
        require(registrationContract.isRegistered(msg.sender), "Not registered");
        require(_slotNumber >= 1 && _slotNumber <= 8, "Invalid slot");
        require(!hasSlot[msg.sender][_slotNumber], "Slot already activated");
        
        // Check if previous slot is activated
        if (_slotNumber > 1) {
            require(hasSlot[msg.sender][_slotNumber - 1], "Previous slot required");
        }
        
        uint256 slotPrice = slotPrices[_slotNumber - 1];
        
        // Transfer payment
        require(
            usdtToken.transferFrom(msg.sender, address(this), slotPrice),
            "Payment failed"
        );
        
        hasSlot[msg.sender][_slotNumber] = true;
        userMatrix[msg.sender].activeSlots++;
        
        MatrixSlot memory newSlot = MatrixSlot({
            slotId: _slotNumber,
            slotNumber: _slotNumber,
            owner: msg.sender,
            isActive: true,
            purchaseDate: block.timestamp,
            income: 0,
            directDownline: 0,
            teamDownline: 0,
            mpsFoundationBalance: 0,
            royaltyBalance: 0
        });
        
        userSlots[msg.sender][_slotNumber] = newSlot;
        userMatrix[msg.sender].slots.push(newSlot);
        slotActive[_slotNumber] = true;
        slotOwner[_slotNumber] = msg.sender;
        
        // Distribute commissions to uplines
        _distributeCommissions(msg.sender, slotPrice, _slotNumber);
        
        emit SlotActivated(msg.sender, _slotNumber, slotPrice, block.timestamp);
    }
    
    function _distributeCommissions(address _buyer, uint256 _amount, uint256 _slotNumber) internal {
        // Get buyer's referrer ID
        (uint256 buyerId, , , , , uint256 referrerId, ) = registrationContract.users(_buyer);
        
        uint256 currentUplineId = referrerId;
        uint256 level = 0;
        
        // Distribute through 8 levels
        for (uint256 i = 0; i < 8; i++) {
            if (currentUplineId == 0) break;
            
            address uplineAddress = registrationContract.userIdToAddress(currentUplineId);
            if (uplineAddress == address(0)) break;
            
            // Check if upline has the same slot active
            if (hasSlot[uplineAddress][_slotNumber]) {
                uint256 commission = (_amount * commissionPercentages[i]) / 10000;
                
                // Distribute commission
                if (i == 6) {
                    // MPS Foundation (5%)
                    userSlots[uplineAddress][_slotNumber].mpsFoundationBalance += commission;
                    userMatrix[uplineAddress].totalProfit += commission;
                } else if (i == 7) {
                    // Royalty (5%)
                    userSlots[uplineAddress][_slotNumber].royaltyBalance += commission;
                    userMatrix[uplineAddress].totalProfit += commission;
                } else {
                    // Regular commission
                    userSlots[uplineAddress][_slotNumber].income += commission;
                    userMatrix[uplineAddress].totalProfit += commission;
                }
                
                emit CommissionDistributed(uplineAddress, commission, i + 1, _buyer, block.timestamp);
            }
            
            // Move to next level
            (uint256 uplineId, , , , , uint256 nextReferrerId, ) = registrationContract.users(uplineAddress);
            currentUplineId = nextReferrerId;
            level++;
        }
    }
    
    function getSlotPrice(uint256 _slotNumber) external view returns (uint256) {
        require(_slotNumber >= 1 && _slotNumber <= 8, "Invalid slot");
        return slotPrices[_slotNumber - 1];
    }
    
    function getUserMatrix(address _user) external view returns (UserMatrix memory) {
        return userMatrix[_user];
    }
    
    function hasActiveSlot(address _user, uint256 _slotNumber) external view returns (bool) {
        return hasSlot[_user][_slotNumber];
    }
    
    function getSlotDetails(address _user, uint256 _slotNumber) external view returns (MatrixSlot memory) {
        require(hasSlot[_user][_slotNumber], "Slot not active");
        return userSlots[_user][_slotNumber];
    }
    
    function setMpsFoundationWallet(address _newWallet) external onlyOwner {
        mpsFoundationWallet = _newWallet;
    }
    
    function setSlotPaymentWallet(address _newWallet) external onlyOwner {
        slotPaymentWallet = _newWallet;
    }
}
