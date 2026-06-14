// PrivacyPolicy.jsx — Legal page
import { Link } from "react-router-dom";
import "../styles/Legal.css";

const LAST_UPDATED = "June 2025";
const COMPANY      = "ModeraAI";
const EMAIL        = "support@moderaai.com";
const WEBSITE      = "https://moderaai.com";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <main className="legal-main">
        <div className="legal-container">
          <h1 className="legal-h1">Privacy Policy</h1>
          <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

          <p className="legal-intro">
            {COMPANY} ("we", "us", or "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our AI-powered comment moderation platform.
          </p>

          <Section title="1. Information We Collect">
            <Sub title="1.1 Information You Provide">
              <ul>
                <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through Razorpay. We do not store card or UPI details.</li>
                <li><strong>Connected Accounts:</strong> OAuth tokens for YouTube, Instagram, and Telegram when you connect them.</li>
              </ul>
            </Sub>
            <Sub title="1.2 Information Collected Automatically">
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, features used, and actions taken within the platform.</li>
                <li><strong>Log Data:</strong> IP address, browser type, device information, and timestamps.</li>
                <li><strong>Comment Data:</strong> Text of comments fetched from your connected social media accounts for AI analysis.</li>
              </ul>
            </Sub>
            <Sub title="1.3 Information from Third Parties">
              <ul>
                <li><strong>YouTube:</strong> Channel ID, channel name, video list, and public comments via YouTube Data API.</li>
                <li><strong>Instagram:</strong> Business account ID, username, posts, and comments via Instagram Graph API.</li>
                <li><strong>Telegram:</strong> Chat ID when you connect your account via our Telegram bot.</li>
              </ul>
            </Sub>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul>
              <li>To provide, operate, and maintain the {COMPANY} platform.</li>
              <li>To analyze comments using AI for toxic, spam, and hate speech detection.</li>
              <li>To automatically moderate harmful comments on your behalf based on your settings.</li>
              <li>To send you alerts and notifications via Telegram (if connected).</li>
              <li>To process payments and manage your subscription plan.</li>
              <li>To improve our AI models and platform features.</li>
              <li>To communicate with you about updates, security alerts, and support.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> Groq (AI inference), Razorpay (payments), and cloud hosting providers. These providers are contractually bound to keep your information confidential.</li>
              <li><strong>Legal Requirements:</strong> If required by law, court order, or governmental authority.</li>
              <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <ul>
              <li><strong>Account data</strong> is retained as long as your account is active.</li>
              <li><strong>Comment analysis data</strong> is retained for 90 days for history and audit purposes.</li>
              <li><strong>OAuth tokens</strong> are stored securely and deleted when you disconnect a platform.</li>
              <li>You may request deletion of your data at any time by contacting <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>HTTPS encryption for all data in transit.</li>
              <li>Encrypted storage of OAuth tokens and sensitive credentials.</li>
              <li>JWT-based authentication with token invalidation on logout.</li>
              <li>Regular security reviews of our codebase and infrastructure.</li>
            </ul>
            <p>However, no method of transmission over the Internet is 100% secure.</p>
          </Section>

          <Section title="6. Your Rights">
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Withdrawal of Consent:</strong> Disconnect any linked social media account from your Dashboard at any time.</li>
              <li><strong>Data Portability:</strong> Export your analysis history as CSV from the Dashboard.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>Our platform integrates with third-party services that have their own privacy policies:</p>
            <ul>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google / YouTube Privacy Policy</a></li>
              <li><a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noreferrer">Instagram / Meta Privacy Policy</a></li>
              <li><a href="https://telegram.org/privacy" target="_blank" rel="noreferrer">Telegram Privacy Policy</a></li>
              <li><a href="https://razorpay.com/privacy/" target="_blank" rel="noreferrer">Razorpay Privacy Policy</a></li>
            </ul>
          </Section>

          <Section title="8. Cookies">
            <p>{COMPANY} uses only essential browser storage (localStorage) to maintain your login session. We do not use tracking cookies or third-party advertising cookies.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>{COMPANY} is not directed to children under the age of 13. We do not knowingly collect personal information from children.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice on our platform.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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

function Sub({ title, children }) {
  return (
    <div className="legal-sub">
      <h3 className="legal-h3">{title}</h3>
      {children}
    </div>
  );
}
