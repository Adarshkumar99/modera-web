import { PLATFORMS } from "../data/constants";
import "../styles/Platforms.css";

export default function Platforms() {
  return (
    <section className="sl-platforms" id="platforms">
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <div className="sl-reveal">
          <div className="sl-section-label">Integrations</div>
          <div className="sl-section-title sl-syne">Connect Your Channels</div>
          <div className="sl-section-sub mx-auto">One-click OAuth connection. No technical setup needed.</div>
        </div>
        <div className="d-flex gap-3 justify-content-center flex-wrap mt-4 sl-reveal">
          {PLATFORMS.map(p => (
            <div
              key={p.name}
              className="sl-platform-card"
              style={!p.live ? { borderStyle: "dashed", opacity: 0.5 } : {}}
            >
              <div className="sl-platform-icon">{p.icon}</div>
              <div className="sl-platform-name">{p.name}</div>
              <div className={`sl-platform-status${!p.live ? " sl-platform-soon" : ""}`}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
