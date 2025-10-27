import React, { useState, useEffect } from 'react';
import { getCoinBalance, getCoinHistory, getAvailableBadges, unlockBadge, generateReferralCode } from '../services/campusCoinService';
import CoinEarnNotification from '../components/CoinEarnNotification';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [coinHistory, setCoinHistory] = useState([]);
  const [availableBadges, setAvailableBadges] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ amount: 0, message: '' });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserData(user);

      const coinData = await getCoinBalance();
      setCoinBalance(coinData.campusCoins);
      setTotalReferrals(coinData.totalReferrals || 0);
      setReferralCode(coinData.referralCode || '');

      const history = await getCoinHistory();
      setCoinHistory(history);

      const badges = await getAvailableBadges();
      setAvailableBadges(badges);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    try {
      const data = await generateReferralCode();
      setReferralCode(data.referralCode);
    } catch (error) {
      alert('Error generating referral code: ' + error.response?.data?.error);
    }
  };

  const handleUnlockBadge = async (badgeName) => {
    if (coinBalance < 100) {
      alert('You need 100 coins to unlock this badge');
      return;
    }

    if (window.confirm(`Unlock ${badgeName} for 100 coins?`)) {
      try {
        await unlockBadge(badgeName);
        
        setNotification({
          amount: -100,
          message: `Unlocked ${badgeName}!`
        });
        setShowNotification(true);

        fetchProfileData();
        window.dispatchEvent(new Event('coinUpdate'));
      } catch (error) {
        alert('Error unlocking badge: ' + error.response?.data?.error);
      }
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const getTransactionIcon = (type) => {
    if (type.includes('EARN')) return '💰';
    if (type.includes('SPEND')) return '💸';
    return '🔄';
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <CoinEarnNotification
        amount={Math.abs(notification.amount)}
        message={notification.message}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card-modern p-8 mb-6 animate-fade-in">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center text-4xl font-bold text-white">
              {userData?.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold gradient-text mb-2">{userData?.fullName}</h1>
              <p className="text-gray-600 mb-4">{userData?.email}</p>
              <div className="flex items-center gap-4">
                <div className="coin-display">
                  <span className="text-xl">🪙</span>
                  <span className="text-lg font-bold">{coinBalance}</span>
                  <span className="text-sm">Coins</span>
                </div>
                <div className="badge">
                  <span>👥</span>
                  <span>{totalReferrals} Referrals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏆 Badges
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📜 Coin History
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'referral'
                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎁 Referral
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-modern p-6 animate-fade-in">
              <div className="text-4xl mb-3">🪙</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{coinBalance}</div>
              <div className="text-gray-600">CampusCoins</div>
            </div>
            <div className="card-modern p-6 animate-fade-in">
              <div className="text-4xl mb-3">🏆</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Object.values(availableBadges).filter(b => b.unlocked).length}
              </div>
              <div className="text-gray-600">Badges Unlocked</div>
            </div>
            <div className="card-modern p-6 animate-fade-in">
              <div className="text-4xl mb-3">👥</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{totalReferrals}</div>
              <div className="text-gray-600">Referrals</div>
            </div>

            {/* Earn More Section */}
            <div className="md:col-span-3 card-modern p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h3 className="text-xl font-bold mb-4">💰 How to Earn CampusCoins</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-semibold">Upload Product</div>
                    <div className="text-sm text-green-600">+10 coins</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <div className="font-semibold">Make a Purchase</div>
                    <div className="text-sm text-green-600">+20 coins</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="font-semibold">Complete a Sale</div>
                    <div className="text-sm text-green-600">+50 coins</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-semibold">Refer a Friend</div>
                    <div className="text-sm text-green-600">+100 coins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(availableBadges).map(([name, data]) => (
              <div key={name} className="card-modern p-6 animate-fade-in">
                <div className="text-center">
                  <div className="text-5xl mb-4">
                    {data.unlocked ? name.split(' ')[0] : '🔒'}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{name}</h3>
                  {data.unlocked ? (
                    <div className="badge bg-green-500 mx-auto">✓ Unlocked</div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-600 mb-3">
                        Cost: <span className="font-bold text-orange-600">{data.cost} coins</span>
                      </div>
                      <button
                        onClick={() => handleUnlockBadge(name)}
                        disabled={coinBalance < data.cost}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          coinBalance >= data.cost
                            ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Unlock Badge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card-modern p-6">
            <h2 className="text-2xl font-bold mb-6">📜 Coin Transaction History</h2>
            {coinHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p>No transaction history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coinHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                      <div>
                        <div className="font-semibold">{transaction.description}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getTransactionColor(transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} 🪙
                      </div>
                      <div className="text-sm text-gray-500">
                        Balance: {transaction.balanceAfter}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'referral' && (
          <div className="card-modern p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Refer & Earn</h2>
              <p className="text-gray-600">Earn 100 coins for every friend who joins!</p>
            </div>

            {referralCode ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Your Referral Code</h3>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="flex-1 px-6 py-3 text-xl font-bold text-center bg-white border-2 border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={copyReferralCode}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Share this code with your friends!</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleGenerateReferralCode}
                  className="btn-primary"
                >
                  Generate Referral Code
                </button>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <div className="text-4xl mb-3">👥</div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{totalReferrals}</div>
                <div className="text-gray-600">Total Referrals</div>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="text-4xl mb-3">💰</div>
                <div className="text-3xl font-bold text-green-600 mb-2">{totalReferrals * 100}</div>
                <div className="text-gray-600">Coins Earned</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
