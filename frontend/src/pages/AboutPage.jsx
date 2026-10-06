import { FaUsers, FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About My Cart</h1>
          <p>Your Trusted Online Shopping Destination</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              My Cart was founded in 2024 with a simple vision: to make online shopping 
              accessible, affordable, and enjoyable for everyone. We started as a small 
              team of passionate individuals who wanted to revolutionize the way people 
              shop online.
            </p>
            <p>
              Today, we've grown into a leading e-commerce platform, serving thousands 
              of customers across India. Our commitment to quality, customer satisfaction, 
              and innovation remains at the heart of everything we do.
            </p>
          </div>
          <div className="story-image">
            <img src="https://picsum.photos/seed/ecommerce-team/600/400" alt="Our Team" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaUsers className="value-icon" />
            <h3>Customer First</h3>
            <p>We prioritize our customers' needs and satisfaction above all else</p>
          </div>
          <div className="value-card">
            <FaTruck className="value-icon" />
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep</p>
          </div>
          <div className="value-card">
            <FaShieldAlt className="value-icon" />
            <h3>Secure Shopping</h3>
            <p>Your safety and security are our top priorities</p>
          </div>
          <div className="value-card">
            <FaUndo className="value-icon" />
            <h3>Easy Returns</h3>
            <p>Hassle-free return policy for your peace of mind</p>
          </div>
          <div className="value-card">
            <FaHeadset className="value-icon" />
            <h3>24/7 Support</h3>
            <p>Dedicated customer support available round the clock</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-member-image">
              <img src="https://picsum.photos/seed/team1/200/200" alt="Team Member" />
            </div>
            <h3>Shalini K J</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <div className="team-member-image">
              <img src="https://picsum.photos/seed/team2/200/200" alt="Team Member" />
            </div>
            <h3>Nandish C</h3>
            <p>Marketing Director</p>
          </div>
          <div className="team-member">
            <div className="team-member-image">
              <img src="https://picsum.photos/seed/team3/200/200" alt="Team Member" />
            </div>
            <h3>Sanjay S V</h3>
            <p>Tech Lead</p>
          </div>
          <div className="team-member">
            <div className="team-member-image">
              <img src="https://picsum.photos/seed/team4/200/200" alt="Team Member" />
            </div>
            <h3>Pretham K M</h3>
            <p>Customer Support Manager</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Cities</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">Customer Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;