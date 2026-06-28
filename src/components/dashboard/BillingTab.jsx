import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PLANS = [
  {
    key:      "free",
    name:     "Free",
    price:    "₹0",
    period:   "Forever",
    features: ["50 comments/month", "1 platform (YouTube only)", "Manual analysis", "Basic AI classification"],
  },
  {
    key:      "starter",
    name:     "Starter",
    price:    "₹299",
    period:   "/month",
    popular:  true,
    features: ["1,500 comments/month", "2 platforms (YouTube + Instagram)", "Auto-delete toxic comments", "Analysis history & CSV export"],
  },
  {
    key:      "pro",
    name:     "Pro",
    price:    "₹799",
    period:   "/month",
    features: ["5,000 comments/month", "All platforms (YT + IG + Telegram)", "Priority AI (better accuracy)", "Real-time Telegram alerts"],
  },
  {
    key:      "agency",
    name:     "Agency",
    price:    "₹2,499",
    period:   "/month",
    features: ["Unlimited comments", "Multiple connected accounts", "Priority support", "All Pro features included"],
  },
];

export default function BillingTab() {
  const { user, refreshUser } = useAuth();
  const [loadingPlan, setLoadingPlan]       = useState(null);
  const [cancelling,  setCancelling]        = useState(false);

  const handleUpgrade = async (plan) => {
    if (plan.key === "free" || user?.plan === plan.key) return;

    setLoadingPlan(plan.key);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay load nahi hua. Internet check karo.");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/v1/payments/create_subscription`,
        { plan: plan.key },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { subscription_id, key_id } = res.data;

      const options = {
        key:             key_id,
        subscription_id: subscription_id,
        name:            "ModeraAI",
        description:     `${plan.name} Plan`,
        prefill: {
          name:  user?.name  || "",
          email: user?.email || "",
        },
        theme: { color: "#6C63FF" },
        handler: async (response) => {
          try {
            await axios.post(
              `${API}/api/v1/payments/verify`,
              {
                razorpay_payment_id:      response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature:       response.razorpay_signature,
                plan:                     plan.key,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`🎉 ${plan.name} plan activate ho gaya!`);
            await refreshUser();
          } catch {
            toast.error("Payment verify nahi hua. Support se contact karo.");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancel kar di.");
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment fail ho gayi. Dobara try karo.");
        setLoadingPlan(null);
      });
      rzp.open();

    } catch (err) {
      toast.error(err?.response?.data?.error || "Kuch gadbad ho gayi.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Kya aap subscription cancel karna chahte hain?")) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/v1/payments/cancel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Subscription cancel ho gayi.");
      await refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Cancel nahi hua.");
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = PLANS.find(p => p.key === user?.plan) || PLANS[0];

  return (
    <div className="sl-dash-content">
      <div className="sl-dash-header">
        <h1 className="sl-dash-title">Billing &amp; Plans</h1>
        <p className="sl-dash-sub">Manage your subscription and upgrade your plan.</p>
      </div>

      {/* Current Plan Card */}
      <div className="sl-feature-card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--sl-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Current Plan
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--sl-text)" }}>
              {currentPlan.name}
              <span style={{ fontSize: "1rem", color: "var(--sl-accent)", marginLeft: "0.5rem" }}>
                {currentPlan.price}{currentPlan.period}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--sl-muted)", marginTop: "0.25rem" }}>
              {currentPlan.features.join(" · ")}
            </div>
          </div>

          {user?.plan !== "free" && (
            <button
              className="sl-btn-secondary"
              onClick={handleCancel}
              disabled={cancelling}
              style={{ color: "#ef4444", borderColor: "#ef4444" }}
            >
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>

      {/* Upgrade Plans */}
      <div style={{ fontSize: "0.85rem", color: "var(--sl-muted)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Upgrade Plan
      </div>

      <div className="sl-videos-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {PLANS.filter(p => p.key !== "free").map((plan) => {
          const isCurrent = user?.plan === plan.key;
          const isLoading = loadingPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`sl-feature-card${isCurrent ? " selected" : ""}`}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {plan.popular && (
                <div style={{ fontSize: "0.7rem", background: "var(--sl-accent)", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "999px", width: "fit-content", fontWeight: 600 }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{plan.name}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--sl-accent)" }}>
                {plan.price}<span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--sl-muted)" }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.82rem", color: "var(--sl-muted)", display: "flex", flexDirection: "column", gap: "0.3rem", flexGrow: 1 }}>
                {plan.features.map(f => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                className={isCurrent ? "sl-btn-secondary" : "sl-btn-primary"}
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent || isLoading}
                style={{ marginTop: "auto" }}
              >
                {isLoading ? "Processing..." : isCurrent ? "✓ Active" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
