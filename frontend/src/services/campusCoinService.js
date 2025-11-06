import api from './api';

// Get user's coin balance
export const getCoinBalance = async () => {
  const { data } = await api.get('/coins/balance');
  return data;
};

// Get coin transaction history
export const getCoinHistory = async () => {
  const { data } = await api.get('/coins/history');
  return data;
};

// Get recent transactions
export const getRecentTransactions = async () => {
  const { data } = await api.get('/coins/recent');
  return data;
};

// Generate referral code
export const generateReferralCode = async () => {
  const { data } = await api.post('/coins/referral/generate', {});
  return data;
};

// Boost product (costs 50 coins)
export const boostProduct = async (productId, productName) => {
  const { data } = await api.post(`/coins/boost/${productId}`, { productName });
  return data;
};

// Unlock badge (costs 100 coins)
export const unlockBadge = async (badgeName) => {
  const { data } = await api.post('/coins/badge/unlock', { badgeName });
  return data;
};

// Get available badges
export const getAvailableBadges = async () => {
  const { data } = await api.get('/coins/badges/available');
  return data;
};

// Get coin prices and info
export const getCoinPrices = async () => {
  const { data } = await api.get('/coins/prices');
  return data;
};

// Redeem referral/invite code (awards coins to referrer)
export const redeemReferral = async (referralCode) => {
  const { data } = await api.post('/coins/referral/redeem', { referralCode });
  return data;
};

export default {
  getCoinBalance,
  getCoinHistory,
  getRecentTransactions,
  generateReferralCode,
  boostProduct,
  unlockBadge,
  getAvailableBadges,
  getCoinPrices,
  redeemReferral,
};
