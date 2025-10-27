import React, { useState, useEffect } from 'react';
import { getCoinBalance } from '../services/campusCoinService';
import { useAuth } from '../context/AuthContext';

const CoinWallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const { token } = useAuth();

  const fetchBalance = async () => {
    try {
      const data = await getCoinBalance();
      const newBalance = data.campusCoins;
      
      // Trigger animation if balance changed
      if (newBalance !== balance && balance !== 0) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 1000);
      }
      
      setBalance(newBalance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coin balance:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBalance();
    }
    // Refresh balance every 30 seconds when logged in
    const interval = setInterval(() => { if (token) fetchBalance(); }, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Listen for coin updates
  useEffect(() => {
    const handleCoinUpdate = () => {
      fetchBalance();
    };

    window.addEventListener('coinUpdate', handleCoinUpdate);
    return () => window.removeEventListener('coinUpdate', handleCoinUpdate);
  }, []);

  if (loading) {
    return (
      <div className="coin-display animate-pulse">
        <span className="text-xl">🪙</span>
        <span>...</span>
      </div>
    );
  }

  return (
    <a 
      className={`coin-display cursor-pointer ${animate ? 'animate-coin-spin' : ''}`}
      href="/coins"
      title="View CampusCoins"
      onClick={(e) => { e.stopPropagation(); }}
    >
      <span className="text-xl">🪙</span>
      <span className="text-lg font-bold">{balance}</span>
      <span className="text-sm opacity-80">Coins</span>
    </a>
  );
};

export default CoinWallet;
