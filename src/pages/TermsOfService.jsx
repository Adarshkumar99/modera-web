// TermsOfService.jsx — Legal page
import { Link } from "react-router-dom";
import "../styles/Legal.css";

const LAST_UPDATED = "June 2025";
const COMPANY      = "ModeraAI";
const EMAIL        = "support@moderaai.com";
const WEBSITE      = "https://moderaai.com";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <main className="legal-main">
        <div className="legal-container">
          <h1 className="legal-h1">Terms of Service</h1>
          <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

          <p className="legal-intro">
            Please read these Terms of Service carefully before using the {COMPANY} platform.
            By accessing or using our service, you agree to be bound by these terms.
            If you do not agree, please do not use our platform.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>By creating an account and using {COMPANY}, you confirm that you are at least 18 years of age, have read and agreed to these Terms, and have the legal authority to enter into this agreement.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>{COMPANY} provides an AI-powered comment moderation platform that allows users to:</p>
            <ul>
              <li>Connect their YouTube, Instagram, and Telegram accounts.</li>
              <li>Automatically detect and moderate toxic, spam, and hate speech comments.</li>
              <li>View analysis history and export data as CSV.</li>
              <li>Receive real-time moderation alerts via Telegram.</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must notify us immediately at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> if you suspect unauthorized access.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to use {COMPANY} to:</p>
            <ul>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe the intellectual property rights of others.</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts.</li>
              <li>Use the platform to moderate content you do not have the right to manage.</li>
              <li>Reverse engineer, decompile, or disassemble any part of our platform.</li>
              <li>Resell or sublicense the service without our written consent.</li>
            </ul>
          </Section>

          <Section title="5. Connected Social Media Accounts">
            <p>When you connect your YouTube, Instagram, or Telegram account:</p>
            <ul>
              <li>You grant {COMPANY} permission to access, read, and manage comments on your behalf as permitted by your plan.</li>
              <li>You confirm that you are the authorized account holder or have permission from the account holder.</li>
              <li>You can revoke this permission at any time from your Dashboard.</li>
              <li>We act as your agent in moderating content — the responsibility for moderation decisions remains with you.</li>
            </ul>
          </Section>

          <Section title="6. Subscription and Billing">
            <ul>
              <li>Subscriptions are billed monthly in advance through Razorpay.</li>
              <li>Plan limits (comments per month, platforms) reset on your monthly billing date.</li>
              <li>Unused quota does not carry over to the next month.</li>
              <li>You may upgrade or downgrade your plan at any time from the Dashboard.</li>
              <li>Downgrading takes effect at the end of your current billing period.</li>
            </ul>
          </Section>

          <Section title="7. Refunds">
            <p>Please refer to our <Link to="/refund">Refund Policy</Link> for full details. In summary:</p>
            <ul>
              <li>Refunds are available within 7 days of initial purchase if the service has not been used.</li>
              <li>No refunds are provided for partial months or unused quota.</li>
              <li>Refund requests must be submitted to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <ul>
              <li>The {COMPANY} platform, including its AI models, design, and codebase, is owned by us and protected by intellectual property laws.</li>
              <li>You retain all rights to your own content (your comments data, your social media content).</li>
              <li>By using our platform, you grant us a limited license to process your content solely for the purpose of providing the service.</li>
            </ul>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:</p>
            <ul>
              <li>The service will be uninterrupted or error-free.</li>
              <li>AI classification results will be 100% accurate. False positives and false negatives may occur.</li>
              <li>The service will meet your specific requirements.</li>
            </ul>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, {COMPANY.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE SERVICE.</p>
            <p>Our total liability to you shall not exceed the amount you paid us in the 3 months preceding the claim.</p>
          </Section>

          <Section title="11. Termination">
            <ul>
              <li>You may delete your account at any time from the Dashboard settings.</li>
              <li>We may suspend or terminate your account if you violate these Terms.</li>
              <li>Upon termination, your data will be deleted within 30 days except where retention is required by law.</li>
            </ul>
          </Section>

          <Section title="12. Governing Law">
            <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated Terms.</p>
          </Section>

          <Section title="14. Contact Us">
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="legal-contact-box">
              <p><strong>{COMPANY}</strong></p>
              <p>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p>Website: <a href={WEBSITE}>{WEBSITE}</a></p>
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
