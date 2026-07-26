import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Dashboard = ({ user, onLogout }) => {
  const { get } = useApi();
  const [dashboardData, setDashboardData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [slotDetails, setSlotDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const walletAddress = localStorage.getItem('walletAddress');

  const slotPrices = [6, 10, 20, 40, 80, 160, 320, 640];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await get(`/matrix/data/${walletAddress}`);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchSlotDetails = async (slotNumber) => {
    try {
      const data = await get(`/matrix/slot/${walletAddress}/${slotNumber}`);
      setSlotDetails(data);
      setSelectedSlot(slotNumber);
    } catch (error) {
      console.error('Error fetching slot details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">⭐ Nexa Space</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white md:hidden"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <button
            onClick={onLogout}
            className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-slate-800 border-r border-slate-700 p-4`}
        >
          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentPage('home');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentPage('profile');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white flex items-center gap-2"
            >
              <FiUser /> User Profile
            </button>
            <button
              onClick={() => {
                setCurrentPage('programs');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white"
            >
              Programs
            </button>
            <button
              onClick={() => {
                setCurrentPage('leaderboard');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white"
            >
              Leaderboard
            </button>
            <button
              onClick={() => {
                setCurrentPage('salary');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white"
            >
              Nexa Salary
            </button>
            <button
              onClick={() => {
                setCurrentPage('team');
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white"
            >
              Team
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {currentPage === 'home' && dashboardData && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Welcome back!</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
                  <p className="text-gray-300 text-sm">Total Profit</p>
                  <p className="text-2xl font-bold text-green-400">${dashboardData.totalProfit.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
                  <p className="text-gray-300 text-sm">Direct Partners</p>
                  <p className="text-2xl font-bold text-blue-400">{dashboardData.directPartners}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
                  <p className="text-gray-300 text-sm">Total Team</p>
                  <p className="text-2xl font-bold text-purple-400">{dashboardData.totalTeam}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border border-yellow-700">
                  <p className="text-gray-300 text-sm">Nexa Salary</p>
                  <p className="text-2xl font-bold text-yellow-400">${dashboardData.nexaSalary.toFixed(2)}</p>
                </div>
              </div>

              {/* Nexa Matrix Slots */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">🔷 Nexa Matrix - 8 Slots</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {slotPrices.map((price, idx) => {
                    const slotNum = idx + 1;
                    const isActive = dashboardData.slotDetails?.some(s => s.slotNumber === slotNum);
                    
                    return (
                      <button
                        key={slotNum}
                        onClick={() => isActive && fetchSlotDetails(slotNum)}
                        className={`${
                          isActive
                            ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-500 cursor-pointer hover:from-green-500 hover:to-green-600'
                            : 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
                        } border rounded-lg p-4 text-center transition`}
                      >
                        <p className="text-sm text-gray-300">Slot {slotNum}</p>
                        <p className="text-lg font-bold text-white">${price}</p>
                        <p className="text-xs text-gray-400 mt-1">{isActive ? '✓ Active' : 'Coming Soon'}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Details */}
              {slotDetails && (
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">Slot {selectedSlot} Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Commission Income</p>
                      <p className="text-2xl font-bold text-green-400">${slotDetails.income.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">MPS Foundation Balance</p>
                      <p className="text-2xl font-bold text-blue-400">${slotDetails.mpsFoundationBalance.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Royalty Balance</p>
                      <p className="text-2xl font-bold text-yellow-400">${slotDetails.royaltyBalance.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-4">Purchased: {new Date(slotDetails.purchaseDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}

          {currentPage === 'programs' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Programs</h2>
              <p className="text-gray-300">Nexa Matrix & Nexa Global coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
