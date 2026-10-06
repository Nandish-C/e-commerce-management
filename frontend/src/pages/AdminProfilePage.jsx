import { FaUser, FaEdit, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import './Admin.css';

const AdminProfilePage = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@nandicart.com',
    phone: '9876543210',
    role: user?.role || 'admin'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-container">
        <header className="admin-header">
          <div className="header-left">
            <h1>Admin Profile</h1>
            <p>Manage your profile settings</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <FaUser className="avatar-icon" />
                </div>
                <h2>{profileData.name}</h2>
                <p className="user-role">{profileData.role}</p>
              </div>
              <div className="profile-actions">
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit className="btn-icon" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button className="logout-btn" onClick={onLogout}>
                  <FaSignOutAlt className="btn-icon" />
                  Logout
                </button>
              </div>
            </div>

            <div className="profile-content">
              {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      required
                      disabled
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
                    <div className="detail-label">Full Name</div>
                    <div className="detail-value">{profileData.name}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email Address</div>
                    <div className="detail-value">{profileData.email}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Phone Number</div>
                    <div className="detail-value">{profileData.phone}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Role</div>
                    <div className="detail-value">{profileData.role}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Account Created</div>
                    <div className="detail-value">January 1, 2024</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="security-card">
            <h3>Security Settings</h3>
            <div className="security-section">
              <div className="security-item">
                <div className="security-info">
                  <h4>Change Password</h4>
                  <p>Update your account password</p>
                </div>
                <button className="change-password-btn">
                  <FaLock className="btn-icon" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;