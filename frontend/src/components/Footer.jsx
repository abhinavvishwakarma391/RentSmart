import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">⌂</span>
            <span>
              Rent<span>Smart</span>
            </span>
          </div>
          <p>
            Smarter rental decisions powered by machine learning, fair price intelligence, and real market data.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <Link to="/predict">Predict Fair Rent</Link>
            <Link to="/compare">Compare Properties</Link>
            <Link to="/recommendations">Smart Recommendations</Link>
          </div>

          <div>
            <h4>Explore</h4>
            <Link to="/market">Market Intelligence</Link>
            <Link to="/about">About RentSmart</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 RentSmart. AI-Powered Rental Price Intelligence System.
      </div>
    </footer>
  );
}

export default Footer;
