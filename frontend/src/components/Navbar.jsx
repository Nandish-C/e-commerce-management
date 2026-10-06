import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHome, FaInfo, FaBox, FaMailBulk, FaHistory, FaChartLine, FaUsers, FaTruck, FaCog } from 'react-icons/fa';

const Navbar = ({ user, onLogout, cartItems = [] }) => {
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="logo">
          <FaShoppingCart className="logo-icon" />
          My Cart
        </Link>
        
        <div className="nav-links">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="nav-link">
                <FaChartLine className="nav-icon" />
                Dashboard
              </Link>
              <Link to="/admin/products" className="nav-link">
                <FaBox className="nav-icon" />
                Products
              </Link>
              <Link to="/admin/users" className="nav-link">
                <FaUsers className="nav-icon" />
                Users
              </Link>
              <Link to="/admin/orders" className="nav-link">
                <FaTruck className="nav-icon" />
                Orders
              </Link>
              <Link to="/admin/profile" className="nav-link">
                <FaCog className="nav-icon" />
                Admin Profile
              </Link>
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <FaUser className="nav-icon" />
                <div className="user-dropdown">
                  <Link to="/admin/profile" className="dropdown-item">Admin Profile</Link>
                  <button onClick={onLogout} className="dropdown-item logout">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                <FaHome className="nav-icon" />
                Home
              </Link>
              <Link to="/about" className="nav-link">
                <FaInfo className="nav-icon" />
                About
              </Link>
              <Link to="/products" className="nav-link">
                <FaBox className="nav-icon" />
                Products
              </Link>
              <Link to="/contact" className="nav-link">
                <FaMailBulk className="nav-icon" />
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link to="/cart" className="nav-link cart-link">
                    <FaShoppingCart className="nav-icon" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link>
<Link to="/order-tracking" className="nav-link">
                     <FaHistory className="nav-icon" />
                     Orders
                   </Link>
                  <div className="user-menu">
                    <span className="user-name">{user.name}</span>
                    <FaUser className="nav-icon" />
                    <div className="user-dropdown">
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                      <Link to="/orders" className="dropdown-item">Order History</Link>
                      <button onClick={onLogout} className="dropdown-item logout">Logout</button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/auth" className="nav-link auth">
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