// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NexaRegistration is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    
    uint256 public registrationFee = 0.01 * 10**18; // 0.01 USDT
    uint256 public userCount = 0;
    
    address public registrationWallet = 0xb7F926070eAa24C4ff29C3c14D403A2f3e13ED2F;
    
    struct User {
        uint256 userId;
        address walletAddress;
        string userName;
        uint256 joiningDate;
        bool isActive;
        uint256 referrerId;
        string profileImage;
    }
    
    mapping(address => User) public users;
    mapping(uint256 => address) public userIdToAddress;
    mapping(address => bool) public isRegistered;
    
    event UserRegistered(
        uint256 indexed userId,
        address indexed walletAddress,
        string userName,
        uint256 referrerId,
        uint256 timestamp
    );
    
    event RegistrationFeeUpdated(uint256 newFee);
    
    constructor(address _usdtToken) {
        usdtToken = IERC20(_usdtToken);
    }
    
    function register(
        string memory _userName,
        uint256 _referrerId
    ) external nonReentrant {
        require(!isRegistered[msg.sender], "Already registered");
        require(bytes(_userName).length > 0, "Name required");
        require(_referrerId == 0 || userIdToAddress[_referrerId] != address(0), "Invalid referrer");
        
        // Transfer registration fee
        require(
            usdtToken.transferFrom(msg.sender, registrationWallet, registrationFee),
            "Payment failed"
        );
        
        userCount++;
        uint256 userId = userCount;
        
        users[msg.sender] = User({
            userId: userId,
            walletAddress: msg.sender,
            userName: _userName,
            joiningDate: block.timestamp,
            isActive: true,
            referrerId: _referrerId,
            profileImage: ""
        });
        
        userIdToAddress[userId] = msg.sender;
        isRegistered[msg.sender] = true;
        
        emit UserRegistered(userId, msg.sender, _userName, _referrerId, block.timestamp);
    }
    
    function getUser(address _address) external view returns (User memory) {
        require(isRegistered[_address], "User not found");
        return users[_address];
    }
    
    function getUserByID(uint256 _userId) external view returns (User memory) {
        require(userIdToAddress[_userId] != address(0), "User not found");
        return users[userIdToAddress[_userId]];
    }
    
    function updateUserName(string memory _newName) external {
        require(isRegistered[msg.sender], "Not registered");
        users[msg.sender].userName = _newName;
    }
    
    function updateProfileImage(string memory _imageUrl) external {
        require(isRegistered[msg.sender], "Not registered");
        users[msg.sender].profileImage = _imageUrl;
    }
    
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }
    
    function setRegistrationWallet(address _newWallet) external onlyOwner {
        registrationWallet = _newWallet;
    }
    
    function getTotalUsers() external view returns (uint256) {
        return userCount;
    }
}
