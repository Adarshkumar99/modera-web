import { useState } from "react";
import "../styles/Auth.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    if (!name.trim()) {
      toast.error("Name is required."); return false;
    }
    if (!email.trim()) {
      toast.error("Email is required."); return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email."); return false;
    }
    if (!password) {
      toast.error("Password is required."); return false;
    }
    if (password.length < 5) {
      toast.error("Min 5 characters."); return false;
    }
    if (passwordConfirm !== password) {
      toast.error("Passwords don't match."); return false;
    }
    return true;
  };

  const handleGoogleSignup = () => {
    const token = localStorage.getItem("token");
    window.location.href = `${API}/auth/youtube?state=${token}`;
  };

  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: "Weak", cls: "sl-strength-weak", w: "33%" };
    if (password.length < 10 || !/[^a-zA-Z0-9]/.test(password)) return { label: "Fair", cls: "sl-strength-fair", w: "66%" };
    return { label: "Strong", cls: "sl-strength-strong", w: "100%" };
  };
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/v1/signup`,
        { name, email, password }
      );
      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err?.response?.status === 429) {
        toast.error(err?.response?.data?.error || "Too many attempts. Please wait a minute and try again.");
      } else {
        toast.error(err?.response?.data?.errors?.[0] || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sl-auth-page">
      <div className="sl-orb sl-orb1" />
      <div className="sl-orb sl-orb2" />
      <div className="sl-noise" />

      <div className="sl-auth-card sl-auth-card-wide">
        {/* Logo removed — Navbar already shows it */}

        <div className="sl-auth-heading">Create your account</div>
        <div className="sl-auth-sub">
          Start free — 50 analyses/month, no credit card needed.
        </div>

        <form onSubmit={handleSubmit} className="sl-auth-form" noValidate>

          {/* Name */}
          <div className="sl-field">
            <label className="sl-label">Full name</label>
            <div className="sl-input-wrap">
              <svg className="sl-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input className="sl-input" type="text" placeholder="Rahul Sharma"
                value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          </div>

          {/* Email */}
          <div className="sl-field">
            <label className="sl-label">Email address</label>
            <div className="sl-input-wrap">
              <svg className="sl-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input className="sl-input" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div className="sl-field">
            <label className="sl-label">Password</label>
            <div className="sl-input-wrap">
              <svg className="sl-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input className="sl-input" type={showPass ? "text" : "password"}
                placeholder="Min 5 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="sl-eye-btn"
                onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                {showPass
                  ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
            {strength && (
              <div className="sl-strength-bar">
                <div className="sl-strength-track">
                  <div className={`sl-strength-fill ${strength.cls}`} style={{ width: strength.w }} />
                </div>
                <span className={`sl-strength-label ${strength.cls}`}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="sl-field">
            <label className="sl-label">Confirm password</label>
            <div className="sl-input-wrap">
              <svg className="sl-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <input className="sl-input" type={showPass ? "text" : "password"}
                placeholder="Re-enter password" value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)} autoComplete="new-password" />
            </div>
          </div>

          <button className="sl-btn-primary sl-auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="sl-spinner" /> : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Free Account
              </>
            )}
          </button>

          <p className="sl-auth-terms">
            By signing up, you agree to our{" "}
            <a href="/terms" className="sl-auth-link">Terms of Service</a> and{" "}
            <a href="/privacy" className="sl-auth-link">Privacy Policy</a>.
          </p>
        </form>

        <div className="sl-auth-divider"><span>or</span></div>

        <button className="sl-social-btn" onClick={handleGoogleSignup}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="sl-auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="sl-auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
