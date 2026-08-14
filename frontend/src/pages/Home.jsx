import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-container">

          <Link to="/" className="logo">
            <span className="logo-icon">⌂</span>
            <span>Rent<span>Smart</span></span>
          </Link>

          <div className="nav-links">
            <Link to="/" className="active">
              Home
            </Link>

            <Link to="/predict">
              Predict Rent
            </Link>

            <Link to="/compare">
              Compare
            </Link>

            <Link to="/recommendations">
              Recommendations
            </Link>

            <Link to="/market">
              Market
            </Link>
          </div>

          <Link to="/predict" className="nav-button">
            Get Started
          </Link>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="hero">

        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              <span>✦</span>
              AI-Powered Rental Intelligence
            </div>

            <h1>
              Find the right rent.
              <br />
              <span>Make the smarter choice.</span>
            </h1>

            <p className="hero-description">
              RentSmart helps you predict fair rental prices, compare
              properties, analyze local markets, and find the best
              property for your budget.
            </p>

            <div className="hero-buttons">

              <Link to="/predict" className="primary-button">
                Predict Rent
                <span>→</span>
              </Link>

              <Link to="/compare" className="secondary-button">
                Compare Properties
              </Link>

            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <strong>AI</strong>
                <span>Price Prediction</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Smart</strong>
                <span>Recommendations</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Data</strong>
                <span>Driven Insights</span>
              </div>
            </div>

          </div>


          {/* ================= HERO CARD ================= */}
          <div className="hero-visual">

            <div className="floating-card card-top">
              <span className="mini-icon green">✓</span>
              <div>
                <strong>Fair Price</strong>
                <small>AI verified</small>
              </div>
            </div>


            <div className="property-preview">

              <div className="property-image">
                <div className="image-overlay"></div>

                <div className="property-tag">
                  Featured Property
                </div>

                <div className="property-location">
                  📍 Raipur, Chhattisgarh
                </div>
              </div>

              <div className="property-info">

                <div className="property-title-row">
                  <div>
                    <h3>Modern 2 BHK Apartment</h3>
                    <p>Near City Center</p>
                  </div>

                  <div className="property-price">
                    ₹14.5K
                    <small>/month</small>
                  </div>
                </div>

                <div className="property-details">
                  <span>🛏 2 BHK</span>
                  <span>📐 950 sq.ft</span>
                  <span>🚗 Parking</span>
                </div>

                <div className="price-analysis">

                  <div>
                    <small>Estimated Fair Rent</small>
                    <strong>₹14,200</strong>
                  </div>

                  <div className="good-value">
                    <span>✓</span>
                    Good Value
                  </div>

                </div>

              </div>

            </div>


            <div className="floating-card card-bottom">

              <div className="score-circle">
                94%
              </div>

              <div>
                <strong>Great Match</strong>
                <small>Based on your preferences</small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features-section">

        <div className="section-container">

          <div className="section-heading">

            <div className="section-label">
              WHY RENTSMART
            </div>

            <h2>
              Everything you need to
              <span> rent smarter.</span>
            </h2>

            <p>
              Make rental decisions using data instead of guesswork.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon blue">
                ₹
              </div>

              <h3>Fair Price Prediction</h3>

              <p>
                Get an AI-estimated rental price based on property
                features and market data.
              </p>

              <Link to="/predict">
                Predict your rent →
              </Link>

            </div>


            <div className="feature-card">

              <div className="feature-icon purple">
                ◈
              </div>

              <h3>Property Comparison</h3>

              <p>
                Compare properties based on rent, size, location,
                amenities and overall value.
              </p>

              <Link to="/compare">
                Compare properties →
              </Link>

            </div>


            <div className="feature-card">

              <div className="feature-icon green">
                ✓
              </div>

              <h3>Smart Recommendations</h3>

              <p>
                Find properties that match your budget, requirements
                and preferences.
              </p>

              <Link to="/recommendations">
                Find your match →
              </Link>

            </div>


            <div className="feature-card">

              <div className="feature-icon orange">
                ↗
              </div>

              <h3>Market Intelligence</h3>

              <p>
                Explore rental trends, locality prices and market
                insights through interactive analytics.
              </p>

              <Link to="/market">
                Explore market →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">

        <div className="section-container">

          <div className="section-heading centered">

            <div className="section-label">
              HOW IT WORKS
            </div>

            <h2>
              Rental decisions made
              <span> simple.</span>
            </h2>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <h3>Enter Property Details</h3>

              <p>
                Tell us about the property, location, size and
                amenities.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <h3>Let AI Analyze</h3>

              <p>
                RentSmart analyzes the property against rental
                market data.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <h3>Make a Better Decision</h3>

              <p>
                Get a fair price, comparison and personalized
                recommendation.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-container">

          <div>
            <span className="cta-label">
              READY TO START?
            </span>

            <h2>
              Find a rental that
              <br />
              actually makes sense.
            </h2>
          </div>

          <Link to="/predict" className="cta-button">
            Predict Rental Price
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="logo">
              <span className="logo-icon">⌂</span>
              <span>Rent<span>Smart</span></span>
            </div>

            <p>
              Smarter rental decisions powered by data and AI.
            </p>

          </div>


          <div className="footer-links">

            <div>
              <h4>Product</h4>
              <Link to="/predict">Predict Rent</Link>
              <Link to="/compare">Compare</Link>
              <Link to="/recommendations">Recommendations</Link>
            </div>

            <div>
              <h4>Explore</h4>
              <Link to="/market">Market Analysis</Link>
              <Link to="/about">About</Link>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          © 2026 RentSmart. Built with Data & AI.
        </div>

      </footer>

    </div>
  );
}

export default Home;