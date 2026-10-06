import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you! Feel free to reach out to us.</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Information */}
        <section className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Address</h3>
            <p>123 Shopping Complex,<br />
            Main Road, Opposite Railway Station<br />
            Mumbai, Maharashtra 400001</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaPhone />
            </div>
            <h3>Phone</h3>
            <p>
              <a href="tel:+911234567890">+91 12345 67890</a><br />
              <a href="tel:+919876543210">+91 98765 43210</a>
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>
              <a href="mailto:info@nandicart.com">info@nandicart.com</a><br />
              <a href="mailto:support@nandicart.com">support@nandicart.com</a>
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <h3>Working Hours</h3>
            <p>
              Monday - Saturday: 9:00 AM - 8:00 PM<br />
              Sunday: 10:00 AM - 6:00 PM
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="form-container">
            <h2>Send Us a Message</h2>
            
            {submitSuccess && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>Thank you for contacting us! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Enter your message"
                  rows="5"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <FaPaperPlane className="submit-icon" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Map Section */}
      <section className="map-section">
        <h2>Our Location</h2>
        <div className="map-container">
          {/* Embedded Google Map */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.7544505337036!2d72.83428131488288!3d19.084153655347714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8593d39e33b%3A0x8927c78a2ef82e65!2sChhatrapati%20Shivaji%20Terminus!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>How long does delivery take?</h3>
            <p>We aim to deliver your order within 2-3 working days. Delivery times may vary based on your location.</p>
          </div>
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>You can return most items within 30 days of delivery. Please check our return policy for details.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer cash on delivery?</h3>
            <p>Yes, we offer cash on delivery for orders below ₹5000 in select cities.</p>
          </div>
          <div className="faq-item">
            <h3>How can I track my order?</h3>
            <p>You can track your order in the 'My Orders' section of your account dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;