import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page" style={{ padding: "100px 28px", textAlign: "center", minHeight: "60vh" }}>
      <div className="section-container" style={{ maxWidth: "600px", margin: "auto" }}>
        <div style={{ fontSize: "64px", fontWeight: "800", color: "#3461ff", marginBottom: "16px" }}>
          404
        </div>
        <h1 style={{ fontSize: "32px", color: "#172033", marginBottom: "16px" }}>
          Page Not Found
        </h1>
        <p style={{ color: "#697386", fontSize: "16px", marginBottom: "32px" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="primary-button" style={{ display: "inline-flex" }}>
          Return to Home →
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
