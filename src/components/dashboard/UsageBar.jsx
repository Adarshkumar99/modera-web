// UsageBar.jsx — API call usage progress bar
// Green → Yellow (60%) → Red (80%)

export default function UsageBar({ used, total }) {
  const pct = Math.min((used / total) * 100, 100);
  const cls = pct >= 80 ? "sl-usage-danger" : pct >= 60 ? "sl-usage-warn" : "";
  return (
    <div className="sl-usage-wrap">
      <div className="sl-usage-track">
        <div className={`sl-usage-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="sl-usage-label">{used} / {total} analyses</span>
    </div>
  );
}