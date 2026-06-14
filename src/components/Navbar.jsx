import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar({ scrolled }) {
  const [open, setOpen]   = useState(false);
  const dropRef           = useRef(null);
  const location          = useLocation();
  const { user, isLoggedIn, logout, loading } = useAuth();

  // Check if we are on the homepage — show nav links only here
  const isHomePage = location.pathname === "/";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return null;

  const handleLogout = () => { logout(); };

  // Build initials from user name — "Rahul Sharma" → "RS"
  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <nav className={`sl-nav${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="sl-logo">Modera<span>AI</span></Link>

      <div className="d-flex align-items-center gap-4">
        {/* Nav links — only show on homepage */}
        {isHomePage && (
          <>
            <a href="#features"  className="sl-nav-link d-none d-md-block">Features</a>
            <a href="#platforms" className="sl-nav-link d-none d-md-block">Platforms</a>
            <a href="#pricing"   className="sl-nav-link d-none d-md-block">Pricing</a>
          </>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="sl-nav-link d-none d-md-block">
              Dashboard
            </Link>

            {/* Avatar + Dropdown */}
            <div className="sl-avatar-wrap" ref={dropRef}>
              <button
                className="sl-avatar-btn"
                onClick={() => setOpen(!open)}
                aria-label="User menu"
              >
                {initials}
              </button>

              {open && (
                <div className="sl-dropdown">
                  {/* User info */}
                  <div className="sl-dd-header">
                    <div className="sl-avatar-btn sl-avatar-lg">{initials}</div>
                    <div>
                      <div className="sl-dd-name">{user?.name}</div>
                      <div className="sl-dd-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="sl-dd-plan">
                    {user?.plan || "Free"} Plan · {user?.api_calls_used || 0}/100 used
                  </div>

                  {/* Links */}
                  <div className="sl-dd-section">
                    <Link to="/profile"   className="sl-dd-item" onClick={() => setOpen(false)}>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      My Profile
                    </Link>
                    <Link to="/settings"  className="sl-dd-item" onClick={() => setOpen(false)}>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Settings
                    </Link>
                    <Link to="/pricing"   className="sl-dd-item" onClick={() => setOpen(false)}>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Upgrade to Pro
                      <span className="sl-dd-badge">NEW</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="sl-dd-section sl-dd-section-danger">
                    <button className="sl-dd-item sl-dd-logout" onClick={handleLogout}>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login"  className="sl-nav-link sl-nav-login d-none d-md-block">Sign In</Link>
            <Link to="/signup" className="sl-nav-cta">Get Started Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
