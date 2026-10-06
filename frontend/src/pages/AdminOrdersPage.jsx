import { FaTruck, FaBox, FaFilter, FaSearch, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Admin.css';

const AdminOrdersPage = ({ user, onLogout, orders = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    total: '',
    status: 'pending',
    paymentMethod: 'UPI',
    items: []
  });



  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const statusLabels = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        // Update delivery date if shipped or delivered
        if (newStatus === 'shipped' && !updatedOrder.deliveryDate) {
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
          updatedOrder.deliveryDate = deliveryDate.toISOString().split('T')[0];
        } else if (newStatus === 'delivered') {
          updatedOrder.deliveryDate = new Date().toISOString().split('T')[0];
        }
        return updatedOrder;
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    alert(`Order status updated to ${statusLabels[newStatus]}`);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      id: editingOrder ? editingOrder.id : Date.now(),
      date: editingOrder ? editingOrder.date : new Date(),
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      total: parseFloat(formData.total),
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      orderDate: editingOrder ? editingOrder.orderDate : new Date().toISOString().split('T')[0],
      deliveryDate: editingOrder ? editingOrder.deliveryDate : null,
      items: formData.items.length > 0 ? formData.items : [{ name: 'Default Product', quantity: 1, price: parseFloat(formData.total) }]
    };

    let updatedOrders;
    if (editingOrder) {
      updatedOrders = orders.map(o => o.id === editingOrder.id ? orderData : o);
    } else {
      updatedOrders = [...orders, orderData];
    }

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      total: '',
      status: 'pending',
      paymentMethod: 'UPI',
      items: []
    });
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      total: order.total.toString(),
      status: order.status,
      paymentMethod: order.paymentMethod,
      items: order.items || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      total: '',
      status: 'pending',
      paymentMethod: 'UPI',
      items: []
    });
    setIsModalOpen(true);
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        <header className="admin-header">
          <div className="header-left">
            <h1>Order Management</h1>
            <p>Manage and track customer orders</p>
          </div>
          <div className="header-right">
            <button className="add-order-btn" onClick={handleAddOrder}>
              <FaTruck className="btn-icon" />
              Add Order
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="status-filter">
              <FaFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="order-row">
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>Rs. {order.total}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.orderDate || order.date.toISOString().split('T')[0]}</td>
                    <td>{order.deliveryDate}</td>
                    <td className="action-buttons">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="status-select"
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <button className="edit-btn" onClick={() => handleEdit(order)}>
                        <FaEdit className="btn-icon" />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(order.id)}>
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

      {/* Add/Edit Order Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrder ? 'Edit Order' : 'Add Order'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="total">Total (Rs.)</label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  value={formData.total}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
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
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleFormChange}
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingOrder ? 'Update' : 'Add'} Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;