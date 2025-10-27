import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await wishlistAPI.getAll();
      setItems(res.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setItems(items.filter(p => p.id !== productId));
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to remove from wishlist');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
      {items.length === 0 ? (
        <div className="text-gray-600">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <Link to={`/products/${p.id}`} className="block">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  {p.images && p.images[0] ? (
                    <img
                      src={p.images[0].startsWith('http') ? p.images[0] : `http://localhost:8080${p.images[0]}`}
                      alt={p.title}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-lg">{p.title}</h3>
              </Link>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-gray-100 rounded">{p.category}</span>
                <span>₹{p.price}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => remove(p.id)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Remove</button>
                <Link to={`/products/${p.id}`} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
