import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaMailBulk, FaPhone, FaShoppingCart, FaGoogle, FaFacebookF, FaTwitter, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { API_BASE } from '../config';

const AuthPage = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sync user with backend to get a persistent _id
  const syncUserWithBackend = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || ''
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data._id) {
          return { ...userData, _id: result.data._id };
        }
      }
    } catch (error) {
      console.error('User sync failed:', error);
    }
    return userData;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data:', loginData);
    
    // Admin login
    if (loginData.email === 'admin@nandicart.com' && loginData.password === 'admin123') {
      const adminUser = await syncUserWithBackend({
        name: 'Admin User',
        email: 'admin@nandicart.com',
        role: 'admin'
      });
      onLogin(adminUser);
      navigate('/');
      return;
    }
    
    // Check registered users
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = existingUsers.find(
      u => u.email === loginData.email && u.password === loginData.password
    );
    
    if (user) {
      const syncedUser = await syncUserWithBackend({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
      onLogin(syncedUser);
      navigate('/');
    } else {
      alert('Invalid credentials! Please check your email and password.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Register Data:', registerData);
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === registerData.email);
    
    if (userExists) {
      alert('Email already registered! Please use a different email.');
      return;
    }
    
    // Create new user
    const newUser = {
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      role: 'user'
    };
    
    // Save to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Sync with backend to get persistent id
    syncUserWithBackend({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    }).catch(err => console.error('User sync failed:', err));
    
    // Show success message
    setShowSuccess(true);
    
    // Clear form
    setRegisterData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    
    // Redirect to login after successful registration
    setTimeout(() => {
      setShowSuccess(false);
      setShowRegister(false);
    }, 3000);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-container-modern">
        {/* Brand Section */}
        <div className="auth-brand-section">
          <div className="brand-logo">
            <FaShoppingCart className="brand-icon" />
            <span>My Cart</span>
          </div>
          <h1>Welcome to My Cart</h1>
          <p>Your trusted online shopping destination</p>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">🛍️</span>
              <span>Wide Range of Products</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Forms Container */}
        <div className={`auth-forms-container ${showRegister ? 'show-register' : ''}`}>
          {/* Success Message */}
          {showSuccess && (
            <div className="success-toast">
              <span>🎉</span> Registration Successful! Welcome to My Cart!
            </div>
          )}

          {/* Login Form */}
          <div className="auth-card login-card">
            <div className="card-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>
            
            <form className="auth-form-modern" onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <div className="input-wrapper">
                  <FaMailBulk className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" className="submit-btn-modern login-btn">
                Sign In
                <FaArrowRight className="btn-arrow" />
              </button>
            </form>

            <div className="switch-mode">
              <p>Don't have an account? <span onClick={() => setShowRegister(true)}>Sign Up</span></p>
            </div>
          </div>

          {/* Register Form */}
          <div className="auth-card register-card">
            <div className="card-header">
              <h2>Create Account</h2>
              <p>Join us and start shopping today</p>
            </div>
            
            <form className="auth-form-modern" onSubmit={handleRegisterSubmit}>
              <div className="input-group">
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaMailBulk className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn-modern register-btn">
                Create Account
                <FaArrowRight className="btn-arrow" />
              </button>
            </form>

            <div className="switch-mode">
              <p>Already have an account? <span onClick={() => setShowRegister(false)}>Sign In</span></p>
            </div>
          </div>

          {/* Toggle Button */}
          <button 
            className={`toggle-btn ${showRegister ? 'to-login' : 'to-register'}`}
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
