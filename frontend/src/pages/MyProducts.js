import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.myProducts();
        setProducts(res.data || []);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load your products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link to="/create-product" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ New</Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}

      {products.length === 0 ? (
        <div className="text-gray-600">No products yet. <Link to="/create-product" className="text-indigo-600 underline">Create one</Link>.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
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
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-3">
                <span>Status: <span className="font-medium">{p.status}</span></span>
                <span>Approval: <span className="font-medium">{p.approvalStatus}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
