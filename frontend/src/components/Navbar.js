import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoinWallet from './CoinWallet';
import { getCartCount } from '../services/cartService';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdate', fetchCartCount);
    return () => window.removeEventListener('cartUpdate', fetchCartCount);
  }, []);

  const fetchCartCount = async () => {
    try {
      const data = await getCartCount();
      setCartCount(data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-xl font-bold tracking-tight">CampusSwap</span>
            </Link>
            {/* Primary nav */}
            <div className="hidden md:flex items-center gap-1 ml-6">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">Marketplace</Link>
              <Link to="/my-products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">My Products</Link>
              <Link to="/wishlist" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">Wishlist</Link>
              <Link to="/chat" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">Chat</Link>
              <Link to="/transactions" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">Orders</Link>
              {isAdmin() && (
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50">Admin</Link>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <CoinWallet />

            {/* Sell Item */}
            <Link to="/create-product" className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">+ Sell</Link>

            {/* Cart */}
            <Link to="/cart" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold">
              {user?.fullName?.charAt(0) || 'U'}
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
