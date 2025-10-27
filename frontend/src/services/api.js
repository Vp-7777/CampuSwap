import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  trending: () => api.get('/products/trending'),
  byCategory: (category) => api.get(`/products/category/${category}`),
  myProducts: () => api.get('/products/my-products'),
  delete: (id) => api.delete(`/products/${id}`),
};

// Admin APIs
export const adminAPI = {
  getPending: () => api.get('/admin/products/pending'),
  approve: (id) => api.put(`/admin/products/${id}/approve`),
  reject: (id) => api.put(`/admin/products/${id}/reject`),
  analytics: () => api.get('/admin/analytics'),
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
};

// Transaction APIs
export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  accept: (id) => api.put(`/transactions/${id}/accept`),
  reject: (id) => api.put(`/transactions/${id}/reject`),
  complete: (id) => api.put(`/transactions/${id}/complete`),
  buyerTransactions: () => api.get('/transactions/buyer'),
  sellerTransactions: () => api.get('/transactions/seller'),
};

// Wishlist APIs
export const wishlistAPI = {
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  getAll: () => api.get('/wishlist'),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getBySeller: (sellerId) => api.get(`/reviews/seller/${sellerId}`),
};

// Chat APIs
export const chatAPI = {
  getHistory: (userId) => api.get(`/chat/history/${userId}`),
  getUnread: () => api.get('/chat/unread'),
  getUnreadCount: () => api.get('/chat/unread/count'),
  markRead: (messageId) => api.put(`/chat/${messageId}/read`),
};

export default api;
