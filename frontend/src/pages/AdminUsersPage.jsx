import { FaUsers, FaEdit, FaTrash, FaSearch, FaFilter, FaKey } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Admin.css';

const AdminUsersPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    permissions: {
      viewProducts: true,
      editProducts: false,
      viewUsers: false,
      editUsers: false,
      viewOrders: true,
      editOrders: false,
      viewReports: false
    }
  });

  // Load users from localStorage on initial render
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      id: editingUser ? editingUser.id : Date.now(),
      status: 'active',
      registeredAt: editingUser ? editingUser.registeredAt : new Date().toISOString().split('T')[0]
    };

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser.id ? userData : u);
    } else {
      updatedUsers = [...users, userData];
    }

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      permissions: {
        viewProducts: true,
        editProducts: false,
        viewUsers: false,
        editUsers: false,
        viewOrders: true,
        editOrders: false,
        viewReports: false
      }
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      permissions: user.permissions || {
        viewProducts: true,
        editProducts: false,
        viewUsers: false,
        editUsers: false,
        viewOrders: true,
        editOrders: false,
        viewReports: false
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      permissions: {
        viewProducts: true,
        editProducts: false,
        viewUsers: false,
        editUsers: false,
        viewOrders: true,
        editOrders: false,
        viewReports: false
      }
    });
    setIsModalOpen(true);
  };

  const handleResetPassword = (userId) => {
    const newPassword = prompt('Enter new password for the user:');
    if (newPassword) {
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            password: newPassword
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('Password reset successful');
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">
        <header className="admin-header">
          <div className="header-left">
            <h1>User Management</h1>
            <p>Manage your customer accounts</p>
          </div>
          <div className="header-right">
            <button className="add-user-btn" onClick={handleAddUser}>
              <FaUsers className="btn-icon" />
              Add User
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="role-filter">
              <FaFilter className="filter-icon" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="user-row">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{user.registeredAt}</td>
                     <td className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(user)}>
                        <FaEdit className="btn-icon" />
                      </button>
                      <button className="reset-btn" onClick={() => handleResetPassword(user.id)}>
                        <FaKey className="btn-icon" />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}>
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

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.viewProducts}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, viewProducts: e.target.checked }
                      }))}
                    />
                    <span>View Products</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.editProducts}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, editProducts: e.target.checked }
                      }))}
                    />
                    <span>Edit Products</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.viewUsers}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, viewUsers: e.target.checked }
                      }))}
                    />
                    <span>View Users</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.editUsers}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, editUsers: e.target.checked }
                      }))}
                    />
                    <span>Edit Users</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.viewOrders}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, viewOrders: e.target.checked }
                      }))}
                    />
                    <span>View Orders</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.editOrders}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, editOrders: e.target.checked }
                      }))}
                    />
                    <span>Edit Orders</span>
                  </label>
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.viewReports}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, viewReports: e.target.checked }
                      }))}
                    />
                    <span>View Reports</span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingUser ? 'Update' : 'Add'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;