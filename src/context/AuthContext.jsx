// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);


  // Any API call fires (YouTube, Instagram, analyze...)
  //         ↓
  // Server returns 401 (token expired or revoked)
  //         ↓
  // Interceptor catches it — one place, all calls
  //         ↓
  // Clear token + user state + redirect to /login


  // Global response interceptor — handles 401 errors across all API calls
  // Runs once on mount; cleans up on unmount to avoid duplicate interceptors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      // Success — pass response through unchanged
      response => response,

      // Error — check for 401 Unauthorized
      error => {
        const code = error.response?.data?.code;

        // Some 401s are NOT app-session related — they're platform-specific
        // "reconnect required" errors (e.g. YouTube/Instagram token expired).
        // Only treat as a real session expiry if it's not one of these.
        const isPlatformReconnectError =
          code === "youtube_reconnect_required" || code === "instagram_not_connected";

        if (error.response?.status === 401 && !isPlatformReconnectError) {
          // Token expired or revoked — clear session and redirect to login
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/login";
        }
        // Re-throw so individual catch blocks can still handle other errors
        return Promise.reject(error);
      }
    );

    // Remove interceptor when AuthProvider unmounts
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    axios.get(`${API}/api/v1/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data.user))
    .catch(() => localStorage.removeItem("token"))
    .finally(() => setLoading(false));
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);                    // ←  When it will set navbar auto re render
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await axios.get(`${API}/api/v1/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Refresh response:", res.data); // Debug log
      setUser(res.data.user);
    } catch {
      // silent
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, login, logout, refreshUser  }}>
      {children}
    </AuthContext.Provider>
  );
}

// use this hook everywhere
export const useAuth = () => useContext(AuthContext);