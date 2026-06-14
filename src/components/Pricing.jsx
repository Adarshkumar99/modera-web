import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Pricing.css";

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

const plans = [
  {
    key:      "free",
    name:     "Free",
    price:    "₹0",
    period:   "Forever free",
    popular:  false,
    features: ["50 comments/month", "1 platform", "Basic categories", "Manual review"],
    cta:      "Get Started",
  },
  {
    key:      "starter",
    name:     "Starter",
    price:    "₹299",
    period:   "per month",
    popular:  true,
    features: ["500 comments/month", "3 platforms", "Auto-hide toxic", "Analytics dashboard", "Email alerts"],
    cta:      "Upgrade to Starter",
  },
  {
    key:      "pro",
    name:     "Pro",
    price:    "₹799",
    period:   "per month",
    popular:  false,
    features: ["Unlimited comments", "All platforms", "Auto-delete + ban", "Advanced analytics", "API access", "Priority support"],
    cta:      "Upgrade to Pro",
  },
  {
    key:      "agency",
    name:     "Agency",
    price:    "₹2499",
    period:   "per month",
    popular:  false,
    features: ["10 client accounts", "White-label option", "Dedicated support", "Custom rules engine", "Bulk export"],
    cta:      "Upgrade to Agency",
  },
];

export default function Pricing() {
  const { user, refreshUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (plan) => {
    if (plan.key === "free") return;
    if (user?.plan === plan.key) { toast("Aap already is plan pe hain!"); return; }

    setLoadingPlan(plan.key);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { toast.error("Razorpay load nahi hua."); return; }

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
        prefill:         { name: user?.name || "", email: user?.email || "" },
        theme:           { color: "#4F8EF7" },
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
          ondismiss: () => { toast("Payment cancel kar di."); setLoadingPlan(null); }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { toast.error("Payment fail ho gayi."); setLoadingPlan(null); });
      rzp.open();

    } catch (err) {
      toast.error(err?.response?.data?.error || "Kuch gadbad ho gayi.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="sl-pricing" id="pricing">
      <div className="sl-reveal" style={{ textAlign: "center" }}>
        <div className="sl-section-label">Pricing</div>
        <div className="sl-section-title sl-syne">Simple, Honest Pricing</div>
        <div className="sl-section-sub" style={{ margin: "0 auto" }}>
          Start free, scale as you grow. No hidden charges.
        </div>
      </div>

      <div className="sl-pricing-grid sl-reveal">
        {plans.map((plan) => {
          const isCurrentPlan = user?.plan === plan.key;
          const isLoading     = loadingPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`sl-price-card${plan.popular ? " popular" : ""}${isCurrentPlan ? " current-plan" : ""}`}
            >
              {plan.popular && <div className="sl-popular-badge">Most Popular</div>}
              {isCurrentPlan && <div className="sl-current-badge">✓ Active</div>}

              <div className="sl-price-plan">{plan.name}</div>
              <div className="sl-price-amount">
                {plan.price}<span>/mo</span>
              </div>
              <div className="sl-price-period">{plan.period}</div>

              <ul className="sl-price-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <button
                className={`sl-price-btn${plan.popular ? " popular-btn" : ""}${isCurrentPlan ? " current-btn" : ""}`}
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrentPlan || isLoading || plan.key === "free"}
              >
                {isLoading ? "Processing..." : isCurrentPlan ? "✓ Current Plan" : plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
