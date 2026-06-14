import "../styles/CTA.css";

export default function CTA() {
  return (
    <section className="sl-cta" id="cta">
      <div className="sl-reveal" style={{ position: "relative", zIndex: 1 }}>
        <div className="sl-cta-title">Ready to Clean Your<br />Comment Section?</div>
        <div className="sl-cta-sub">Join thousands of Indian creators who trust ModeraAI.</div>
        <a href="#" className="sl-btn-primary" style={{ fontSize: 16, padding: "16px 40px", display: "inline-flex" }}>
          Start Free Today — No Card Needed
        </a>
      </div>
    </section>
  );
}
