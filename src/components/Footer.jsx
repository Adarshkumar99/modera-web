// Footer.jsx — Production-ready footer with legal links
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sl-footer">

      {/* ── Brand ── */}
      <div className="sl-footer-brand">
        <div className="sl-footer-logo">
          Modera<span>AI</span>
        </div>
        <p className="sl-footer-tagline">
          AI-powered comment moderation for creators &amp; brands.
        </p>
      </div>

      {/* ── Links ── */}
      <div className="sl-footer-links">

        <div className="sl-footer-col">
          <p className="sl-footer-col-title">Product</p>
          {/* Use <a> not <Link> for hash anchors — React Router doesn't handle # scrolling */}
          <a href="/#features"  className="sl-footer-link">Features</a>
          <a href="/#pricing"   className="sl-footer-link">Pricing</a>
          <a href="/#platforms" className="sl-footer-link">Platforms</a>
          <Link to="/dashboard" className="sl-footer-link">Dashboard</Link>
        </div>

        <div className="sl-footer-col">
          <p className="sl-footer-col-title">Legal</p>
          <Link to="/privacy" className="sl-footer-link">Privacy Policy</Link>
          <Link to="/terms"   className="sl-footer-link">Terms of Service</Link>
          <Link to="/refund"  className="sl-footer-link">Refund Policy</Link>
        </div>

        <div className="sl-footer-col">
          <p className="sl-footer-col-title">Support</p>
          <a href="mailto:support@moderaai.com" className="sl-footer-link">Contact Us</a>
          <a href="mailto:support@moderaai.com" className="sl-footer-link">Report an Issue</a>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="sl-footer-bottom">
        <span>© {year} ModeraAI. All rights reserved. Made in India 🇮🇳</span>
        <div className="sl-footer-bottom-links">
          <Link to="/privacy" className="sl-footer-link">Privacy</Link>
          <Link to="/terms"   className="sl-footer-link">Terms</Link>
          <Link to="/refund"  className="sl-footer-link">Refund</Link>
        </div>
      </div>

    </footer>
  );
}
