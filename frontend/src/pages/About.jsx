import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="nav-container">

          <Link to="/" className="logo">

            <span className="logo-icon">
              ⌂
            </span>

            <span>
              Rent<span>Smart</span>
            </span>

          </Link>


          <div className="nav-links">

            <Link to="/">
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


          <Link
            to="/predict"
            className="nav-button"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* HERO */}

      <section className="about-hero">

        <div className="about-hero-content">

          <div className="section-label">
            ABOUT RENTSMART
          </div>

          <h1>
            Making rental decisions
            <span> smarter.</span>
          </h1>

          <p>
            RentSmart is an AI-powered rental price intelligence
            platform designed to help tenants understand rental
            prices, compare properties and make better decisions.
          </p>

        </div>

      </section>


      {/* PROBLEM */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-two-column">

            <div>

              <div className="section-label">
                THE PROBLEM
              </div>

              <h2>
                Renting a home shouldn't
                <span> be guesswork.</span>
              </h2>

            </div>

            <div>

              <p className="about-large-text">
                Rental prices can vary significantly depending
                on location, property size, amenities and market
                demand.
              </p>

              <p>
                Renters often have difficulty determining whether
                a property is fairly priced. RentSmart uses data
                and machine learning to provide a more informed
                view of rental prices.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="about-process">

        <div className="about-container">

          <div className="section-heading centered">

            <div className="section-label">
              HOW RENTSMART WORKS
            </div>

            <h2>
              From property data to
              <span> useful insights.</span>
            </h2>

          </div>


          <div className="about-steps">

            <div className="about-step">

              <div className="about-step-number">
                01
              </div>

              <h3>
                Property Data
              </h3>

              <p>
                Property information such as location, BHK,
                area, furnishing and amenities is collected.
              </p>

            </div>


            <div className="about-step">

              <div className="about-step-number">
                02
              </div>

              <h3>
                Data Analysis
              </h3>

              <p>
                Rental data is cleaned and analyzed to identify
                patterns and relationships between properties
                and prices.
              </p>

            </div>


            <div className="about-step">

              <div className="about-step-number">
                03
              </div>

              <h3>
                ML Prediction
              </h3>

              <p>
                A machine learning model estimates the expected
                rental price of a property.
              </p>

            </div>


            <div className="about-step">

              <div className="about-step-number">
                04
              </div>

              <h3>
                Smart Insights
              </h3>

              <p>
                Users receive price estimates, comparisons,
                recommendations and market insights.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="about-section">

        <div className="about-container">

          <div className="section-heading centered">

            <div className="section-label">
              WHAT RENTSMART OFFERS
            </div>

            <h2>
              One platform.
              <span> Multiple insights.</span>
            </h2>

          </div>


          <div className="about-feature-grid">

            <div className="about-feature">

              <span className="about-feature-icon">
                ₹
              </span>

              <div>

                <h3>
                  Rental Price Prediction
                </h3>

                <p>
                  Estimate the fair rental price of a property
                  using machine learning.
                </p>

              </div>

            </div>


            <div className="about-feature">

              <span className="about-feature-icon">
                ⚖
              </span>

              <div>

                <h3>
                  Property Comparison
                </h3>

                <p>
                  Compare multiple properties based on price,
                  size, amenities and value.
                </p>

              </div>

            </div>


            <div className="about-feature">

              <span className="about-feature-icon">
                ✦
              </span>

              <div>

                <h3>
                  Smart Recommendations
                </h3>

                <p>
                  Find properties that best match the user's
                  requirements and budget.
                </p>

              </div>

            </div>


            <div className="about-feature">

              <span className="about-feature-icon">
                ↗
              </span>

              <div>

                <h3>
                  Market Intelligence
                </h3>

                <p>
                  Understand rental trends and differences
                  between localities.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* TECHNOLOGY */}

      <section className="technology-section">

        <div className="about-container">

          <div className="technology-content">

            <div>

              <div className="section-label">
                TECHNOLOGY
              </div>

              <h2>
                Built with modern
                <span> technologies.</span>
              </h2>

              <p>
                RentSmart combines a modern web interface,
                backend services, databases and machine learning
                to create a complete rental intelligence system.
              </p>

            </div>


            <div className="technology-grid">

              <div>
                <strong>
                  React
                </strong>

                <span>
                  Frontend
                </span>
              </div>

              <div>
                <strong>
                  FastAPI
                </strong>

                <span>
                  Backend
                </span>
              </div>

              <div>
                <strong>
                  Python
                </strong>

                <span>
                  Machine Learning
                </span>
              </div>

              <div>
                <strong>
                  MySQL
                </strong>

                <span>
                  Database
                </span>
              </div>

              <div>
                <strong>
                  Pandas
                </strong>

                <span>
                  Data Processing
                </span>
              </div>

              <div>
                <strong>
                  Scikit-learn
                </strong>

                <span>
                  ML Models
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="about-cta">

        <div>

          <div className="section-label">
            START EXPLORING
          </div>

          <h2>
            Make your next rental
            <span> a smarter one.</span>
          </h2>

        </div>

        <Link
          to="/predict"
          className="cta-button"
        >
          Predict Rental Price
          <span>→</span>
        </Link>

      </section>


    </div>
  );
}

export default About;