import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [buyerItems, setBuyerItems] = useState([]);
  const [sellerItems, setSellerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [counterMap, setCounterMap] = useState({});
  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      const [b, s] = await Promise.all([
        transactionAPI.buyerTransactions(),
        transactionAPI.sellerTransactions(),
      ]);
      setBuyerItems(b.data || []);
      setSellerItems(s.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const accept = async (id) => { await transactionAPI.accept(id); await loadAll(); };
  const reject = async (id) => { await transactionAPI.reject(id); await loadAll(); };
  const counter = async (id) => { const amount = Number(counterMap[id]); if (!amount) return; await transactionAPI.counter(id, amount); await loadAll(); };
  const complete = async (id) => { await transactionAPI.complete(id); window.dispatchEvent(new Event('coinUpdate')); await loadAll(); };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        {buyerItems.length === 0 ? (
          <div className="text-gray-600">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {buyerItems.map(o => (
              <div key={o.id} className="bg-white rounded shadow p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  {o.product?.images && o.product.images[0] && (
                    <img src={o.product.images[0].startsWith('http') ? o.product.images[0] : `http://localhost:8080${o.product.images[0]}`} alt={o.product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{o.product?.title}</div>
                  <div className="text-sm text-gray-500">₹{o.amount} • {o.paymentMethod || '—'} • {o.status}</div>
                </div>
                {o.status === 'ACCEPTED' && (
                  <button onClick={()=>navigate(`/checkout?productId=${o.product?.id}`)} className="px-3 py-2 rounded bg-indigo-600 text-white">Checkout</button>
                )}
                <div className="text-right text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Seller Requests</h2>
        {sellerItems.length === 0 ? (
          <div className="text-gray-600">No requests from buyers.</div>
        ) : (
          <div className="space-y-3">
            {sellerItems.map(o => (
              <div key={o.id} className="bg-white rounded shadow p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{o.product?.title}</div>
                    <div className="text-sm text-gray-500">Requested: ₹{o.amount} • Status: {o.status}</div>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                {o.status === 'REQUESTED' && (
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={()=>accept(o.id)} className="px-3 py-1.5 rounded bg-emerald-600 text-white">Accept</button>
                    <button onClick={()=>reject(o.id)} className="px-3 py-1.5 rounded bg-red-600 text-white">Reject</button>
                    <input type="number" placeholder="Counter ₹" value={counterMap[o.id]||''} onChange={(e)=>setCounterMap({...counterMap,[o.id]:e.target.value})} className="px-2 py-1 rounded border border-gray-300" />
                    <button onClick={()=>counter(o.id)} className="px-3 py-1.5 rounded bg-indigo-600 text-white">Send Counter</button>
                    <button onClick={()=>{
                      const phone = (o.buyer?.phoneNumber || '').replace(/\D/g,'');
                      const msg = encodeURIComponent(`Hi, about your interest in ${o.product?.title}.`);
                      if (phone) {
                        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                      } else {
                        alert('Buyer has not provided a WhatsApp number.');
                      }
                    }} className="px-3 py-1.5 rounded border">Chat (WA)</button>
                  </div>
                )}
                {o.status === 'ACCEPTED' && (
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={()=>complete(o.id)} className="px-3 py-1.5 rounded bg-purple-600 text-white">Confirm Order (Mark Sold)</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
