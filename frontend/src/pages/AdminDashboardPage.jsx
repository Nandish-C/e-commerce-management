import { FaChartLine, FaBox, FaUsers, FaTruck, FaChartBar, FaTasks, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import './Admin.css';

const AdminDashboardPage = ({ user, onLogout }) => {
  // Load all dashboard stats from localStorage once, via a lazy initializer
  // (avoids setState inside an effect, which triggers cascading renders)
  const [stats] = useState(() => {
    let orders = [];
    let products = [];
    let users = [];
    try {
      const savedOrders = localStorage.getItem('orders');
      const savedProducts = localStorage.getItem('products');
      const savedUsers = localStorage.getItem('users');
      if (savedOrders) orders = JSON.parse(savedOrders) || [];
      if (savedProducts) products = JSON.parse(savedProducts) || [];
      if (savedUsers) users = JSON.parse(savedUsers) || [];
    } catch {
      // Ignore malformed localStorage data
    }
    return {
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      recentOrders: [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4),
      totalProducts: products.length,
      totalCustomers: users.length,
    };
  });

  const { totalSales, totalProducts, totalCustomers, totalOrders, recentOrders } = stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <header className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <div className="header-right">
            <button onClick={onLogout} className="logout-btn">
              <FaSignOutAlt className="btn-icon" />
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-info">
                <h3>Total Sales</h3>
                <p className="stat-value">{formatCurrency(totalSales)}</p>
                <p className="stat-change positive">+12% from last month</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaBox />
              </div>
              <div className="stat-info">
                <h3>Products</h3>
                <p className="stat-value">{totalProducts}</p>
                <p className="stat-change positive">+3 new this week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>Customers</h3>
                <p className="stat-value">{totalCustomers}</p>
                <p className="stat-change positive">+5% this week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaTruck />
              </div>
              <div className="stat-info">
                <h3>Orders</h3>
                <p className="stat-value">{totalOrders}</p>
                <p className="stat-change negative">-2% from last week</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>Recent Orders</h2>
              <div className="recent-orders">
                {recentOrders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <div className="order-id">#{order.id}</div>
                      <div className="order-customer">{order.customerName || 'Unknown Customer'}</div>
                    </div>
                    <div className={`order-status ${order.status}`}>{order.status || 'Pending'}</div>
                    <div className="order-amount">{formatCurrency(order.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => window.location.href = '/admin/products'}>
                  <FaBox className="action-icon" />
                  <span>Add Product</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/users'}>
                  <FaUsers className="action-icon" />
                  <span>View Customers</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/orders'}>
                  <FaTruck className="action-icon" />
                  <span>Manage Orders</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/profile'}>
                  <FaCog className="action-icon" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            <div className="dashboard-card full-width">
              <h2>Sales Overview</h2>
              <div className="sales-chart">
                <div className="chart-placeholder">
                  <FaChartBar className="chart-icon" />
                  <p>Sales chart will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;