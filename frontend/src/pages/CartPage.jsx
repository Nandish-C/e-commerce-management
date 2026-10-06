import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCreditCard, FaTruck, FaHome, FaUser, FaMapPin } from 'react-icons/fa';

const CartPage = ({ cartItems, updateQuantity, removeFromCart, clearCart, placeOrder }) => {
  const [step, setStep] = useState(1);
  const [deliveryDetails, setDeliveryDetails] = useState({
    shipping: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: ''
    },
    billing: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: ''
    },
    sameAsShipping: true,
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 2 days from now
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const total = subtotal + deliveryFee + gstAmount;

  // Calculate delivery date (2-3 business days)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
  };

  const handleDeliveryChange = (e, type) => {
    const { name, value, type: inputType, checked } = e.target;
    setDeliveryDetails(prev => {
      const newValue = inputType === 'checkbox' ? checked : value;
      
      if (type) {
        return {
          ...prev,
          [type]: {
            ...prev[type],
            [name]: newValue
          }
        };
      }
      
      return {
        ...prev,
        [name]: newValue
      };
    });
  };

  const handleSameAsShippingChange = (e) => {
    const { checked } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      sameAsShipping: checked,
      billing: checked ? { ...prev.shipping } : prev.billing
    }));
  };

  const handlePlaceOrder = () => {
    if (step === 1) {
      // Validate delivery details
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
      const missingFields = [];

      // Validate shipping address
      requiredFields.forEach(field => {
        if (!deliveryDetails.shipping[field]) {
          missingFields.push(`Shipping ${field}`);
        }
      });

      // Validate billing address if different from shipping
      if (!deliveryDetails.sameAsShipping) {
        requiredFields.forEach(field => {
          if (!deliveryDetails.billing[field]) {
            missingFields.push(`Billing ${field}`);
          }
        });
      }
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      // Validate payment details
      if (paymentMethod === 'upi' && !upiId) {
        alert('Please enter your UPI ID');
        return;
      }
      
      // Process payment
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        placeOrder(deliveryDetails, paymentMethod, upiId);
        setOrderSuccess(true);
      }, 1500);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="success-container">
          <div className="success-icon-large">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been placed successfully. We will deliver it according to your selected schedule.</p>
          <div className="delivery-schedule">
            <FaTruck className="delivery-icon" />
            <p>Delivery on: <strong>{formatDate(deliveryDetails.deliveryDate)}</strong></p>
          </div>
<Link to="/order-tracking" className="continue-shopping-btn">
             View Order Details
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>
          <FaShoppingCart className="cart-title-icon" />
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <Link to="/products" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <h2>Cart Items ({cartItems.length})</h2>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-category">{item.category}</div>
                      <div className="item-price">₹{item.price.toFixed(2)}</div>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="label">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="value">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Delivery Fee</span>
                  <span className="value">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span className="label">GST (18%)</span>
                  <span className="value">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span className="label">Total</span>
                  <span className="value">₹{total.toFixed(2)}</span>
                </div>
              </div>

               {/* Delivery Details */}
              {step === 1 && (
                <div className="delivery-section">
                  <h3>
                    <FaTruck className="section-icon" />
                    Delivery Details
                  </h3>
                  <form className="delivery-form">
                    {/* Shipping Address */}
                    <div className="address-section">
                      <h4>Shipping Address</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label><FaUser className="input-icon" /> Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={deliveryDetails.shipping.name}
                            onChange={(e) => handleDeliveryChange(e, 'shipping')}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label><FaMapPin className="input-icon" /> Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={deliveryDetails.shipping.phone}
                            onChange={(e) => handleDeliveryChange(e, 'shipping')}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label><FaCreditCard className="input-icon" /> Email</label>
                        <input
                          type="email"
                          name="email"
                          value={deliveryDetails.shipping.email}
                          onChange={(e) => handleDeliveryChange(e, 'shipping')}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label><FaHome className="input-icon" /> Address</label>
                        <textarea
                          name="address"
                          value={deliveryDetails.shipping.address}
                          onChange={(e) => handleDeliveryChange(e, 'shipping')}
                          placeholder="Enter your complete address"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={deliveryDetails.shipping.city}
                            onChange={(e) => handleDeliveryChange(e, 'shipping')}
                            placeholder="Enter your city"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={deliveryDetails.shipping.pincode}
                            onChange={(e) => handleDeliveryChange(e, 'shipping')}
                            placeholder="Enter pincode"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Same as Shipping Checkbox */}
                    <div className="same-address-check">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={deliveryDetails.sameAsShipping}
                          onChange={handleSameAsShippingChange}
                        />
                        <span>Billing address same as shipping address</span>
                      </label>
                    </div>

                    {/* Billing Address */}
                    {!deliveryDetails.sameAsShipping && (
                      <div className="address-section">
                        <h4>Billing Address</h4>
                        <div className="form-row">
                          <div className="form-group">
                            <label><FaUser className="input-icon" /> Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={deliveryDetails.billing.name}
                              onChange={(e) => handleDeliveryChange(e, 'billing')}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label><FaMapPin className="input-icon" /> Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={deliveryDetails.billing.phone}
                              onChange={(e) => handleDeliveryChange(e, 'billing')}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label><FaCreditCard className="input-icon" /> Email</label>
                          <input
                            type="email"
                            name="email"
                            value={deliveryDetails.billing.email}
                            onChange={(e) => handleDeliveryChange(e, 'billing')}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label><FaHome className="input-icon" /> Address</label>
                          <textarea
                            name="address"
                            value={deliveryDetails.billing.address}
                            onChange={(e) => handleDeliveryChange(e, 'billing')}
                            placeholder="Enter your complete address"
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              type="text"
                              name="city"
                              value={deliveryDetails.billing.city}
                              onChange={(e) => handleDeliveryChange(e, 'billing')}
                              placeholder="Enter your city"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Pincode</label>
                            <input
                              type="text"
                              name="pincode"
                              value={deliveryDetails.billing.pincode}
                              onChange={(e) => handleDeliveryChange(e, 'billing')}
                              placeholder="Enter pincode"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label>Delivery Date</label>
                      <input
                        type="text"
                        value={formatDate(deliveryDetails.deliveryDate)}
                        readOnly
                        className="delivery-date-input"
                        placeholder="Delivery date"
                      />
                    </div>
                  </form>
                </div>
              )}

               {/* Payment Methods */}
              {step === 2 && (
                <div className="payment-section">
                  <h3>
                    <FaCreditCard className="section-icon" />
                    Payment Method
                  </h3>
                  <div className="payment-methods">
                    <div
                      className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="payment-radio">
                        <input
                          type="radio"
                          id="cod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                      </div>
                      <div className="payment-info">
                        <h4>Cash on Delivery</h4>
                        <p>Pay with cash when you receive your order</p>
                      </div>
                    </div>
                    <div
                      className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="payment-radio">
                        <input
                          type="radio"
                          id="upi"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                        />
                      </div>
                      <div className="payment-info">
                        <h4>UPI (Unified Payments Interface)</h4>
                        <p>Pay using any UPI app (Google Pay, PhonePe, Paytm)</p>
                      </div>
                    </div>
                    <div
                      className={`payment-method ${paymentMethod === 'qr' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('qr')}
                    >
                      <div className="payment-radio">
                        <input
                          type="radio"
                          id="qr"
                          value="qr"
                          checked={paymentMethod === 'qr'}
                          onChange={() => setPaymentMethod('qr')}
                        />
                      </div>
                      <div className="payment-info">
                        <h4>QR Code Payment</h4>
                        <p>Scan QR code to pay using any UPI app</p>
                      </div>
                    </div>
                  </div>

                  {/* UPI ID Input */}
                  {paymentMethod === 'upi' && (
                    <div className="upi-input-container">
                      <div className="form-group">
                        <label>UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your UPI ID (e.g., user@upi)"
                          className="upi-input"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* QR Code Display */}
                  {paymentMethod === 'qr' && (
                    <div className="qr-code-container">
                      <div className="qr-code">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=nandishnandi571@oksbi&pn=MyCart&am=100.00&cu=INR" 
                          alt="UPI QR Code"
                          className="qr-code-image"
                        />
                      </div>
                      <p className="qr-code-text">Scan to pay ₹{total.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Progress */}
              <div className="order-progress">
                <div className="progress-steps">
                  <div
                    className={`progress-step ${step >= 1 ? 'active' : ''}`}
                  >
                    <div className="step-number">1</div>
                    <div className="step-label">Delivery Details</div>
                  </div>
                  <div
                    className={`progress-step ${step >= 2 ? 'active' : ''}`}
                  >
                    <div className="step-number">2</div>
                    <div className="step-label">Payment</div>
                  </div>
                  <div
                    className={`progress-step ${step >= 3 ? 'active' : ''}`}
                  >
                    <div className="step-number">3</div>
                    <div className="step-label">Confirmation</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cart-actions">
                <Link to="/products" className="continue-shopping">
                  Continue Shopping
                </Link>
                <button
                  onClick={handlePlaceOrder}
                  className="place-order-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : step === 1 ? (
                    'Proceed to Payment'
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;