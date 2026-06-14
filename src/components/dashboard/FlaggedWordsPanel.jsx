import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const LABEL_COLORS = {
  toxic: "#f72585", hate_speech: "#7209b7", spam: "#f4a261", safe: "#06d6a0",
};

export default function FlaggedWordsPanel() {
  const [words, setWords]     = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/v1/feedback/flagged_words`, headers);
      setWords(res.data.flagged_words || []);
    } catch { toast.error("Could not load flagged words."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWords(); }, []);

  const approve = async (id, word) => {
    try {
      await axios.patch(`${API}/api/v1/feedback/flagged_words/${id}/approve`, {}, headers);
      toast.success(`"${word}" approved! Add it to LOCAL_RULES in ai_classifier_service.rb`);
      setWords(prev => prev.filter(w => w.id !== id));
    } catch { toast.error("Could not approve."); }
  };

  const reject = async (id, word) => {
    try {
      await axios.patch(`${API}/api/v1/feedback/flagged_words/${id}/reject`, {}, headers);
      toast("Dismissed.", { icon: "🚫" });
      setWords(prev => prev.filter(w => w.id !== id));
    } catch { toast.error("Could not reject."); }
  };

  if (loading) return <div className="sl-loading">Loading flagged words...</div>;

  return (
    <div className="sl-dash-content">
      <div className="sl-dash-header">
        <h1 className="sl-dash-title">Flagged Words</h1>
        <p className="sl-dash-sub">Words flagged 3+ times via 👎 feedback. Approve to blocklist, or dismiss if false positive.</p>
      </div>
      {words.length === 0 ? (
        <div className="sl-empty">
          <div className="sl-empty-icon">🎉</div>
          <div className="sl-empty-text">No words ready for review yet.<br />They appear here after being flagged 3+ times.</div>
        </div>
      ) : (
        <>
          <div className="sl-flagged-list">
            {words.map(w => (
              <div key={w.id} className="sl-flagged-row">
                <div className="sl-flagged-word-info">
                  <span className="sl-flagged-word">"{w.word}"</span>
                  <span className="sl-flagged-label" style={{ background: (LABEL_COLORS[w.suggested_label] || "#888") + "22", color: LABEL_COLORS[w.suggested_label] || "#888" }}>
                    → {w.suggested_label.replace("_", " ")}
                  </span>
                </div>
                <div className="sl-flagged-count">🚩 {w.flag_count} times</div>
                <div className="sl-flagged-actions">
                  <button className="sl-btn-primary sl-flagged-approve" onClick={() => approve(w.id, w.word)}>✓ Approve</button>
                  <button className="sl-btn-secondary sl-flagged-reject" onClick={() => reject(w.id, w.word)}>✕ Dismiss</button>
                </div>
              </div>
            ))}
          </div>
          <div className="sl-flagged-note">
            💡 After approving, add the word to <code>LOCAL_RULES[:toxic]</code> in <code>app/services/ai_classifier_service.rb</code>.
          </div>
        </>
      )}
    </div>
  );
}