// LabelBadge.jsx — Comment classification ka colored badge
// Safe = green, Toxic = red, Spam = yellow, Hate = orange

export default function LabelBadge({ label }) {
  const map = {
    safe:        { text: "Safe",  cls: "sl-badge-safe"  },
    toxic:       { text: "Toxic", cls: "sl-badge-toxic" },
    spam:        { text: "Spam",  cls: "sl-badge-spam"  },
    hate_speech: { text: "Hate",  cls: "sl-badge-hate"  },
  };
  const { text, cls } = map[label] || { text: label, cls: "sl-badge-safe" };
  return <span className={`sl-badge ${cls}`}>{text}</span>;
}