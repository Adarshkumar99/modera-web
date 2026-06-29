import { STEPS } from "../data/constants";
import "../styles/HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="sl-how" id="how">
      <div className="sl-reveal text-center">
        <div className="sl-section-label">Process</div>
        <div className="sl-section-title sl-syne">How ModeraAI Works</div>
      </div>
      <div className="row g-4 mt-4 sl-reveal position-relative">
        <div className="sl-steps-line d-none d-md-block" />
        {STEPS.map(s => (
          <div key={s.num} className="col-6 col-md-3 sl-step text-center">
            <div className="sl-step-num">{s.num}</div>
            <div className="sl-step-title">{s.title}</div>
            <div className="sl-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
