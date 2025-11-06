import api from './api';

// Add product to cart
export const addToCart = async (productId) => {
  const { data } = await api.post(`/cart/add/${productId}`, {});
  return data;
};

// Get cart items
export const getCartItems = async () => {
  const { data } = await api.get('/cart');
  return data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return data;
};

// Clear entire cart
export const clearCart = async () => {
  const { data } = await api.delete('/cart/clear');
  return data;
};

// Get cart count
export const getCartCount = async () => {
  const { data } = await api.get('/cart/count');
  return data;
};

// Calculate discount
export const calculateDiscount = async (coinsToUse) => {
  const { data } = await api.post('/cart/calculate-discount', { coinsToUse });
  return data;
};

export default {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  getCartCount,
  calculateDiscount,
};
