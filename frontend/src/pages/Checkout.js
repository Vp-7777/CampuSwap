import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI, transactionAPI, publicAPI } from '../services/api';
import TransactionFlow from '../components/TransactionFlow';
import { useEffect } from 'react';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Checkout = () => {
  const q = useQuery();
  const productId = q.get('productId');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showFlow, setShowFlow] = useState(false);
  const [coinBurst, setCoinBurst] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.getById(productId);
        setProduct(res.data);
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (productId) load();
    // prefill email from logged-in user if available
    try {
      const me = JSON.parse(localStorage.getItem('user') || '{}');
      if (me?.email) setEmail(me.email);
    } catch {}
  }, [productId]);

  const placeOrder = async () => {
    setShowFlow(true);
    setError('');
    try {
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setShowFlow(false);
        setError('Please enter a valid email to receive order updates.');
        return;
      }
      // Prefer public checkout to avoid auth issues
      const pub = await publicAPI.checkout({ email, productId, paymentMethod });
      if (pub?.data?.trackingCode) {
        setCoinBurst(`+20 CampusCoins earned! 🎉`);
        window.dispatchEvent(new Event('coinUpdate'));
        alert(`Order placed! Tracking: ${pub.data.trackingCode}`);
        navigate('/transactions');
        return;
      }
      // Private secured flow (fallback)
      const res = await transactionAPI.checkout({ productId, paymentMethod });
      if (res?.data?.trackingCode) {
        setCoinBurst(`+20 CampusCoins earned! 🎉`);
        window.dispatchEvent(new Event('coinUpdate'));
        alert(`Order placed! Tracking: ${res.data.trackingCode}`);
        navigate('/transactions');
        return;
      }
      // Fallback if API doesn't return tracking (older flow)
      await transactionAPI.create({ productId, type: 'BUY' });
      window.dispatchEvent(new Event('coinUpdate'));
      alert('Purchase request sent to seller!');
      navigate('/transactions');
    } catch (e) {
      // Fallback on failure to request-based transaction
      try {
        await transactionAPI.create({ productId, type: 'BUY' });
        setCoinBurst(`Request sent! 🎉`);
        window.dispatchEvent(new Event('coinUpdate'));
        alert('Purchase request sent to seller!');
        navigate('/transactions');
      } catch (e2) {
        const msg = e2.response?.data?.error || e2.response?.data?.message || e.response?.data?.error || e.message || 'Failed to place order';
        setError(msg);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {showFlow && <TransactionFlow onDone={() => setShowFlow(false)} />}
      {coinBurst && <div className="coin-burst">{coinBurst}</div>}
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      <div className="bg-white rounded shadow p-4 mb-6 flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
          {product.images && product.images[0] && (
            <img src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:8080${product.images[0]}`} alt={product.title} className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <div className="font-semibold text-lg">{product.title}</div>
          <div className="text-gray-500">Category: {product.category}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm text-gray-500">Price</div>
          <div className="text-2xl font-bold text-indigo-600">₹{product.price.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Contact Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="you@campus.edu"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 mb-4"
        />
        <h2 className="font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          {['CASH','WALLET','ONLINE'].map(m => (
            <label key={m} className="flex items-center gap-2">
              <input type="radio" name="pm" checked={paymentMethod===m} onChange={()=>setPaymentMethod(m)} />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={placeOrder} className="w-full btn-primary py-3 text-lg">Place Order</button>
    </div>
  );
};

export default Checkout;
