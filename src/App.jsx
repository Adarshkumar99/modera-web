import { useScrolled, useReveal, useCursor } from "./hooks/useSiftly";
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar      from "./components/Navbar";
import Hero        from "./components/Hero";
import Stats       from "./components/Stats";
import Features    from "./components/Features";
import Platforms   from "./components/Platforms";
import HowItWorks  from "./components/HowItWorks";
import Pricing     from "./components/Pricing";
import CTA         from "./components/CTA";
import Footer      from "./components/Footer";
import Login       from "./pages/Login";
import Signup      from "./pages/Signup";
import Dashboard   from "./pages/Dashboard";
import ProtectedRoute  from "./components/ProtectedRoute";
import PrivacyPolicy   from "./pages/PrivacyPolicy";
import TermsOfService  from "./pages/TermsOfService";
import RefundPolicy    from "./pages/RefundPolicy";
import ForgotPassword  from "./pages/ForgotPassword";
import NotFound        from "./pages/NotFound";
import "./styles/global.css";

function HomePage() {
  useReveal();
  return (
    <>
      <Hero       />
      <Stats      />
      <Features   />
      <Platforms  />
      <HowItWorks />
      <Pricing    />
      <CTA        />
    </>
  );
}

function App() {
  const scrolled = useScrolled();
  const { cursorRef, ringRef } = useCursor();
  const location = useLocation();

  // Hide navbar only on dashboard — it has its own sidebar with logo
  // Login, Signup, Legal pages — all show navbar
  const hideFooter = ["/dashboard", "/login", "/signup"].includes(location.pathname);
  const hideNavbar = ["/dashboard"].includes(location.pathname);

  return (
    <div className="sl-page">
      <div className="sl-cursor"      ref={cursorRef} />
      <div className="sl-cursor-ring" ref={ringRef}   />
      <div className="sl-noise" />

      {!hideNavbar && <Navbar scrolled={scrolled} />}

      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/privacy"          element={<PrivacyPolicy />} />
        <Route path="/terms"            element={<TermsOfService />} />
        <Route path="/refund"           element={<RefundPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*"                element={<NotFound />} />
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
