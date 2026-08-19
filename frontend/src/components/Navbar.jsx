import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return "active";
    if (path !== "/" && pathname.startsWith(path)) return "active";
    return "";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">⌂</span>
          <span>
            Rent<span>Smart</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/predict" className={isActive("/predict")}>
            Predict Rent
          </Link>
          <Link to="/compare" className={isActive("/compare")}>
            Compare
          </Link>
          <Link to="/recommendations" className={isActive("/recommendations")}>
            Recommendations
          </Link>
          <Link to="/market" className={isActive("/market")}>
            Market
          </Link>
          <Link to="/about" className={isActive("/about")}>
            About
          </Link>
        </div>

        <Link to="/predict" className="nav-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
