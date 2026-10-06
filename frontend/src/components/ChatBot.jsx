import { useState, useEffect } from 'react';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Load chat history from localStorage
  useEffect(() => {
    const chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
      setMessages(JSON.parse(chatHistory));
    } else {
      // Welcome message
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: 'Hello! How can I assist you today?',
          time: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateResponse(inputText.trim());
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateResponse = (userText) => {
    const lowerText = userText.toLowerCase();

    // Product-related queries
    if (lowerText.includes('product') || lowerText.includes('item') || lowerText.includes('buy')) {
      return 'You can browse our products by clicking on the "Products" tab in the navigation menu. We have a wide range of electronics, clothing, books, and home appliances.';
    }

    // Shipping queries
    if (lowerText.includes('shipping') || lowerText.includes('delivery') || lowerText.includes('track')) {
      return 'Orders are typically delivered within 2-3 business days. You can track your order by visiting the "Order Tracking" page from your profile.';
    }

    // Payment queries
    if (lowerText.includes('payment') || lowerText.includes('cod') || lowerText.includes('upi')) {
      return 'We accept UPI, credit/debit cards, and cash on delivery (COD) for all orders. COD is available on orders up to Rs. 5000.';
    }

    // Returns queries
    if (lowerText.includes('return') || lowerText.includes('refund') || lowerText.includes('exchange')) {
      return 'We have a 30-day return policy. If you are not satisfied with your purchase, you can initiate a return from your profile page. Refunds are processed within 7 business days.';
    }

    // Admin-related queries (only for admin users)
    if (user?.role === 'admin') {
      if (lowerText.includes('admin') || lowerText.includes('dashboard') || lowerText.includes('management')) {
        return 'As an admin, you can manage products, users, and orders from the admin dashboard. Click on the "Admin" link in the navigation menu to access these features.';
      }
    }

    // Default response
    return 'I understand you have a question. Please contact our support team at support@mycart.com or call us at 1800-123-4567 for further assistance.';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaComment className="toggle-icon" />
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>My Cart Support</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <FaTimes className="close-icon" />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {new Date(message.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chatbot-input-field"
            />
            <button className="chatbot-send" onClick={handleSend} disabled={!inputText.trim()}>
              <FaPaperPlane className="send-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
