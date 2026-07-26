// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface INexaRegistration {
    function isRegistered(address _address) external view returns (bool);
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
    
    uint256[] public slotPrices = [6e18, 10e18, 20e18, 40e18, 80e18, 160e18, 320e18, 640e18];
    
    struct MatrixSlot {
        uint256 slotId;
        uint256 slotNumber;
        address owner;
        bool isActive;
        uint256 purchaseDate;
        uint256 income;
        uint256 directDownline;
        uint256 teamDownline;
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
    mapping(uint256 => uint256) public slotIncomeDistribution;
    
    event SlotActivated(
        address indexed user,
        uint256 indexed slotNumber,
        uint256 price,
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
        
        if (_slotNumber > 1) {
            require(hasSlot[msg.sender][_slotNumber - 1], "Previous slot required");
        }
        
        uint256 slotPrice = slotPrices[_slotNumber - 1];
        
        require(
            usdtToken.transferFrom(msg.sender, slotPaymentWallet, slotPrice),
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
            teamDownline: 0
        });
        
        userMatrix[msg.sender].slots.push(newSlot);
        
        emit SlotActivated(msg.sender, _slotNumber, slotPrice, block.timestamp);
    }
    
    function addDirectPartner(address _downline) external {
        require(registrationContract.isRegistered(msg.sender), "Upline not registered");
        require(registrationContract.isRegistered(_downline), "Downline not registered");
        
        userMatrix[msg.sender].directPartners++;
        userMatrix[msg.sender].totalTeam++;
    }
    
    function addTeamMember(address _downline) external {
        require(registrationContract.isRegistered(msg.sender), "Not registered");
        userMatrix[msg.sender].totalTeam++;
    }
    
    function generateIncome(
        address _user,
        uint256 _amount,
        string memory _incomeType
    ) external onlyOwner {
        userMatrix[_user].totalProfit += _amount;
        emit IncomeGenerated(_user, _amount, _incomeType, block.timestamp);
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
    
    function setSlotPaymentWallet(address _newWallet) external onlyOwner {
        slotPaymentWallet = _newWallet;
    }
}
