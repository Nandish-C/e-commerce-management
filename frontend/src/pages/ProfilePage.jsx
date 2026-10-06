import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaHistory, FaSignOutAlt, FaAddressCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const ProfilePage = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated user data to the backend
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-content">
          {/* Profile Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <FaUser className="avatar-icon" />
              </div>
              <h2>{user?.name || 'Guest User'}</h2>
              <p className="user-role">{user?.role || 'Customer'}</p>
            </div>
            
            <div className="profile-menu">
              <Link to="/profile" className="menu-item active">
                <FaUser className="menu-icon" />
                <span>Profile</span>
              </Link>
<Link to="/order-tracking" className="menu-item">
                 <FaHistory className="menu-icon" />
                 <span>Order History</span>
               </Link>
              <button className="menu-item logout" onClick={onLogout}>
                <FaSignOutAlt className="menu-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-main">
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    <FaEdit className="edit-icon" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">
                      <FaUser className="input-icon" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone className="input-icon" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      <FaAddressCard className="input-icon" />
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Full Name</div>
                      <div className="detail-value">{userData.name}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Email</div>
                      <div className="detail-value">{userData.email}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Phone Number</div>
                      <div className="detail-value">{userData.phone || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaAddressCard className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Address</div>
                      <div className="detail-value">{userData.address || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Change Password</h3>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className="setting-btn">Change</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Notification Preferences</h3>
                    <p>Manage your email and push notifications</p>
                  </div>
                  <button className="setting-btn">Manage</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Privacy Settings</h3>
                    <p>Control how your data is used and shared</p>
                  </div>
                  <button className="setting-btn">Configure</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="setting-btn danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
