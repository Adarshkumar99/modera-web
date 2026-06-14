// useDashboard.js — Dashboard ki saari state aur API functions ek jagah
// Yeh hook saare tabs mein share hota hai

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:3000";

export default function useDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // ── Active tab state ──
  const [activeTab, setActiveTab] = useState("manual");

  // ── Manual analysis state ──
  const [comments, setComments]   = useState("");
  const [results, setResults]     = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  // ── History state ──
  const [history, setHistory]               = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ── YouTube state ──
  const [youtubeJustConnected, setYoutubeJustConnected] = useState(false);
  const ytConnected = !!user?.youtube_channel_id;
  const [videos, setVideos]                     = useState([]);
  const [selectedVideo, setSelectedVideo]       = useState(null);
  const [ytComments, setYtComments]             = useState([]);
  const [fetchingVideos, setFetchingVideos]     = useState(false);
  const [fetchingComments, setFetchingComments] = useState(false);
  const [analyzingYt, setAnalyzingYt]           = useState(false);

  // ── Instagram state ──
  const [igJustConnected, setIgJustConnected]         = useState(false);
  const [igActuallyConnected, setIgActuallyConnected] = useState(false);
  const [igPosts, setIgPosts]                         = useState([]);
  const [selectedPost, setSelectedPost]               = useState(null);
  const [igComments, setIgComments]                   = useState([]);
  const [fetchingIgPosts, setFetchingIgPosts]         = useState(false);
  const [fetchingIgComments, setFetchingIgComments]   = useState(false);
  const [analyzingIg, setAnalyzingIg]                 = useState(false);

  // ── Plan limits ──
  const planLimits = { free: 100, starter: 1000, pro: 10000, agency: Infinity };
  const limit = planLimits[user?.plan] || 100;

  // ── Auth headers helper ──
  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  // ── 1. On mount — login check, history fetch, instagram check ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchHistory();
    checkInstagramConnected();
  }, []);

  // ── 2. OAuth callback detection — YouTube aur Instagram dono ──
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

  // ── 3. YouTube tab auto-switch after connect ──
  useEffect(() => {
    if (ytConnected && youtubeJustConnected) {
      toast.success("YouTube connected successfully!");
      setYoutubeJustConnected(false);
      setActiveTab("youtube");
    }
  }, [ytConnected, youtubeJustConnected]);

  // ── 4. Instagram tab auto-switch after connect ──
  useEffect(() => {
    if (igJustConnected && igActuallyConnected) {
      toast.success("Instagram connected successfully!");
      setIgJustConnected(false);
      setActiveTab("instagram");
    }
  }, [igJustConnected, igActuallyConnected]);

  // ── 5. YouTube videos auto-load when tab opens ──
  useEffect(() => {
    if (activeTab === "youtube" && ytConnected && videos.length === 0) {
      fetchYouTubeVideos();
    }
  }, [activeTab, ytConnected]);

  // ── 6. Instagram posts auto-load when tab opens ──
  useEffect(() => {
    if (activeTab === "instagram" && igActuallyConnected && igPosts.length === 0) {
      fetchInstagramPosts();
    }
  }, [activeTab, igActuallyConnected]);

  // ── 7. YouTube auto-polling — naye comments har 3 sec check karo ──
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
          axios.post(
            `${API}/api/v1/comments/analyze`,
            { comments: newComments.map(c => c.text), platform: "youtube", video_id: currentVideo.id },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          ).then(res => {
            setYtComments(all =>
              all.map(c => {
                const idx = newComments.findIndex(n => n.id === c.id);
                if (idx !== -1 && res.data.results?.[idx]) return { ...c, result: res.data.results[idx] };
                return c;
              })
            );
          });
          return [...newComments, ...prev];
        });
      } catch { }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedVideo?.id, ytConnected]);

  // ══════════════════════════════════════
  // MANUAL ANALYZE FUNCTIONS
  // ══════════════════════════════════════

  // Pasted comments ko AI se analyze karo
  const handleAnalyze = async () => {
    const lines = comments.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) { toast.error("Paste at least one comment."); return; }
    if (lines.length > 50) { toast.error("Max 50 comments at once."); return; }
    setAnalyzing(true);
    try {
      const res = await axios.post(
        `${API}/api/v1/comments/analyze`,
        { comments: lines, platform: "manual" },
        authHeaders()
      );
      setResults(res.data.results || []);
      toast.success(`${lines.length} comment${lines.length > 1 ? "s" : ""} analyzed!`);
      fetchHistory();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  // ══════════════════════════════════════
  // HISTORY FUNCTIONS
  // ══════════════════════════════════════

  // Saare past analyses fetch karo
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API}/api/v1/comments`, authHeaders());
      setHistory(res.data.comments || []);
    } catch { } finally {
      setLoadingHistory(false);
    }
  };

  // ══════════════════════════════════════
  // YOUTUBE FUNCTIONS
  // ══════════════════════════════════════

  // YouTube OAuth flow shuru karo
  const connectYouTube = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first!"); return; }
    try {
      const res = await axios.get(`${API}/api/v1/youtube/auth_url`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url;
    } catch {
      toast.error("Could not initiate YouTube connection.");
    }
  };

  // Connected channel ke videos fetch karo
  const fetchYouTubeVideos = async () => {
    setFetchingVideos(true);
    try {
      const res = await axios.get(`${API}/api/v1/youtube/videos`, authHeaders());
      setVideos(res.data.videos || []);
    } catch {
      toast.error("Could not fetch videos.");
    } finally {
      setFetchingVideos(false);
    }
  };

  // Video ke comments fetch karke auto-analyze karo
  const fetchVideoComments = async (video) => {
    setSelectedVideo(video);
    setYtComments([]);
    setFetchingComments(true);
    try {
      const res = await axios.get(
        `${API}/api/v1/youtube/comments?video_id=${video.id}`,
        authHeaders()
      );
      const fetched = res.data.comments || [];
      setYtComments(fetched);
      if (fetched.length > 0) await autoAnalyzeYt(fetched, video);
    } catch {
      toast.error("Could not fetch comments.");
    } finally {
      setFetchingComments(false);
    }
  };

  // YouTube comments ko AI se classify karo
  const autoAnalyzeYt = async (commentsToAnalyze, video) => {
    setAnalyzingYt(true);
    try {
      const res = await axios.post(
        `${API}/api/v1/comments/analyze`,
        { comments: commentsToAnalyze.map(c => c.text), platform: "youtube", video_id: video?.id },
        authHeaders()
      );
      setYtComments(commentsToAnalyze.map((c, i) => ({ ...c, result: res.data.results?.[i] })));
    } catch {
      toast.error("Auto-analysis failed.");
    } finally {
      setAnalyzingYt(false);
    }
  };

  // Toxic YouTube comment delete karo
  const deleteYtComment = async (commentId) => {
    try {
      await axios.delete(`${API}/api/v1/youtube/comments/${commentId}`, authHeaders());
      setYtComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Toxic comment deleted!");
    } catch {
      toast.error("Could not delete comment.");
    }
  };

  // ══════════════════════════════════════
  // INSTAGRAM FUNCTIONS
  // ══════════════════════════════════════

  // Instagram connected hai ya nahi — posts API se check karo
  const checkInstagramConnected = async () => {
    try {
      await axios.get(`${API}/api/v1/instagram/posts`, authHeaders());
      setIgActuallyConnected(true);
    } catch {
      setIgActuallyConnected(false);
    }
  };

  // Instagram OAuth flow shuru karo
  const connectInstagram = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first!"); return; }
    try {
      const res = await axios.get(`${API}/api/v1/instagram/auth_url`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url;
    } catch {
      toast.error("Could not initiate Instagram connection.");
    }
  };

  // Connected account ke posts fetch karo
  const fetchInstagramPosts = async () => {
    setFetchingIgPosts(true);
    try {
      const res = await axios.get(`${API}/api/v1/instagram/posts`, authHeaders());
      setIgPosts(res.data.posts || []);
    } catch {
      toast.error("Could not fetch Instagram posts.");
    } finally {
      setFetchingIgPosts(false);
    }
  };

  // Post ke comments fetch karke auto-analyze karo
  const fetchPostComments = async (post) => {
    setSelectedPost(post);
    setIgComments([]);
    setFetchingIgComments(true);
    try {
      const res = await axios.get(
        `${API}/api/v1/instagram/comments?media_id=${post.id}`,
        authHeaders()
      );
      const fetched = res.data.comments || [];
      setIgComments(fetched);
      if (fetched.length > 0) await autoAnalyzeIg(fetched, post);
    } catch {
      toast.error("Could not fetch comments.");
    } finally {
      setFetchingIgComments(false);
    }
  };

  // Instagram comments ko AI se classify karo
  const autoAnalyzeIg = async (commentsToAnalyze, post) => {
    setAnalyzingIg(true);
    try {
      const res = await axios.post(
        `${API}/api/v1/comments/analyze`,
        { comments: commentsToAnalyze.map(c => c.text), platform: "instagram", video_id: post?.id },
        authHeaders()
      );
      setIgComments(commentsToAnalyze.map((c, i) => ({ ...c, result: res.data.results?.[i] })));
    } catch {
      toast.error("Auto-analysis failed.");
    } finally {
      setAnalyzingIg(false);
    }
  };

  // Toxic Instagram comment delete karo
  const deleteIgComment = async (commentId) => {
    try {
      await axios.delete(`${API}/api/v1/instagram/comments/${commentId}`, authHeaders());
      setIgComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Toxic comment deleted!");
    } catch {
      toast.error("Could not delete comment.");
    }
  };

  // ══════════════════════════════════════
  // UTILITY FUNCTIONS
  // ══════════════════════════════════════

  // Results array ko CSV file mein convert karke download karo
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
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "siftly-results.csv"; a.click();
  };

  // Toxic aur hate speech comments ki count karo
  const toxicCount = (arr) =>
    arr.filter(r =>
      (r.label || r.result?.label) === "toxic" ||
      (r.label || r.result?.label) === "hate_speech"
    ).length;

  // Telegram bot se connect karne ka /connect command clipboard mein copy karo
  const copyTelegramToken = () => {
    const token = localStorage.getItem("token");
    navigator.clipboard.writeText(`/connect ${token}`);
    toast.success("Command copied! Paste it in Siftly Bot on Telegram.");
  };

  return {
    // Auth
    user, logout, navigate,
    // Tabs
    activeTab, setActiveTab,
    // Plan
    limit,
    // Manual
    comments, setComments, results, analyzing, handleAnalyze,
    // History
    history, loadingHistory, fetchHistory,
    // YouTube
    ytConnected, videos, selectedVideo, ytComments,
    fetchingVideos, fetchingComments, analyzingYt,
    connectYouTube, fetchYouTubeVideos, fetchVideoComments, deleteYtComment,
    // Instagram
    igActuallyConnected, igPosts, selectedPost, igComments,
    fetchingIgPosts, fetchingIgComments, analyzingIg,
    connectInstagram, fetchInstagramPosts, fetchPostComments, deleteIgComment,
    // Utils
    exportCSV, toxicCount, copyTelegramToken,
  };
}