import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";
import BillingTab from "../components/dashboard/BillingTab";
import FeedbackButton from "../components/dashboard/FeedbackButton";
import FlaggedWordsPanel from "../components/dashboard/FlaggedWordsPanel";

const API = import.meta.env.VITE_API_URL;

function LabelBadge({ label }) {
  const map = {
    safe:        { text: "Safe",  cls: "sl-badge-safe"   },
    toxic:       { text: "Toxic", cls: "sl-badge-toxic"  },
    spam:        { text: "Spam",  cls: "sl-badge-spam"   },
    hate_speech: { text: "Hate",  cls: "sl-badge-hate"   },
  };
  const { text, cls } = map[label] || { text: label, cls: "sl-badge-safe" };
  return <span className={`sl-badge ${cls}`}>{text}</span>;
}

function UsageBar({ used, total }) {
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

// Top header bar inside dashboard — shows on every tab, sits above sl-dash-main content
function DashboardHeader({ user, activeTab }) {
  const [open, setOpen] = useState(false);

  const TAB_TITLES = {
    manual: "Manual Analysis", youtube: "YouTube", instagram: "Instagram",
    history: "History", telegram: "Connect Telegram", billing: "Billing", flagged: "Flagged Words"
  };

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <header className="sl-dash-topbar">
      <div className="sl-dash-topbar-left">
        <a href="/" className="sl-dash-topbar-home" title="Back to homepage">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" /></svg>
        </a>
        <span className="sl-dash-topbar-sep">/</span>
        <span className="sl-dash-topbar-crumb">{TAB_TITLES[activeTab] || "Dashboard"}</span>
      </div>

      <div className="sl-dash-topbar-right">
        <span className="sl-dash-topbar-plan">{user?.plan || "Free"} Plan</span>
        <div className="sl-dash-topbar-avatar-wrap">
          <button className="sl-dash-topbar-avatar" onClick={() => setOpen(o => !o)} aria-label="User menu">
            {initials}
          </button>
          {open && (
            <div className="sl-dash-topbar-dd" onMouseLeave={() => setOpen(false)}>
              <div className="sl-dash-topbar-dd-name">{user?.name}</div>
              <div className="sl-dash-topbar-dd-email">{user?.email}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Inline styles guaranteed — bypasses any CSS class conflicts
function TabHeader({ title, sub }) {
  return (
    <div style={{
      marginBottom: "28px",
      paddingBottom: "20px",
      borderBottom: "1px solid #1E2740"
    }}>
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "28px",
        fontWeight: 700,
        color: "#F0F4FF",
        margin: "0 0 6px",
        letterSpacing: "-0.5px",
        lineHeight: 1.2
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: "14px",
        color: "#8892B0",
        margin: 0,
        fontWeight: 300
      }}>
        {sub}
      </p>
    </div>
  );
}

const VALID_TABS = ["manual", "youtube", "instagram", "history", "telegram", "billing", "flagged"];

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("sl_active_tab");
    return VALID_TABS.includes(saved) ? saved : "manual";
  });

  const switchTab = (tab) => {
    localStorage.setItem("sl_active_tab", tab);
    setActiveTab(tab);
  };

  const [comments, setComments]   = useState("");
  const [results, setResults]     = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const [history, setHistory]               = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [youtubeJustConnected, setYoutubeJustConnected] = useState(false);
  const ytConnected = !!user?.youtube_channel_id;
  const [videos, setVideos]                             = useState([]);
  const [ytNextPageToken, setYtNextPageToken]           = useState(null);
  const [loadingMoreVideos, setLoadingMoreVideos]       = useState(false);
  const [selectedVideo, setSelectedVideo]               = useState(null);
  const [ytComments, setYtComments]                     = useState([]);
  const [ytCommentsNextToken, setYtCommentsNextToken]   = useState(null);
  const [loadingMoreYtComments, setLoadingMoreYtComments] = useState(false);
  const [fetchingVideos, setFetchingVideos]             = useState(false);
  const [fetchingComments, setFetchingComments]         = useState(false);
  const [analyzingYt, setAnalyzingYt]                   = useState(false);
  const [disconnectingYt, setDisconnectingYt]           = useState(false);

  const [igJustConnected, setIgJustConnected]           = useState(false);
  const [igPosts, setIgPosts]                           = useState([]);
  const [igNextCursor, setIgNextCursor]                 = useState(null);
  const [loadingMorePosts, setLoadingMorePosts]         = useState(false);
  const [selectedPost, setSelectedPost]                 = useState(null);
  const [igComments, setIgComments]                     = useState([]);
  const [igCommentsNextCursor, setIgCommentsNextCursor] = useState(null);
  const [loadingMoreIgComments, setLoadingMoreIgComments] = useState(false);
  const [fetchingIgPosts, setFetchingIgPosts]           = useState(false);
  const [fetchingIgComments, setFetchingIgComments]     = useState(false);
  const [analyzingIg, setAnalyzingIg]                   = useState(false);
  const [igActuallyConnected, setIgActuallyConnected]   = useState(false);
  const [disconnectingIg, setDisconnectingIg]           = useState(false);

  const planLimits = { free: 50, starter: 1500, pro: 5000, agency: Infinity };
  const limit = planLimits[user?.plan] || 50;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchHistory();
    checkInstagramConnected();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("youtube") === "connected") {
      window.history.replaceState({}, "", "/dashboard");
      setYoutubeJustConnected(true);
      refreshUser();
    }
    if (params.get("youtube") === "failed") {
      toast.error("YouTube connection failed. Try again.");
      window.history.replaceState({}, "", "/dashboard");
    }
    if (params.get("instagram") === "connected") {
      window.history.replaceState({}, "", "/dashboard");
      setIgJustConnected(true);
      setIgActuallyConnected(true);
    }
    if (params.get("instagram") === "failed") {
      toast.error("Instagram connection failed. Try again.");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (ytConnected && youtubeJustConnected) {
      toast.success("YouTube connected successfully!");
      setYoutubeJustConnected(false);
      switchTab("youtube");
    }
  }, [ytConnected, youtubeJustConnected]);

  useEffect(() => {
    if (igJustConnected && igActuallyConnected) {
      toast.success("Instagram connected successfully!");
      setIgJustConnected(false);
      switchTab("instagram");
    }
  }, [igJustConnected, igActuallyConnected]);

  useEffect(() => {
    if (activeTab === "youtube" && ytConnected && videos.length === 0) fetchYouTubeVideos();
  }, [activeTab, ytConnected]);

  useEffect(() => {
    if (activeTab === "instagram" && igActuallyConnected && igPosts.length === 0) fetchInstagramPosts();
  }, [activeTab, igActuallyConnected]);

  useEffect(() => {
    if (!selectedVideo || !ytConnected) return;
    const currentVideo = selectedVideo;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API}/api/v1/youtube/comments?video_id=${currentVideo.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const fresh = res.data.comments || [];
        setYtComments(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newComments = fresh.filter(c => !existingIds.has(c.id));
          if (newComments.length === 0) return prev;
          toast.success(`${newComments.length} new comment detected!`);
          analyzeBatched(newComments.map(c => c.text), "youtube", currentVideo.id).then(resultsArr => {
            setYtComments(all => all.map(c => {
              const idx = newComments.findIndex(n => n.id === c.id);
              if (idx !== -1 && resultsArr[idx]) return { ...c, result: resultsArr[idx] };
              return c;
            }));
          });
          return [...newComments, ...prev];
        });
      } catch { }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedVideo?.id, ytConnected]);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const ANALYZE_BATCH_SIZE = 50;
  const analyzeBatched = async (texts, platform, videoId) => {
    const results = [];
    for (let i = 0; i < texts.length; i += ANALYZE_BATCH_SIZE) {
      const chunk = texts.slice(i, i + ANALYZE_BATCH_SIZE);
      const res = await axios.post(`${API}/api/v1/comments/analyze`, { comments: chunk, platform, video_id: videoId }, authHeaders());
      results.push(...(res.data.results || []));
    }
    return results;
  };

  const checkInstagramConnected = async () => {
    try { await axios.get(`${API}/api/v1/instagram/posts`, authHeaders()); setIgActuallyConnected(true); }
    catch { setIgActuallyConnected(false); }
  };

  const handleAnalyze = async () => {
    const lines = comments.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) { toast.error("Paste at least one comment."); return; }
    if (lines.length > 50) { toast.error("Max 50 comments at once."); return; }
    setAnalyzing(true);
    try {
      const res = await axios.post(`${API}/api/v1/comments/analyze`, { comments: lines, platform: "manual" }, authHeaders());
      setResults(res.data.results || []);
      toast.success(`${lines.length} comment${lines.length > 1 ? "s" : ""} analyzed!`);
      fetchHistory();
    } catch (err) { toast.error(err?.response?.data?.error || "Analysis failed.");
    } finally { setAnalyzing(false); }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try { const res = await axios.get(`${API}/api/v1/comments`, authHeaders()); setHistory(res.data.comments || []); }
    catch { } finally { setLoadingHistory(false); }
  };

  const connectYouTube = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first!"); return; }
    try { const res = await axios.get(`${API}/api/v1/youtube/auth_url`, { headers: { Authorization: `Bearer ${token}` } }); window.location.href = res.data.url; }
    catch { toast.error("Could not initiate YouTube connection."); }
  };

  const disconnectYouTube = async () => {
    if (!window.confirm("Disconnect your YouTube channel?")) return;
    setDisconnectingYt(true);
    try { await axios.delete(`${API}/api/v1/youtube/disconnect`, authHeaders()); toast.success("YouTube disconnected."); setVideos([]); setSelectedVideo(null); setYtComments([]); await refreshUser(); }
    catch { toast.error("Could not disconnect YouTube."); } finally { setDisconnectingYt(false); }
  };

  const fetchYouTubeVideos = async () => {
    setFetchingVideos(true);
    try { const res = await axios.get(`${API}/api/v1/youtube/videos`, authHeaders()); setVideos(res.data.videos || []); setYtNextPageToken(res.data.next_page_token || null); }
    catch { toast.error("Could not fetch videos."); } finally { setFetchingVideos(false); }
  };

  const loadMoreVideos = async () => {
    if (!ytNextPageToken || loadingMoreVideos) return;
    setLoadingMoreVideos(true);
    try { const res = await axios.get(`${API}/api/v1/youtube/videos?page_token=${ytNextPageToken}`, authHeaders()); setVideos(prev => [...prev, ...(res.data.videos || [])]); setYtNextPageToken(res.data.next_page_token || null); }
    catch { toast.error("Could not load more videos."); } finally { setLoadingMoreVideos(false); }
  };

  const fetchVideoComments = async (video) => {
    setSelectedVideo(video); setYtComments([]); setYtCommentsNextToken(null); setFetchingComments(true);
    try {
      const res = await axios.get(`${API}/api/v1/youtube/comments?video_id=${video.id}`, authHeaders());
      const fetched = res.data.comments || [];
      setYtComments(fetched); setYtCommentsNextToken(res.data.next_page_token || null);
      if (fetched.length > 0) await autoAnalyzeYt(fetched, video);
    } catch { toast.error("Could not fetch comments."); } finally { setFetchingComments(false); }
  };

  const loadMoreYtComments = async () => {
    if (!ytCommentsNextToken || loadingMoreYtComments || !selectedVideo) return;
    setLoadingMoreYtComments(true);
    try {
      const res = await axios.get(`${API}/api/v1/youtube/comments?video_id=${selectedVideo.id}&page_token=${ytCommentsNextToken}`, authHeaders());
      const fetched = res.data.comments || [];
      setYtComments(prev => [...prev, ...fetched]); setYtCommentsNextToken(res.data.next_page_token || null);
      if (fetched.length > 0) await autoAnalyzeYt(fetched, selectedVideo, true);
    } catch { toast.error("Could not load more comments."); } finally { setLoadingMoreYtComments(false); }
  };

  const autoAnalyzeYt = async (commentsToAnalyze, video, append = false) => {
    setAnalyzingYt(true);
    try {
      const resultsArr = await analyzeBatched(commentsToAnalyze.map(c => c.text), "youtube", video?.id);
      const analyzed = commentsToAnalyze.map((c, i) => ({ ...c, result: resultsArr[i] }));
      if (append) { setYtComments(prev => { const ids = new Set(analyzed.map(c => c.id)); return prev.map(c => ids.has(c.id) ? analyzed.find(a => a.id === c.id) : c); }); }
      else { setYtComments(analyzed); }
    } catch { toast.error("Auto-analysis failed."); } finally { setAnalyzingYt(false); }
  };

  const deleteYtComment = async (commentId) => {
    try { await axios.delete(`${API}/api/v1/youtube/comments/${commentId}`, authHeaders()); setYtComments(prev => prev.filter(c => c.id !== commentId)); toast.success("Comment deleted!"); }
    catch { toast.error("Could not delete comment."); }
  };

  const connectInstagram = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first!"); return; }
    try { const res = await axios.get(`${API}/api/v1/instagram/auth_url`, { headers: { Authorization: `Bearer ${token}` } }); window.location.href = res.data.url; }
    catch (err) {
      if (err.response?.status === 403) toast.error(err.response.data.error || "Upgrade required.");
      else toast.error("Could not initiate Instagram connection.");
    }
  };

  const disconnectInstagram = async () => {
    if (!window.confirm("Disconnect your Instagram account?")) return;
    setDisconnectingIg(true);
    try { await axios.delete(`${API}/api/v1/instagram/disconnect`, authHeaders()); toast.success("Instagram disconnected."); setIgPosts([]); setSelectedPost(null); setIgComments([]); setIgActuallyConnected(false); await refreshUser(); }
    catch { toast.error("Could not disconnect Instagram."); } finally { setDisconnectingIg(false); }
  };

  const fetchInstagramPosts = async () => {
    setFetchingIgPosts(true);
    try { const res = await axios.get(`${API}/api/v1/instagram/posts`, authHeaders()); setIgPosts(res.data.posts || []); setIgNextCursor(res.data.next_cursor || null); }
    catch { toast.error("Could not fetch Instagram posts."); } finally { setFetchingIgPosts(false); }
  };

  const loadMorePosts = async () => {
    if (!igNextCursor || loadingMorePosts) return;
    setLoadingMorePosts(true);
    try { const res = await axios.get(`${API}/api/v1/instagram/posts?after=${igNextCursor}`, authHeaders()); setIgPosts(prev => [...prev, ...(res.data.posts || [])]); setIgNextCursor(res.data.next_cursor || null); }
    catch { toast.error("Could not load more posts."); } finally { setLoadingMorePosts(false); }
  };

  const fetchPostComments = async (post) => {
    setSelectedPost(post); setIgComments([]); setIgCommentsNextCursor(null); setFetchingIgComments(true);
    try {
      const res = await axios.get(`${API}/api/v1/instagram/comments?media_id=${post.id}`, authHeaders());
      const fetched = res.data.comments || [];
      setIgComments(fetched); setIgCommentsNextCursor(res.data.next_cursor || null);
      if (fetched.length > 0) await autoAnalyzeIg(fetched, post);
    } catch { toast.error("Could not fetch comments."); } finally { setFetchingIgComments(false); }
  };

  const loadMoreIgComments = async () => {
    if (!igCommentsNextCursor || loadingMoreIgComments || !selectedPost) return;
    setLoadingMoreIgComments(true);
    try {
      const res = await axios.get(`${API}/api/v1/instagram/comments?media_id=${selectedPost.id}&after=${igCommentsNextCursor}`, authHeaders());
      const fetched = res.data.comments || [];
      setIgComments(prev => [...prev, ...fetched]); setIgCommentsNextCursor(res.data.next_cursor || null);
      if (fetched.length > 0) await autoAnalyzeIg(fetched, selectedPost, true);
    } catch { toast.error("Could not load more comments."); } finally { setLoadingMoreIgComments(false); }
  };

  const autoAnalyzeIg = async (commentsToAnalyze, post, append = false) => {
    setAnalyzingIg(true);
    try {
      const resultsArr = await analyzeBatched(commentsToAnalyze.map(c => c.text), "instagram", post?.id);
      const analyzed = commentsToAnalyze.map((c, i) => ({ ...c, result: resultsArr[i] }));
      if (append) { setIgComments(prev => { const ids = new Set(analyzed.map(c => c.id)); return prev.map(c => ids.has(c.id) ? analyzed.find(a => a.id === c.id) : c); }); }
      else { setIgComments(analyzed); }
    } catch { toast.error("Auto-analysis failed."); } finally { setAnalyzingIg(false); }
  };

  const deleteIgComment = async (commentId) => {
    try { await axios.delete(`${API}/api/v1/instagram/comments/${commentId}`, authHeaders()); setIgComments(prev => prev.filter(c => c.id !== commentId)); toast.success("Comment deleted!"); }
    catch { toast.error("Could not delete comment."); }
  };

  const exportCSV = (data) => {
    const rows = [["Comment", "Author", "Label", "Confidence", "Language"]];
    data.forEach(r => rows.push([
      `"${(r.text || r.comment || "").replace(/"/g, '""')}"`,
      `"${(r.author || "").replace(/"/g, '""')}"`,
      r.label || r.result?.label || "",
      r.confidence || r.result?.confidence || "",
      r.language || r.result?.language || ""
    ]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "modera-results.csv"; a.click();
  };

  const toxicCount = (arr) =>
    arr.filter(r => (r.label || r.result?.label) === "toxic" || (r.label || r.result?.label) === "hate_speech").length;

  const copyTelegramToken = () => {
    const token = localStorage.getItem("token");
    navigator.clipboard.writeText(`/connect ${token}`);
    toast.success("Command copied! Paste it in ModeraAI Bot on Telegram.");
  };

  const handleLogout = () => {
    localStorage.removeItem("sl_active_tab");
    logout();
    navigate("/");
  };

  return (
    <div className="sl-dash">
      <aside className="sl-sidebar">
        <a href="/" className="sl-logo sl-dash-logo">Modera<span>AI</span></a>

        <nav className="sl-sidenav">
          <button className={`sl-sidenav-item ${activeTab === "manual" ? "active" : ""}`} onClick={() => switchTab("manual")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Manual Analyze
          </button>
          <button className={`sl-sidenav-item ${activeTab === "youtube" ? "active" : ""}`} onClick={() => switchTab("youtube")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
            {ytConnected && <span className="sl-connected-dot" />}
          </button>
          <button className={`sl-sidenav-item ${activeTab === "instagram" ? "active" : ""}`} onClick={() => switchTab("instagram")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
            {igActuallyConnected && <span className="sl-connected-dot" />}
          </button>
          <button className={`sl-sidenav-item ${activeTab === "history" ? "active" : ""}`} onClick={() => { switchTab("history"); fetchHistory(); }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </button>
          <button className={`sl-sidenav-item ${activeTab === "telegram" ? "active" : ""}`} onClick={() => switchTab("telegram")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Connect Telegram
          </button>
          <button className={`sl-sidenav-item ${activeTab === "billing" ? "active" : ""}`} onClick={() => switchTab("billing")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Billing
          </button>
          <button className={`sl-sidenav-item ${activeTab === "flagged" ? "active" : ""}`} onClick={() => switchTab("flagged")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
            Flagged Words
          </button>
        </nav>

        <div className="sl-sidebar-usage">
          <div className="sl-usage-title">
            <span>{user?.plan || "Free"} Plan</span>
            <button className="sl-upgrade-link" onClick={() => switchTab("billing")}>Upgrade →</button>
          </div>
          <UsageBar used={user?.monthly_usage_count || 0} total={limit} />
        </div>

        <div className="sl-sidebar-user">
          <div className="sl-sidebar-avatar">
            {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"}
          </div>
          <div className="sl-sidebar-info">
            <div className="sl-sidebar-name">{user?.name}</div>
            <div className="sl-sidebar-email">{user?.email}</div>
          </div>
          <button className="sl-sidebar-logout" onClick={handleLogout} title="Sign out">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </aside>

      <main className="sl-dash-main">
        <DashboardHeader user={user} activeTab={activeTab} />

        {/* ════════ MANUAL TAB ════════ */}
        {activeTab === "manual" && (
          <div className="sl-dash-content">
            <TabHeader title="Manual Analysis" sub="Paste comments below — one per line — and let AI classify them." />
            <div className="sl-feature-card sl-analyze-card">
              <label className="sl-label">Paste Comments (max 50, one per line)</label>
              <textarea className="sl-textarea" rows={8}
                placeholder={"bhai teri video bakwaas hai\nGreat content keep it up!\nSubscribe karo mere channel ko link bio mein"}
                value={comments} onChange={e => setComments(e.target.value)} />
              <div className="sl-analyze-footer">
                <span className="sl-comment-count">{comments.split("\n").filter(l => l.trim()).length} / 50 comments</span>
                <button className="sl-btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? (<><span className="sl-spinner-sm" /> Analyzing...</>) : (<><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Analyze</>)}
                </button>
              </div>
            </div>
            {results.length > 0 && (
              <div className="sl-results-section">
                <div className="sl-results-header">
                  <h2 className="sl-results-title">Results — <span className="sl-toxic-count">{toxicCount(results)} toxic</span> / {results.length} total</h2>
                  <button className="sl-btn-secondary sl-export-btn" onClick={() => exportCSV(results)}>Export CSV</button>
                </div>
                <div className="sl-results-list">
                  {results.map((r, i) => (
                    <div key={i} className="sl-result-row">
                      <div className="sl-result-text">{r.text || r.comment}</div>
                      <div className="sl-result-meta">
                        <LabelBadge label={r.label} />
                        <span className="sl-confidence">{Math.round((r.confidence || 0) * 100)}%</span>
                        <span className="sl-language">{r.language || "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ YOUTUBE TAB ════════ */}
        {activeTab === "youtube" && (
          <div className="sl-dash-content">
            <TabHeader title="YouTube" sub="Connect your channel — AI will analyze comments automatically." />
            {!ytConnected ? (
              <div className="sl-feature-card sl-yt-connect-card">
                <div className="sl-yt-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
                <h3 className="sl-yt-connect-title">Connect YouTube Channel</h3>
                <p className="sl-yt-connect-desc">Connect once — ModeraAI will automatically fetch and analyze comments.</p>
                <ul className="sl-yt-perks"><li>✓ Auto-fetch comments from all videos</li><li>✓ AI classifies toxic, spam, hate speech in Hinglish</li><li>✓ Real-time alerts for harmful comments</li></ul>
                <button className="sl-btn-primary sl-yt-connect-btn" onClick={connectYouTube}>Connect YouTube</button>
              </div>
            ) : (
              <div>
                <div className="sl-feature-card sl-yt-channel-card">
                  <div className="sl-yt-channel-info">
                    <div className="sl-yt-channel-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
                    <div><div className="sl-yt-channel-name">{user?.youtube_channel_name}</div><div className="sl-yt-channel-status"><span className="sl-connected-badge">● Connected</span></div></div>
                  </div>
                  <div className="sl-channel-actions">
                    <button className="sl-btn-secondary" onClick={fetchYouTubeVideos} disabled={fetchingVideos}>{fetchingVideos ? "Fetching..." : "↻ Refresh"}</button>
                    <button className="sl-btn-secondary sl-disconnect-btn" onClick={disconnectYouTube} disabled={disconnectingYt}>{disconnectingYt ? "..." : "Disconnect"}</button>
                  </div>
                </div>
                {fetchingVideos ? <div className="sl-loading">Fetching videos...</div> : (
                  <>
                    <div className="sl-videos-grid">
                      {videos.map(v => (
                        <div key={v.id} className={`sl-feature-card sl-video-card ${selectedVideo?.id === v.id ? "selected" : ""}`} onClick={() => fetchVideoComments(v)}>
                          {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="sl-video-thumb" />}
                          <div className="sl-video-title">{v.title}</div>
                          <div className="sl-video-meta"><span>💬 {v.comment_count || 0}</span>{v.toxic_count > 0 && <span className="sl-video-toxic">🔴 {v.toxic_count}</span>}</div>
                          <button className="sl-video-btn">{selectedVideo?.id === v.id && analyzingYt ? "Analyzing..." : "View & Analyze →"}</button>
                        </div>
                      ))}
                    </div>
                    {ytNextPageToken && <div className="sl-load-more-wrap"><button className="sl-btn-secondary sl-load-more-btn" onClick={loadMoreVideos} disabled={loadingMoreVideos}>{loadingMoreVideos ? <><span className="sl-spinner-sm" /> Loading...</> : "Load More Videos"}</button></div>}
                  </>
                )}
                {selectedVideo && (
                  <div className="sl-results-section">
                    <div className="sl-results-header">
                      <h2 className="sl-results-title">{selectedVideo.title}{ytComments.length > 0 && <span className="sl-comment-pill">{ytComments.length}</span>}{analyzingYt && <span className="sl-analyzing">⚡ Analyzing...</span>}</h2>
                      <div className="sl-results-actions">{ytComments.some(c => c.result) && (<><span className="sl-toxic-count">🔴 {toxicCount(ytComments)}</span><button className="sl-btn-secondary sl-export-btn" onClick={() => exportCSV(ytComments)}>Export CSV</button></>)}</div>
                    </div>
                    {fetchingComments ? <div className="sl-loading">Loading comments...</div> : (
                      <>
                        <div className="sl-results-list">
                          {ytComments.map((c, i) => (
                            <div key={i} className={`sl-result-row ${c.result?.label === "toxic" || c.result?.label === "hate_speech" ? "sl-result-row-toxic" : ""}`}>
                              <div className="sl-result-author">{c.author}</div>
                              <div className="sl-result-text">{c.text}</div>
                              {c.result ? (<div className="sl-result-meta"><LabelBadge label={c.result.label} /><span className="sl-confidence">{Math.round((c.result.confidence || 0) * 100)}%</span><span className="sl-language">{c.result.language || "—"}</span>{(c.result.label === "toxic" || c.result.label === "hate_speech") && <button className="sl-delete-btn" onClick={() => deleteYtComment(c.id)}>🗑 Delete</button>}<FeedbackButton commentDbId={c.comment_id} aiLabel={c.result.label} /></div>) : analyzingYt ? <div className="sl-result-meta"><span className="sl-analyzing">Analyzing...</span></div> : null}
                            </div>
                          ))}
                        </div>
                        {ytCommentsNextToken && <div className="sl-load-more-wrap"><button className="sl-btn-secondary sl-load-more-btn" onClick={loadMoreYtComments} disabled={loadingMoreYtComments}>{loadingMoreYtComments ? <><span className="sl-spinner-sm" /> Loading...</> : "Load More Comments"}</button></div>}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ INSTAGRAM TAB ════════ */}
        {activeTab === "instagram" && (
          <div className="sl-dash-content">
            <TabHeader title="Instagram" sub="Connect your account — AI will analyze comments automatically." />
            {!igActuallyConnected ? (
              user?.plan === "free" ? (
                <div className="sl-feature-card sl-yt-connect-card">
                  <h3 className="sl-yt-connect-title">Instagram — Starter Plan Required</h3>
                  <p className="sl-yt-connect-desc">Upgrade to Starter (₹299/month) to connect Instagram and unlock AI-powered comment moderation.</p>
                  <ul className="sl-yt-perks"><li>✓ 1,500 comments/month</li><li>✓ YouTube + Instagram</li><li>✓ Auto-delete toxic comments</li></ul>
                  <button className="sl-btn-primary sl-yt-connect-btn" onClick={() => switchTab("billing")}>Upgrade to Starter →</button>
                </div>
              ) : (
                <div className="sl-feature-card sl-yt-connect-card">
                  <h3 className="sl-yt-connect-title">Connect Instagram Account</h3>
                  <p className="sl-yt-connect-desc">Connect your Instagram Business account.</p>
                  <ul className="sl-yt-perks"><li>✓ Auto-fetch comments from all posts</li><li>✓ AI classifies toxic, spam, hate speech</li><li>✓ One-click delete for harmful comments</li></ul>
                  <button className="sl-btn-primary sl-yt-connect-btn" onClick={connectInstagram}>Connect Instagram</button>
                </div>
              )
            ) : (
              <div>
                <div className="sl-feature-card sl-yt-channel-card">
                  <div className="sl-yt-channel-info"><div><div className="sl-yt-channel-name">Instagram Connected</div><div className="sl-yt-channel-status"><span className="sl-connected-badge">● Connected</span></div></div></div>
                  <div className="sl-channel-actions">
                    <button className="sl-btn-secondary" onClick={fetchInstagramPosts} disabled={fetchingIgPosts}>{fetchingIgPosts ? "Fetching..." : "↻ Refresh"}</button>
                    <button className="sl-btn-secondary sl-disconnect-btn" onClick={disconnectInstagram} disabled={disconnectingIg}>{disconnectingIg ? "..." : "Disconnect"}</button>
                  </div>
                </div>
                {fetchingIgPosts ? <div className="sl-loading">Fetching posts...</div> : (
                  <>
                    <div className="sl-videos-grid">
                      {igPosts.length === 0 ? <div className="sl-empty"><div className="sl-empty-icon">📸</div><div className="sl-empty-text">No posts found.</div></div>
                        : igPosts.map(p => (
                          <div key={p.id} className={`sl-feature-card sl-video-card ${selectedPost?.id === p.id ? "selected" : ""}`} onClick={() => fetchPostComments(p)}>
                            {p.thumbnail && <img src={p.thumbnail} alt={p.caption || "Post"} className="sl-video-thumb" />}
                            <div className="sl-video-title">{p.caption || "No caption"}</div>
                            <div className="sl-video-meta"><span>💬 {p.comment_count || 0}</span></div>
                            <button className="sl-video-btn">{selectedPost?.id === p.id && analyzingIg ? "Analyzing..." : "View & Analyze →"}</button>
                          </div>
                        ))}
                    </div>
                    {igNextCursor && <div className="sl-load-more-wrap"><button className="sl-btn-secondary sl-load-more-btn" onClick={loadMorePosts} disabled={loadingMorePosts}>{loadingMorePosts ? <><span className="sl-spinner-sm" /> Loading...</> : "Load More Posts"}</button></div>}
                  </>
                )}
                {selectedPost && (
                  <div className="sl-results-section">
                    <div className="sl-results-header">
                      <h2 className="sl-results-title">{selectedPost.caption?.slice(0, 50) || "Post Comments"}{igComments.length > 0 && <span className="sl-comment-pill">{igComments.length}</span>}{analyzingIg && <span className="sl-analyzing">⚡ Analyzing...</span>}</h2>
                      <div className="sl-results-actions">{igComments.some(c => c.result) && (<><span className="sl-toxic-count">🔴 {toxicCount(igComments)}</span><button className="sl-btn-secondary sl-export-btn" onClick={() => exportCSV(igComments)}>Export CSV</button></>)}</div>
                    </div>
                    {fetchingIgComments ? <div className="sl-loading">Loading comments...</div> : igComments.length === 0 ? <div className="sl-empty"><div className="sl-empty-icon">💬</div><div className="sl-empty-text">No comments on this post.</div></div> : (
                      <>
                        <div className="sl-results-list">
                          {igComments.map((c, i) => (
                            <div key={i} className={`sl-result-row ${c.result?.label === "toxic" || c.result?.label === "hate_speech" ? "sl-result-row-toxic" : ""}`}>
                              <div className="sl-result-author">{c.author}</div>
                              <div className="sl-result-text">{c.text}</div>
                              {c.result ? (<div className="sl-result-meta"><LabelBadge label={c.result.label} /><span className="sl-confidence">{Math.round((c.result.confidence || 0) * 100)}%</span><span className="sl-language">{c.result.language || "—"}</span>{(c.result.label === "toxic" || c.result.label === "hate_speech") && <button className="sl-delete-btn" onClick={() => deleteIgComment(c.id)}>🗑 Delete</button>}<FeedbackButton commentDbId={c.comment_id} aiLabel={c.result.label} /></div>) : analyzingIg ? <div className="sl-result-meta"><span className="sl-analyzing">Analyzing...</span></div> : null}
                            </div>
                          ))}
                        </div>
                        {igCommentsNextCursor && <div className="sl-load-more-wrap"><button className="sl-btn-secondary sl-load-more-btn" onClick={loadMoreIgComments} disabled={loadingMoreIgComments}>{loadingMoreIgComments ? <><span className="sl-spinner-sm" /> Loading...</> : "Load More Comments"}</button></div>}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ HISTORY TAB ════════ */}
        {activeTab === "history" && (
          <div className="sl-dash-content">
            <TabHeader title="Analysis History" sub="All your past analyses in one place." />
            {loadingHistory ? <div className="sl-loading">Loading history...</div> : history.length === 0 ? (
              <div className="sl-empty"><div className="sl-empty-icon">📭</div><div className="sl-empty-text">No analyses yet.</div></div>
            ) : (
              <div className="sl-results-list">
                {history.map((item, i) => (
                  <div key={i} className="sl-result-row">
                    <div className="sl-result-platform">
                      <span className={`sl-platform-badge sl-platform-${item.platform}`}>{item.platform}</span>
                      <span className="sl-result-date">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="sl-result-text">{item.raw_text}</div>
                    {item.analysis_result && (<div className="sl-result-meta"><LabelBadge label={item.analysis_result.label} /><span className="sl-confidence">{Math.round((item.analysis_result.confidence_score || 0) * 100)}%</span></div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════ TELEGRAM TAB ════════ */}
        {activeTab === "telegram" && (
          <div className="sl-dash-content">
            <TabHeader title="Connect Telegram" sub="Link your account to get toxic comment alerts on Telegram." />
            {["pro", "agency"].includes(user?.plan) ? (
              <div className="sl-feature-card sl-yt-connect-card">
                <h3 className="sl-yt-connect-title">Link Your Telegram Account</h3>
                <p className="sl-yt-connect-desc">Get instant Telegram alerts whenever a toxic comment is detected.</p>
                <ul className="sl-yt-perks">
                  <li>1. Open <strong>@ModeraAIBot</strong> on Telegram</li>
                  <li>2. Click the button below to copy your connect command</li>
                  <li>3. Paste it in the bot chat and send</li>
                </ul>
                <button className="sl-btn-primary sl-yt-connect-btn" onClick={copyTelegramToken}>Copy Connect Command</button>
              </div>
            ) : (
              <div className="sl-feature-card sl-yt-connect-card">
                <h3 className="sl-yt-connect-title">Telegram — Pro Plan Required</h3>
                <p className="sl-yt-connect-desc">Telegram alerts are available on Pro plan (₹799/month) and above. Upgrade to get instant toxic comment notifications.</p>
                <button className="sl-btn-primary sl-yt-connect-btn" onClick={() => switchTab("billing")}>Upgrade to Pro →</button>
              </div>
            )}
          </div>
        )}

        {/* ════════ BILLING TAB ════════ */}
        {activeTab === "billing" && <BillingTab />}

        {/* ════════ FLAGGED WORDS TAB ════════ */}
        {activeTab === "flagged" && <FlaggedWordsPanel />}

      </main>
    </div>
  );
}
