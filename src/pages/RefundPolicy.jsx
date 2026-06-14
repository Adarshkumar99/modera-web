// RefundPolicy.jsx — Required by Razorpay for payment integration approval
import { Link } from "react-router-dom";
import "../styles/Legal.css";

const LAST_UPDATED = "June 2025";
const COMPANY      = "ModeraAI";
const EMAIL        = "support@moderaai.com";

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <main className="legal-main">
        <div className="legal-container">
          <h1 className="legal-h1">Refund Policy</h1>
          <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

          <p className="legal-intro">
            At {COMPANY}, we want you to be satisfied with our service. This Refund Policy
            outlines the conditions under which we offer refunds for subscription purchases.
            Please read this policy carefully before subscribing.
          </p>

          <Section title="1. Eligibility for Refund">
            <p>You are eligible for a full refund if:</p>
            <ul>
              <li>You request a refund <strong>within 7 days</strong> of your initial subscription purchase.</li>
              <li>You have used fewer than <strong>50 AI analyses</strong> during that period (i.e., the service has not been substantially used).</li>
              <li>This is your <strong>first subscription</strong> to {COMPANY} — refunds are only available on first-time purchases.</li>
            </ul>
          </Section>

          <Section title="2. Non-Refundable Situations">
            <p>Refunds will NOT be issued in the following cases:</p>
            <ul>
              <li>Refund request made after 7 days from the purchase date.</li>
              <li>More than 50 AI analyses have been used during the billing period.</li>
              <li>Renewal charges — subscription renewals are non-refundable. You must cancel before the renewal date.</li>
              <li>Plan upgrade charges — if you upgrade mid-cycle, the prorated charge is non-refundable.</li>
              <li>Downgrade requests — downgrades take effect at the end of the current billing period; no partial refunds are issued.</li>
              <li>Failure to cancel before renewal — it is your responsibility to cancel your subscription if you no longer wish to continue.</li>
            </ul>
          </Section>

          <Section title="3. How to Request a Refund">
            <p>To request a refund, please follow these steps:</p>
            <ul>
              <li>Send an email to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with subject: <strong>"Refund Request — [Your Email]"</strong>.</li>
              <li>Include your registered email address, the date of purchase, and your Razorpay payment ID (found in your email receipt).</li>
              <li>Our team will review your request within <strong>2 business days</strong>.</li>
              <li>If approved, the refund will be credited to your original payment method within <strong>5-7 business days</strong>, depending on your bank or payment provider.</li>
            </ul>
          </Section>

          <Section title="4. Subscription Cancellation">
            <ul>
              <li>You can cancel your subscription at any time from the <strong>Dashboard → Billing</strong> section.</li>
              <li>After cancellation, your plan remains active until the end of the current billing period.</li>
              <li>You will not be charged for the next billing cycle after cancellation.</li>
              <li>Your data will be retained for 30 days after cancellation, after which it will be permanently deleted.</li>
            </ul>
          </Section>

          <Section title="5. Free Plan">
            <p>The Free plan is available at no cost and does not require any payment. No refunds are applicable to the Free plan.</p>
          </Section>

          <Section title="6. Technical Issues">
            <p>If you experience technical issues that prevent you from using the service, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> before requesting a refund. We will make reasonable efforts to resolve the issue. If we are unable to resolve it within 5 business days, you may be eligible for a refund at our discretion.</p>
          </Section>

          <Section title="7. Contact Us">
            <p>For refund requests or billing questions:</p>
            <div className="legal-contact-box">
              <p><strong>{COMPANY} Support</strong></p>
              <p>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p>Response time: Within 2 business days</p>
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="legal-section">
      <h2 className="legal-h2">{title}</h2>
      {children}
    </section>
  );
}
