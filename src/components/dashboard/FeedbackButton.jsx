import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const LABELS = [
  { value: "safe",        emoji: "✅", text: "Safe"    },
  { value: "toxic",       emoji: "🔴", text: "Toxic"   },
  { value: "hate_speech", emoji: "⛔", text: "Hate"    },
  { value: "spam",        emoji: "🟡", text: "Spam"    },
  { value: "warning",     emoji: "⚠️", text: "Warning" },
];

export default function FeedbackButton({ commentDbId, aiLabel }) {
  const [open, setOpen]           = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [chosen, setChosen]       = useState(null);

  if (!commentDbId) return null;

  const submit = async (correctLabel) => {
    if (loading || submitted) return;
    setLoading(true);
    setChosen(correctLabel);
    try {
      await axios.post(
        `${API}/api/v1/comments/${commentDbId}/feedback`,
        { correct_label: correctLabel },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSubmitted(true);
      setOpen(false);
      toast.success(correctLabel === aiLabel ? "Thanks! Noted." : "Feedback saved — helps improve detection.");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Could not save feedback.");
      setChosen(null);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <span className="sl-feedback-done">✓ Saved</span>;

  return (
    <div className="sl-feedback-wrap">
      <button className="sl-feedback-btn sl-feedback-agree"    title="AI got this right"  onClick={() => submit(aiLabel)} disabled={loading}>👍</button>
      <button className="sl-feedback-btn sl-feedback-disagree" title="AI got this wrong"  onClick={() => setOpen(o => !o)} disabled={loading}>👎</button>
      {open && (
        <div className="sl-feedback-picker">
          <div className="sl-feedback-picker-label">What should it be?</div>
          {LABELS.filter(l => l.value !== aiLabel).map(l => (
            <button key={l.value} className={`sl-feedback-choice ${chosen === l.value ? "active" : ""}`} onClick={() => submit(l.value)} disabled={loading}>
              {l.emoji} {l.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}