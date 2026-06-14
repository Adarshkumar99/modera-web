import "../styles/Stats.css";

export default function Stats() {
  return (
    <div className="sl-stats sl-reveal">
      {[
        ["2M+",  "Comments Analyzed"],
        ["98%",  "Accuracy Rate"],
        ["3",    "Platforms Supported"],
        ["<1s",  "Analysis Time"],
      ].map(([n, l]) => (
        <div key={l} className="text-center">
          <div className="sl-stat-num">{n}</div>
          <div className="sl-stat-label">{l}</div>
        </div>
      ))}
    </div>
  );
}
