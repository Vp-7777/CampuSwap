import axios from 'axios';

const API_URL = 'http://localhost:8080/api/coins';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Get user's coin balance
export const getCoinBalance = async () => {
  const response = await axios.get(`${API_URL}/balance`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get coin transaction history
export const getCoinHistory = async () => {
  const response = await axios.get(`${API_URL}/history`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get recent transactions
export const getRecentTransactions = async () => {
  const response = await axios.get(`${API_URL}/recent`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Generate referral code
export const generateReferralCode = async () => {
  const response = await axios.post(`${API_URL}/referral/generate`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Boost product (costs 50 coins)
export const boostProduct = async (productId, productName) => {
  const response = await axios.post(
    `${API_URL}/boost/${productId}`,
    { productName },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Unlock badge (costs 100 coins)
export const unlockBadge = async (badgeName) => {
  const response = await axios.post(
    `${API_URL}/badge/unlock`,
    { badgeName },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Get available badges
export const getAvailableBadges = async () => {
  const response = await axios.get(`${API_URL}/badges/available`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get coin prices and info
export const getCoinPrices = async () => {
  const response = await axios.get(`${API_URL}/prices`, {
    headers: getAuthHeader(),
  });
  return response.data;
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
};
