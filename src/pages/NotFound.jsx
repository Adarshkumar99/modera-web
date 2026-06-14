// NotFound.jsx — 404 page for all unmatched routes
import { Link } from "react-router-dom";
import "../styles/Legal.css";

export default function NotFound() {
  return (
    <div className="legal-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="notfound-container">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary">Go to Home</Link>
          <Link to="/dashboard" className="notfound-btn-secondary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
