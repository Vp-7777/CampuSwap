import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, removeFromCart, clearCart, calculateDiscount } from '../services/cartService';
import { getCoinBalance } from '../services/campusCoinService';
import { transactionAPI } from '../services/api';
import CoinEarnNotification from '../components/CoinEarnNotification';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coinBalance, setCoinBalance] = useState(0);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ amount: 0, message: '' });
  const [fetchError, setFetchError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchCoinBalance();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data.items);
      setTotal(data.total);
      setFinalTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setFetchError(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to load cart');
      setLoading(false);
    }
  };

  const fetchCoinBalance = async () => {
    try {
      const data = await getCoinBalance();
      setCoinBalance(data.campusCoins);
    } catch (error) {
      console.error('Error fetching coin balance:', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      alert('Error removing item: ' + error.response?.data?.error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        fetchCart();
        window.dispatchEvent(new Event('cartUpdate'));
      } catch (error) {
        alert('Error clearing cart: ' + error.response?.data?.error);
      }
    }
  };

  const handleApplyDiscount = async () => {
    if (coinsToUse > coinBalance) {
      alert(`You only have ${coinBalance} coins`);
      return;
    }
    if (coinsToUse > total) {
      alert(`Maximum discount is ₹${total}`);
      return;
    }
    try {
      const data = await calculateDiscount(coinsToUse);
      setDiscount(data.discount);
      setFinalTotal(data.finalTotal);
    } catch (error) {
      alert('Error calculating discount: ' + error.response?.data?.error);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      // Create transactions for each item
      for (const item of cartItems) {
        await transactionAPI.create({
          productId: item.product.id,
          type: 'BUY'
        });
      }

      // Show notification for coins earned
      const coinsEarned = cartItems.length * 20; // 20 coins per purchase
      setNotification({
        amount: coinsEarned,
        message: `Purchased ${cartItems.length} item(s)!`
      });
      setShowNotification(true);

      // Clear cart and redirect
      await clearCart();
      window.dispatchEvent(new Event('cartUpdate'));
      window.dispatchEvent(new Event('coinUpdate'));

      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (error) {
      alert('Error processing checkout: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <CoinEarnNotification
        amount={notification.amount}
        message={notification.message}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">🛒 Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {fetchError && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{fetchError}</div>
        )}
        {cartItems.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products to your cart!</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card-modern p-6 animate-fade-in">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {item.product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Seller: {item.product.seller?.fullName}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="badge">{item.product.category}</span>
                        {item.product.exchangeAllowed && (
                          <span className="badge bg-green-500">🔄 Exchange</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-4">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                className="w-full py-3 text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition font-semibold"
              >
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-modern p-6 sticky top-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Coin Discount Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🪙</span>
                    <h3 className="text-lg font-bold">Use CampusCoins</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    You have <span className="font-bold text-orange-600">{coinBalance}</span> coins
                    <br />
                    1 coin = ₹1 discount
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={coinsToUse}
                      onChange={(e) => setCoinsToUse(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      placeholder="Enter coins"
                      max={Math.min(coinBalance, total)}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coin Discount ({coinsToUse} coins)</span>
                      <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary text-lg py-4"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>🎉 You'll earn <span className="font-bold text-green-600">{cartItems.length * 20}</span> coins with this purchase!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
