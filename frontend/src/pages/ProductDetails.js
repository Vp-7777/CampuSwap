import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, wishlistAPI, transactionAPI, publicAPI } from '../services/api';
import AuctionPanel from '../components/AuctionPanel';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [showAuction, setShowAuction] = useState(false);

  useEffect(() => {
    loadProduct();
    checkWishlist();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const response = await wishlistAPI.check(id);
      setInWishlist(response.data);
    } catch (error) {
      console.error('Failed to check wishlist', error);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistAPI.remove(id);
      } else {
        await wishlistAPI.add(id);
      }
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Failed to update wishlist', error);
    }
  };

  const handleBuyNow = async () => {
    navigate(`/checkout?productId=${id}`);
  };

  const handleChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const phone = (product.seller.phoneNumber || '').replace(/\D/g,'');
    const msg = encodeURIComponent(`Hi ${product.seller.fullName}, I'm interested in your product: ${product.title} (₹${product.price}).`);
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    } else {
      alert('Seller has not provided a WhatsApp number.');
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const isOwnProduct = user && product.seller.id === user.userId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:8080${product.images[0]}`}
                alt={product.title}
                className="w-full h-full object-cover"
onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xl">No Image Available</span>
              </div>
            )}
          </div>
          
          {/* Image Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((img, index) => (
                <div key={index} className="bg-gray-200 rounded aspect-square overflow-hidden">
                  <img
                    src={img.startsWith('http') ? img : `http://localhost:8080${img}`}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-75"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            </div>
            {!isOwnProduct && (
              <button
                onClick={handleWishlist}
                className={`text-3xl ${
                  inWishlist ? 'text-red-500' : 'text-gray-300'
                } hover:text-red-500 transition`}
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-4xl font-bold text-indigo-600">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            {product.suggestedPrice && product.suggestedPrice > product.price && (
              <p className="text-xl text-gray-400 line-through">
                ₹{product.suggestedPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="font-semibold">{product.averageRating}</span>
              <span className="text-gray-500">({product.viewCount} views)</span>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {product.exchangeAllowed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">🔄 Exchange Available</p>
              {product.exchangeItem && (
                <p className="text-green-700 text-sm">Looking for: {product.exchangeItem}</p>
              )}
            </div>
          )}

          {/* Seller Info */}
          <div className="border-t pt-6 mb-6">
            <h2 className="font-semibold text-lg mb-3">Seller Information</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-lg">
                  {product.seller.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold">{product.seller.fullName}</p>
                <p className="text-sm text-gray-500">{product.seller.email}</p>
                {product.seller.phoneNumber && (
                  <p className="text-sm text-gray-500">{product.seller.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwnProduct ? (
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>Buy Now</span>
              </button>
              <button
                onClick={() => setShowAuction(true)}
                className="w-full bg-white border-2 border-rose-600 text-rose-700 py-4 rounded-xl font-semibold hover:bg-rose-50 transition flex items-center justify-center gap-2"
              >
                <span>⏱️</span>
                <span>Join Live Auction</span>
              </button>
              <button
                onClick={handleChat}
                className="w-full btn-accent py-4 text-lg flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Chat with Seller</span>
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-semibold">This is your product</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('/my-products')}
                  className="text-blue-600 hover:underline"
                >
                  Manage your products →
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm('Remove this product from marketplace?')) return;
                    try {
                      await productAPI.delete(product.id);
                      alert('Product removed.');
                      navigate('/my-products');
                    } catch (e) {
                      alert(e.response?.data?.error || e.response?.data?.message || 'Failed to remove product');
                    }
                  }}
                  className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Delist
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold">{product.status}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-500">Listed</p>
              <p className="font-semibold">{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      {showAuction && <AuctionPanel price={product.price} productId={product.id} onClose={() => setShowAuction(false)} />}
    </div>
  );
};

export default ProductDetails;
