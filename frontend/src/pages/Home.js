import React, { useState, useEffect } from 'react';
import { productAPI, wishlistAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [likedProducts, setLikedProducts] = useState(new Set());

  const categories = [
    { id: 'ALL', name: 'All Products', icon: '🏪' },
    { id: 'BOOKS', name: 'Books', icon: '📚' },
    { id: 'ELECTRONICS', name: 'Electronics', icon: '💻' },
    { id: 'FURNITURE', name: 'Furniture', icon: '🪑' },
    { id: 'FASHION', name: 'Fashion', icon: '👕' },
    { id: 'ACCESSORIES', name: 'Accessories', icon: '🎒' },
    { id: 'SPORTS', name: 'Sports', icon: '⚽' },
    { id: 'OTHER', name: 'Other', icon: '🔧' }
  ];

  // Auto-changing tagline under CampusFeed
  const taglines = [
    '💼 Tech, Fashion & More — All Inside Your Campus!',
    '📚 Books, Gadgets & Deals — From Students, For Students!',
    '🛍️ Fashion, Accessories & Essentials — Nearby!',
    '🪑 Furniture, Electronics & More — Budget-Friendly on Campus!'
  ];
  const [tagIndex, setTagIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTagIndex(i => (i + 1) % taglines.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    loadProducts();
    if (user) {
      loadWishlist();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, searchQuery, sortBy]);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await wishlistAPI.getAll();
      const wishlistIds = new Set(response.data.map(item => item.product.id));
      setLikedProducts(wishlistIds);
    } catch (error) {
      console.error('Failed to load wishlist', error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Hide sold products
    filtered = filtered.filter(p => (p.status || 'AVAILABLE') !== 'SOLD');

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleLike = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (likedProducts.has(productId)) {
        await wishlistAPI.remove(productId);
        setLikedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        try {
          await wishlistAPI.add(productId);
        } catch (e) {
          // If already in wishlist, treat as success
          if (e.response?.data?.error?.toLowerCase().includes('already')) {
            // noop
          } else {
            throw e;
          }
        }
        setLikedProducts(prev => new Set([...prev, productId]));
        // Navigate to wishlist after adding
        navigate('/wishlist');
      }
    } catch (error) {
      console.error('Failed to update wishlist', error);
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">🏫 CampusFeed</h1>
        <p className="text-sm text-indigo-600 font-medium animate-fade-in" key={tagIndex}>
          {taglines[tagIndex]}
        </p>
        <p className="text-gray-600 mt-1">Your campus marketplace community</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="latest">Latest First</option>
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
      
      {/* Products Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <Link to={`/products/${product.id}`}>
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative group">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:8080${product.images[0]}`}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => handleLike(e, product.id)}
                    className={`p-2 rounded-full backdrop-blur-sm ${
                      likedProducts.has(product.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    } transition`}
                  >
                    {likedProducts.has(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-lg line-clamp-2 hover:text-indigo-600">{product.title}</h3>
              </Link>
              
              <div className="flex items-center gap-2 mt-2 mb-3">
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                {product.exchangeAllowed && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    🔄 Exchange
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <p className="text-indigo-600 font-bold text-xl">₹{product.price.toLocaleString('en-IN')}</p>
                {product.averageRating > 0 && (
                  <p className="text-yellow-500 text-sm">⭐ {product.averageRating}</p>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs">
                  {product.seller?.fullName?.charAt(0) || '?'}
                </div>
                <span className="truncate">{product.seller?.fullName || 'Seller'}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/products/${product.id}`}
                  className="text-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  View Details
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const phone = (product.seller?.phoneNumber || '').replace(/\D/g,'');
                    const msg = encodeURIComponent(`Hi ${product.seller?.fullName || ''}, I'm interested in your product: ${product.title} (₹${product.price}).`);
                    if (phone) {
                      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                    } else {
                      alert('Seller has not provided a WhatsApp number.');
                    }
                  }}
                  className="py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  💬 Chat (WhatsApp)
                </button>
              </div>

              {/* Social Stats */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
                <span>👁️ {product.viewCount} views</span>
                <span>🕐 {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search query</p>
          <Link to="/create-product" className="text-indigo-600 hover:underline font-medium">
            Or be the first to list a product! →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
