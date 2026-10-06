import { FaBox, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { useState } from 'react';
import './Admin.css';

const AdminProductsPage = ({ user, onLogout, products, addProduct, deleteProduct, updateProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    rating: '',
    image: '',
    status: 'active',
    stock: 100
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock),
      status: formData.status,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      rating: '',
      image: '',
      status: 'active',
      stock: 100
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      rating: product.rating.toString(),
      image: product.image,
      status: product.status || 'active',
      stock: product.stock || 100
    });
    setIsModalOpen(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      rating: '',
      image: '',
      status: 'active',
      stock: 100
    });
    setIsModalOpen(true);
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-container">
        <header className="admin-header">
          <div className="header-left">
            <h1>Product Management</h1>
            <p>Manage your product inventory</p>
          </div>
          <div className="header-right">
            <button className="add-product-btn" onClick={handleAddProduct}>
              <FaPlus className="btn-icon" />
              Add Product
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="category-filter">
              <FaFilter className="filter-icon" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="product-row">
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.stock || 100}</td>
                    <td>
                      <span className={`status-badge ${product.status || 'active'}`}>
                        {product.status === 'active' ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>{product.createdAt || new Date().toISOString().split('T')[0]}</td>
                    <td className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(product)}>
                        <FaEdit className="btn-icon" />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                        <FaTrash className="btn-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (Rs.)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleFormChange}
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;