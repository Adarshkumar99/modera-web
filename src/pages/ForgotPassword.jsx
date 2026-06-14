import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Auth.css";

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error("Enter a valid email."); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/api/v1/forgot_password`, { email });
      setSent(true);
    } catch (err) {
      // Show success even on error — prevents email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sl-auth-page">
      <div className="sl-orb sl-orb1" />
      <div className="sl-orb sl-orb2" />
      <div className="sl-noise" />

      <div className="sl-auth-card">

        {!sent ? (
          <>
            <div className="sl-auth-heading">Forgot password?</div>
            <div className="sl-auth-sub">
              Enter your email and we'll send you a reset link.
            </div>

            <form onSubmit={handleSubmit} className="sl-auth-form" noValidate>
              <div className="sl-field">
                <label className="sl-label">Email address</label>
                <div className="sl-input-wrap">
                  <svg className="sl-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    className="sl-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <button className="sl-btn-primary sl-auth-btn" type="submit" disabled={loading}>
                {loading ? <span className="sl-spinner" /> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="sl-forgot-success">
            <div className="sl-forgot-icon">📬</div>
            <div className="sl-auth-heading">Check your inbox</div>
            <div className="sl-auth-sub">
              If an account exists for <strong>{email}</strong>, you'll receive
              a password reset link shortly. Check your spam folder if you don't see it.
            </div>
            <button
              className="sl-btn-primary sl-auth-btn"
              style={{ marginTop: "8px" }}
              onClick={() => { setEmail(""); setSent(false); }}
            >
              Try a different email
            </button>
          </div>
        )}

        <div className="sl-auth-switch" style={{ marginTop: "20px" }}>
          Remember your password?{" "}
          <Link to="/login" className="sl-auth-link">Sign in</Link>
        </div>

      </div>
    </div>
  );
}
