import { useState } from "react";
import { FEATURES } from "../data/constants";
import "../styles/Features.css";

const FEATURE_DEMOS = {
  "Hinglish Intelligence": {
    examples: [
      { text: "bhai teri video bakwaas hai", result: "Safe", color: "#06d6a0" },
      { text: "tu madarchod hai", result: "Toxic", color: "#f72585" },
      { text: "yaar kya mast content", result: "Safe", color: "#06d6a0" },
    ]
  },
  "Real-time Moderation": {
    stat: { value: "<1s", label: "Average analysis time", sub: "Per comment, any language" }
  },
  "Smart Categories": {
    labels: [
      { name: "Safe",    color: "#06d6a0", pct: 68 },
      { name: "Toxic",   color: "#f72585", pct: 12 },
      { name: "Spam",    color: "#f4a261", pct: 11 },
      { name: "Hate",    color: "#7209b7", pct: 5  },
      { name: "Warning", color: "#4F8EF7", pct: 4  },
    ]
  },
  "Analytics Dashboard": {
    bars: [
      { label: "Mon", toxic: 3,  safe: 42 },
      { label: "Tue", toxic: 7,  safe: 38 },
      { label: "Wed", toxic: 2,  safe: 55 },
      { label: "Thu", toxic: 11, safe: 30 },
      { label: "Fri", toxic: 5,  safe: 48 },
      { label: "Sat", toxic: 8,  safe: 60 },
      { label: "Sun", toxic: 4,  safe: 52 },
    ]
  },
  "Multi-Platform": {
    platforms: [
      { icon: "▶️", name: "YouTube",   color: "#ff4444" },
      { icon: "📸", name: "Instagram", color: "#f72585" },
      { icon: "✈️", name: "Telegram",  color: "#4F8EF7" },
    ]
  },
  "Auto-Actions": {
    actions: [
      { trigger: "Gaali / abuse",   action: "Auto Delete", color: "#f72585" },
      { trigger: "Hate speech",     action: "Auto Hide",   color: "#7209b7" },
      { trigger: "Spam link",       action: "Auto Flag",   color: "#f4a261" },
      { trigger: "Warning content", action: "Review",      color: "#4F8EF7" },
    ]
  },
};

function FeatureDemo({ title }) {
  const demo = FEATURE_DEMOS[title];
  if (!demo) return null;
  if (demo.examples) return (
    <div className="sl-fd-examples">
      {demo.examples.map((e, i) => (
        <div key={i} className="sl-fd-example-row">
          <span className="sl-fd-text">"{e.text}"</span>
          <span className="sl-fd-tag" style={{ color: e.color, borderColor: e.color + "44", background: e.color + "15" }}>{e.result}</span>
        </div>
      ))}
    </div>
  );
  if (demo.stat) return (
    <div className="sl-fd-stat">
      <div className="sl-fd-big-num" style={{ color: "#06d6a0" }}>{demo.stat.value}</div>
      <div className="sl-fd-stat-label">{demo.stat.label}</div>
      <div className="sl-fd-stat-sub">{demo.stat.sub}</div>
    </div>
  );
  if (demo.labels) return (
    <div className="sl-fd-labels">
      {demo.labels.map((l, i) => (
        <div key={i} className="sl-fd-label-row">
          <span className="sl-fd-label-name" style={{ color: l.color }}>{l.name}</span>
          <div className="sl-fd-bar-track"><div className="sl-fd-bar-fill" style={{ width: `${l.pct}%`, background: l.color }} /></div>
          <span className="sl-fd-label-pct">{l.pct}%</span>
        </div>
      ))}
    </div>
  );
  if (demo.bars) return (
    <div className="sl-fd-bars">
      {demo.bars.map((b, i) => {
        const max = 70;
        return (
          <div key={i} className="sl-fd-bar-col">
            <div className="sl-fd-bar-stack">
              <div className="sl-fd-bar-toxic" style={{ height: `${(b.toxic / max) * 80}px` }} />
              <div className="sl-fd-bar-safe"  style={{ height: `${(b.safe  / max) * 80}px` }} />
            </div>
            <div className="sl-fd-bar-label">{b.label}</div>
          </div>
        );
      })}
    </div>
  );
  if (demo.platforms) return (
    <div className="sl-fd-platforms">
      {demo.platforms.map((p, i) => (
        <div key={i} className="sl-fd-platform" style={{ borderColor: p.color + "44" }}>
          <span style={{ fontSize: 20 }}>{p.icon}</span>
          <span className="sl-fd-platform-name" style={{ color: p.color }}>{p.name}</span>
          <span className="sl-fd-platform-live">● Live</span>
        </div>
      ))}
    </div>
  );
  if (demo.actions) return (
    <div className="sl-fd-actions">
      {demo.actions.map((a, i) => (
        <div key={i} className="sl-fd-action-row">
          <span className="sl-fd-trigger">If: {a.trigger}</span>
          <span className="sl-fd-arrow">→</span>
          <span className="sl-fd-action" style={{ color: a.color, borderColor: a.color + "44", background: a.color + "15" }}>{a.action}</span>
        </div>
      ))}
    </div>
  );
  return null;
}

export default function Features() {
  const [activeCard, setActiveCard] = useState(null);
  return (
    <section className="sl-section" id="features">
      <div className="sl-reveal">
        <div className="sl-section-label">Why Siftly</div>
        <div className="sl-section-title sl-syne">Built for Indian Creators</div>
        <div className="sl-section-sub">Other tools fail at Hinglish. Siftly was trained specifically for the way Indians actually type online.</div>
      </div>
      <div className="row g-3 mt-4 sl-reveal">
        {FEATURES.map((f) => {
          const isActive = activeCard === f.title;
          return (
            <div key={f.title} className="col-12 col-md-6 col-lg-4">
              <div className={`sl-feature-card h-100 ${isActive ? "sl-fc-active" : ""}`} onClick={() => setActiveCard(isActive ? null : f.title)}>
                <div className="sl-fc-glow" />
                <div className={`sl-feature-icon ${f.color} ${isActive ? "sl-fi-active" : ""}`}>{f.icon}</div>
                <div className="sl-fc-title-row">
                  <div className="sl-feature-title">{f.title}</div>
                  <span className={`sl-fc-arrow ${isActive ? "open" : ""}`}>›</span>
                </div>
                <div className="sl-feature-desc">{f.desc}</div>
                <div className={`sl-fc-demo ${isActive ? "sl-fc-demo-open" : ""}`}>
                  <div className="sl-fc-demo-divider" />
                  <FeatureDemo title={f.title} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}