import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AuthPage from './pages/AuthPage'
import CartPage from './pages/CartPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminProfilePage from './pages/AdminProfilePage'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to dummy data if API fails
        setProducts([
          {
            _id: 1,
            name: 'Sample Product 1',
            description: 'This is a sample product description',
            price: 100,
            category: 'Electronics',
            rating: 5,
            image: 'https://picsum.photos/seed/product1/300/200',
            isFeatured: true
          },
          {
            _id: 2,
            name: 'Sample Product 2',
            description: 'This is another sample product',
            price: 200,
            category: 'Clothing',
            rating: 4,
            image: 'https://picsum.photos/seed/product2/300/200',
            isFeatured: false
          }
        ])
      }
    }

    fetchProducts()
  }, [])

  // Load orders from backend when user is logged in
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/user/${user._id}`)
          const data = await response.json()
          setOrders(data)
        } catch (error) {
          console.error('Error fetching orders:', error)
          setOrders([])
        }
      }
    }

    fetchOrders()
  }, [user])

  // Add to cart
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id)
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev => 
      prev.map(item => 
        item._id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Place order
  const placeOrder = async (deliveryDetails, paymentMethod, upiId) => {
    try {
      // Calculate order totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = subtotal > 500 ? 0 : 50;
      const gstRate = 0.18; // 18% GST
      const gstAmount = subtotal * gstRate;
      const total = subtotal + deliveryFee + gstAmount;

      // Prepare order data
      const orderData = {
        user: user._id,
        products: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        paymentMethod: paymentMethod,
        deliveryDetails: {
          shipping: deliveryDetails.shipping,
          billing: deliveryDetails.sameAsShipping ? deliveryDetails.shipping : deliveryDetails.billing,
          sameAsShipping: deliveryDetails.sameAsShipping,
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        status: 'pending'
      };

      // Send order to backend
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);
      
      // Clear cart after successful order
      setCartItems([]);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  // Add product (admin)
  const addProduct = (product) => {
    setProducts(prev => [...prev, product])
  }

  // Update product (admin)
  const updateProduct = (product) => {
    setProducts(prev => 
      prev.map(item => 
        item._id === product._id ? product : item
      )
    )
  }

  // Delete product (admin)
  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(item => item._id !== productId))
  }

  // Login
  const login = (userData) => {
    setUser(userData)
  }

  // Logout
  const logout = () => {
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Navbar 
          user={user} 
          onLogout={logout} 
          cartItems={cartItems} 
        />
        <Routes>
          <Route path="/" element={<HomePage 
            products={products} 
            addToCart={addToCart} 
            user={user} 
          />} />
          <Route path="/products" element={<ProductsPage 
            products={products} 
            addToCart={addToCart} 
            user={user} 
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage onLogin={login} />} />
          <Route path="/cart" element={<CartPage 
            cartItems={cartItems} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            clearCart={clearCart} 
            placeOrder={placeOrder}
          />} />
          <Route path="/order-tracking" element={<OrderTrackingPage user={user} orders={orders} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/admin" element={<AdminDashboardPage user={user} />} />
          <Route path="/admin/products" element={<AdminProductsPage 
            products={products} 
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage user={user} orders={orders} />} />
          <Route path="/admin/profile" element={<AdminProfilePage user={user} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
