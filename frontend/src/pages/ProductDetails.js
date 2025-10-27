import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, wishlistAPI, transactionAPI } from '../services/api';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

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
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (window.confirm(`Buy ${product.title} for ₹${product.price.toLocaleString('en-IN')}?`)) {
      try {
        await transactionAPI.create({
          productId: product.id,
          type: 'BUY',
          amount: product.price,
          paymentMethod: 'WALLET'
        });
        alert('Purchase request sent to seller!');
        navigate('/transactions');
      } catch (error) {
        alert('Failed to create transaction: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/chat?sellerId=${product.seller.id}`);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(product.id);
      alert('Added to cart!');
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      alert('Failed to add to cart: ' + error.response?.data?.error || error.message);
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
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=No+Image' }}
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
                onClick={handleAddToCart}
                className="w-full bg-white border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2"
              >
                <span>🛍️</span>
                <span>Add to Cart</span>
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
              <button
                onClick={() => navigate('/my-products')}
                className="mt-2 text-blue-600 hover:underline"
              >
                Manage your products →
              </button>
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
    </div>
  );
};

export default ProductDetails;
