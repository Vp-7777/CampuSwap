import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cart';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Add product to cart
export const addToCart = async (productId) => {
  const response = await axios.post(
    `${API_URL}/add/${productId}`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Get cart items
export const getCartItems = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const response = await axios.delete(`${API_URL}/remove/${productId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Clear entire cart
export const clearCart = async () => {
  const response = await axios.delete(`${API_URL}/clear`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get cart count
export const getCartCount = async () => {
  const response = await axios.get(`${API_URL}/count`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Calculate discount
export const calculateDiscount = async (coinsToUse) => {
  const response = await axios.post(
    `${API_URL}/calculate-discount`,
    { coinsToUse },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export default {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  getCartCount,
  calculateDiscount,
};
