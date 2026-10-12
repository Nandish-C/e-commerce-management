import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHome, FaInfo, FaBox, FaMailBulk, FaHistory, FaChartLine, FaUsers, FaTruck, FaCog, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ user, onLogout, cartItems = [] }) => {
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
   
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="logo">
          <FaShoppingCart className="logo-icon" />
          My Cart
        </Link>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaChartLine className="nav-icon" />
                Dashboard
              </Link>
              <Link to="/admin/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaBox className="nav-icon" />
                Products
              </Link>
              <Link to="/admin/users" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaUsers className="nav-icon" />
                Users
              </Link>
              <Link to="/admin/orders" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaTruck className="nav-icon" />
                Orders
              </Link>
              <Link to="/admin/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaCog className="nav-icon" />
                Admin Profile
              </Link>
              <div className="user-menu">
                <button 
                  className="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="user-name">{user.name}</span>
                  <FaUser className="nav-icon" />
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/admin/profile" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}>Admin Profile</Link>
                    <button onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); onLogout(); }} className="dropdown-item logout">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaHome className="nav-icon" />
                Home
              </Link>
              <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaInfo className="nav-icon" />
                About
              </Link>
              <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaBox className="nav-icon" />
                Products
              </Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaMailBulk className="nav-icon" />
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaShoppingCart className="nav-icon" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link>
                  <Link to="/order-tracking" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaHistory className="nav-icon" />
                    Orders
                  </Link>
                  <div className="user-menu">
                    <button 
                      className="user-menu-btn"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      aria-expanded={isUserMenuOpen}
                    >
                      <span className="user-name">{user.name}</span>
                      <FaUser className="nav-icon" />
                    </button>
                    {isUserMenuOpen && (
                      <div className="user-dropdown">
                        <Link to="/profile" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}>Profile</Link>
                        <Link to="/orders" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}>Order History</Link>
                        <button onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); onLogout(); }} className="dropdown-item logout">Logout</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/auth" className="nav-link auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUser className="nav-icon" />
                  Login/Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;