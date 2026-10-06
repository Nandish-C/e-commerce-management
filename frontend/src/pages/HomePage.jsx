import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaSearch, FaFilter } from 'react-icons/fa';

const HomePage = ({ products, addToCart, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to My Cart</h1>
          <p>Discover amazing products at incredible prices</p>
          <Link to="/products" className="hero-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-filter">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {filteredProducts.slice(0, 8).map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">{product.category}</div>
              </div>
              <div className="product-info">
                <div className="product-rating">
                  <FaStar className="star-icon" />
                  <span>{product.rating}</span>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">₹{product.price}</div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                >
                  <FaShoppingCart className="cart-icon" />
                  {user ? 'Add to Cart' : 'Login to Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}

        {filteredProducts.length > 8 && (
          <div className="view-all-container">
            <Link to="/products" className="view-all-btn">
              View All Products
            </Link>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.filter(cat => cat !== 'all').map(category => (
            <div key={category} className="category-card">
              <div className="category-icon">
                {category === 'Electronics' && <i className="fas fa-laptop"></i>}
                {category === 'Clothing' && <i className="fas fa-tshirt"></i>}
                {category === 'Books' && <i className="fas fa-book"></i>}
                {category === 'Home & Kitchen' && <i className="fas fa-home"></i>}
              </div>
              <h3>{category}</h3>
              <Link to="/products" className="category-link">
                Shop Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Free Delivery</h3>
            <p>On orders above ₹500</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-undo"></i>
            </div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>24/7 Support</h3>
            <p>Customer support available</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;