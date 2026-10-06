import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaBox } from 'react-icons/fa';

const ProductsPage = ({ products, addToCart, user, addProduct, deleteProduct, updateProduct }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    rating: 5,
    image: 'https://picsum.photos/seed/newproduct/300/200'
  });

  const categories = ['all', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  const handleAddToCart = (product) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/auth');
      return;
    }
    addToCart(product);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      _id: Date.now(),
      price: parseFloat(newProduct.price)
    });
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      rating: 5,
      image: 'https://picsum.photos/seed/newproduct/300/200'
    });
    setShowAddModal(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>All Products</h1>
        {user && user.role === 'admin' && (
          <button
            className="add-product-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="btn-icon" />
            Add Product
          </button>
        )}
      </div>

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

      {/* Products Grid */}
      <section className="products-section">
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">{product.category}</div>
                {user && user.role === 'admin' && (
                  <div className="product-actions">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="edit-btn"
                      title="Edit"
                    >
                      <FaEdit className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="delete-btn"
                      title="Delete"
                    >
                      <FaTrash className="action-icon" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <div className="product-rating">
                  <FaStar className="star-icon" />
                  <span>{product.rating}</span>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">₹{product.price}</div>
                                                {(user === null || user?.role !== 'admin') && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="add-to-cart-btn"
                  >
                    <FaShoppingCart className="cart-icon" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button
                className="close-btn"
                onClick={() => setEditingProduct(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditingProduct(null)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;