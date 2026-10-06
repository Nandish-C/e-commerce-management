import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaBox, FaCreditCard, FaCalendar, FaMapPin, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const OrderTrackingPage = ({ orders = [], user }) => {
  const [selectedOrder, setSelectedOrder] = useState(0);

  if (!user || orders.length === 0) {
    return (
      <div className="order-tracking-page">
        <div className="tracking-container">
          <div className="no-orders">
            <FaBox className="no-orders-icon" />
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentOrder = orders[selectedOrder];

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // Add background color to header
    doc.setFillColor(102, 126, 234);
    doc.roundedRect(0, 0, 210, 40, 0, 0, 'F');
    
    // Set font sizes for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('My Cart Invoice', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order #${currentOrder.id}`, 14, 30);
    doc.text(`Date: ${new Date(currentOrder.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 36);

    // Customer Information with background color
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 45, 182, 40, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Information', 20, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(currentOrder.deliveryDetails.shipping.name, 20, 63);
    doc.text(currentOrder.deliveryDetails.shipping.address, 20, 70);
    doc.text(`${currentOrder.deliveryDetails.shipping.city} - ${currentOrder.deliveryDetails.shipping.pincode}`, 20, 77);
    doc.text(`Phone: ${currentOrder.deliveryDetails.shipping.phone}`, 20, 84);
    doc.text(`Email: ${currentOrder.deliveryDetails.shipping.email}`, 20, 91);

    // Payment Information with background color
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 96, 182, 25, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 20, 106);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Method: ${currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
      currentOrder.paymentMethod === 'upi' ? 'UPI' : 'Credit/Debit Card'}`, 20, 114);
    if (currentOrder.paymentMethod === 'upi' && currentOrder.upiId) {
      doc.text(`UPI ID: ${currentOrder.upiId}`, 20, 121);
    }

    // Order Items
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', 14, 130);
    
    // Table Header with background color and borders
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 135, 182, 10, 3, 3, 'F');
    doc.setDrawColor(204, 204, 204);
    doc.line(14, 135, 196, 135);
    doc.line(14, 145, 196, 145);
    doc.line(14, 135, 14, 145);
    doc.line(80, 135, 80, 145);
    doc.line(120, 135, 120, 145);
    doc.line(135, 135, 135, 145);
    doc.line(155, 135, 155, 145);
    doc.line(196, 135, 196, 145);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Product', 20, 142);
    doc.text('Category', 85, 142);
    doc.text('Qty', 125, 142);
    doc.text('Price', 140, 142);
    doc.text('Total', 160, 142);

    // Table Content with borders
    let yPos = 150;
    doc.setFont('helvetica', 'normal');
    currentOrder.items.forEach(item => {
      // Add alternating row colors
      if (currentOrder.items.indexOf(item) % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(248, 249, 250);
      }
      doc.roundedRect(14, yPos - 4, 182, 10, 2, 2, 'F');
      
      // Add cell borders
      doc.setDrawColor(204, 204, 204);
      doc.line(14, yPos - 4, 196, yPos - 4);
      doc.line(14, yPos + 6, 196, yPos + 6);
      doc.line(14, yPos - 4, 14, yPos + 6);
      doc.line(80, yPos - 4, 80, yPos + 6);
      doc.line(120, yPos - 4, 120, yPos + 6);
      doc.line(135, yPos - 4, 135, yPos + 6);
      doc.line(155, yPos - 4, 155, yPos + 6);
      doc.line(196, yPos - 4, 196, yPos + 6);
      
      doc.text(item.name.substring(0, 20) + (item.name.length > 20 ? '...' : ''), 20, yPos);
      doc.text(item.category, 85, yPos);
      doc.text(item.quantity.toString(), 125, yPos);
      doc.text(`Rs.${item.price.toFixed(2)}`, 140, yPos);
      doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 160, yPos);
      yPos += 10;
    });

    // Payment Summary with background color and borders
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, yPos + 5, 182, 45, 3, 3, 'F');
    doc.setDrawColor(204, 204, 204);
    doc.line(14, yPos + 5, 196, yPos + 5);
    doc.line(14, yPos + 50, 196, yPos + 50);
    doc.line(14, yPos + 5, 14, yPos + 50);
    doc.line(196, yPos + 5, 196, yPos + 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Summary', 20, yPos + 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal: Rs.${currentOrder.subtotal.toFixed(2)}`, 20, yPos + 23);
    doc.text(`Delivery Fee: ${currentOrder.deliveryFee === 0 ? 'Free' : `Rs.${currentOrder.deliveryFee.toFixed(2)}`}`, 20, yPos + 30);
    doc.text(`GST (18%): Rs.${(currentOrder.gstAmount || 0).toFixed(2)}`, 20, yPos + 37);
    
    // Total Amount with highlight and borders
    doc.setFillColor(102, 126, 234);
    doc.roundedRect(14, yPos + 45, 182, 12, 3, 3, 'F');
    doc.setDrawColor(204, 204, 204);
    doc.line(14, yPos + 45, 196, yPos + 45);
    doc.line(14, yPos + 57, 196, yPos + 57);
    doc.line(14, yPos + 45, 14, yPos + 57);
    doc.line(196, yPos + 45, 196, yPos + 57);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rs.${currentOrder.total.toFixed(2)}`, 20, yPos + 54);

    // Footer with company stamp
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your order!', 14, yPos + 70);
    doc.text('Deliveries typically take 2-3 business days', 14, yPos + 76);
    
    // Add company stamp
    doc.setFillColor(102, 126, 234);
    doc.roundedRect(140, yPos + 65, 56, 20, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('My Cart', 145, yPos + 74);
    doc.text('Verified ✓', 145, yPos + 80);

    // Save the PDF
    doc.save(`invoice-${currentOrder.id}.pdf`);
  };

  return (
    <div className="order-tracking-page">
      <div className="tracking-container">
        <h1>Order Tracking</h1>

        {/* Order List */}
        <div className="order-list">
          <h2>Your Orders</h2>
          <div className="order-cards">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className={`order-card ${selectedOrder === index ? 'active' : ''}`}
                onClick={() => setSelectedOrder(index)}
              >
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`order-status ${order.status}`}>
                    {order.status === 'delivered' ? 'Delivered' : 
                     order.status === 'shipped' ? 'Shipped' : 
                     order.status === 'processing' ? 'Processing' : 'Pending'}
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="item-preview">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more</div>
                  )}
                </div>
                <div className="order-total">
                  Total: ₹{order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        {currentOrder && (
          <div className="order-details">
            <div className="order-header-section">
              <div className="order-title">
                <FaBox className="order-icon" />
                <h2>Order Details</h2>
              </div>
              <button className="download-invoice-btn" onClick={handleDownloadInvoice}>
                  <FaDownload className="download-icon" />
                  Download Invoice
                </button>
            </div>

            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Order ID:</span>
                  <span className="value">{currentOrder.id}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Order Date:</span>
                  <span className="value">{new Date(currentOrder.date).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Status:</span>
                  <span className={`value status ${currentOrder.status}`}>
                    {currentOrder.status === 'delivered' ? 'Delivered' : 
                     currentOrder.status === 'shipped' ? 'Shipped' : 
                     currentOrder.status === 'processing' ? 'Processing' : 'Pending'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     currentOrder.paymentMethod === 'upi' ? 'UPI' : 'Credit/Debit Card'}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="delivery-section">
              <h3>
                <FaMapPin className="section-icon" />
                Delivery Information
              </h3>
              <div className="address-card">
                <div className="address-header">Shipping Address</div>
                <div className="address-details">
                  <div className="address-name">{currentOrder.deliveryDetails.shipping.name}</div>
                  <div className="address-phone">{currentOrder.deliveryDetails.shipping.phone}</div>
                  <div className="address-line">{currentOrder.deliveryDetails.shipping.address}</div>
                  <div className="address-city">{currentOrder.deliveryDetails.shipping.city} - {currentOrder.deliveryDetails.shipping.pincode}</div>
                </div>
              </div>

              {!currentOrder.deliveryDetails.sameAsShipping && (
                <div className="address-card">
                  <div className="address-header">Billing Address</div>
                  <div className="address-details">
                    <div className="address-name">{currentOrder.deliveryDetails.billing.name}</div>
                    <div className="address-phone">{currentOrder.deliveryDetails.billing.phone}</div>
                    <div className="address-line">{currentOrder.deliveryDetails.billing.address}</div>
                    <div className="address-city">{currentOrder.deliveryDetails.billing.city} - {currentOrder.deliveryDetails.billing.pincode}</div>
                  </div>
                </div>
              )}

              <div className="delivery-schedule">
                <h4>Delivery Date</h4>
                <div className="delivery-date">
                  <FaCalendar className="date-icon" />
                  <span>
                    {new Date(currentOrder.deliveryDetails.deliveryDate).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h3>
                <FaBox className="section-icon" />
                Order Items ({currentOrder.items.length})
              </h3>
              <div className="items-table">
                <div className="table-header">
                  <div className="item-col">Product</div>
                  <div className="quantity-col">Quantity</div>
                  <div className="price-col">Price</div>
                  <div className="total-col">Total</div>
                </div>
                <div className="table-body">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="item-col">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-category">{item.category}</div>
                        </div>
                      </div>
                      <div className="quantity-col">{item.quantity}</div>
                      <div className="price-col">₹{item.price.toFixed(2)}</div>
                      <div className="total-col">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="payment-summary">
              <h3>
                <FaCreditCard className="section-icon" />
                Payment Summary
              </h3>
              <div className="payment-details">
                <div className="payment-row">
                  <span className="label">Subtotal:</span>
                  <span className="value">₹{currentOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="payment-row">
                  <span className="label">Delivery Fee:</span>
                  <span className="value">{currentOrder.deliveryFee === 0 ? 'Free' : `₹${currentOrder.deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="payment-row">
                  <span className="label">GST (18%):</span>
                  <span className="value">₹{(currentOrder.gstAmount || 0).toFixed(2)}</span>
                </div>
                <div className="payment-row total">
                  <span className="label">Total Amount:</span>
                  <span className="value">₹{currentOrder.total.toFixed(2)}</span>
                </div>
                {currentOrder.paymentMethod === 'upi' && currentOrder.upiId && (
                  <div className="payment-row upi-details">
                    <span className="label">UPI ID:</span>
                    <span className="value">{currentOrder.upiId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="tracking-timeline">
              <h3>
                <FaTruck className="section-icon" />
                Order Tracking
              </h3>
              <div className="timeline">
                <div className={`timeline-item ${currentOrder.status === 'delivered' || currentOrder.status === 'shipped' || currentOrder.status === 'processing' ? 'completed' : ''}`}>
                  <div className="timeline-dot">
                    <FaCheckCircle className="check-icon" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Order Placed</div>
                    <div className="timeline-date">
                      {new Date(currentOrder.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${currentOrder.status === 'delivered' || currentOrder.status === 'shipped' || currentOrder.status === 'processing' ? 'completed' : ''}`}>
                  <div className="timeline-dot">
                    <FaCheckCircle className="check-icon" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Order Processed</div>
                    <div className="timeline-date">
                      {new Date(currentOrder.date.getTime() + 1000 * 60 * 30).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${currentOrder.status === 'delivered' || currentOrder.status === 'shipped' ? 'completed' : ''}`}>
                  <div className="timeline-dot">
                    <FaCheckCircle className="check-icon" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Order Shipped</div>
                    <div className="timeline-date">
                      {new Date(currentOrder.date.getTime() + 1000 * 60 * 60 * 24).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={`timeline-item ${currentOrder.status === 'delivered' ? 'completed' : ''}`}>
                  <div className="timeline-dot">
                    <FaCheckCircle className="check-icon" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Order Delivered</div>
                    <div className="timeline-date">
                      {new Date(currentOrder.date.getTime() + 1000 * 60 * 60 * 48).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
