import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Shield3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const cards = [
      { text: "madarchod",       label: "Toxic",  color: "#f72585", delay: 0   },
      { text: "bhai mast video", label: "Safe",   color: "#06d6a0", delay: 0.8 },
      { text: "sub4sub karo",    label: "Spam",   color: "#f4a261", delay: 1.6 },
      { text: "sab kafir hain",  label: "Hate",   color: "#7209b7", delay: 2.4 },
      { text: "great content!",  label: "Safe",   color: "#06d6a0", delay: 3.2 },
    ];

    const W = canvas.width  = 500;
    const H = canvas.height = 560;

    function drawShield(cx, cy, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const grd = ctx.createRadialGradient(cx, cy - size * 0.1, size * 0.1, cx, cy, size * 1.1);
      grd.addColorStop(0, "rgba(79,142,247,0.18)");
      grd.addColorStop(1, "rgba(79,142,247,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      const s = size;
      ctx.moveTo(cx, cy - s);
      ctx.bezierCurveTo(cx + s * 0.85, cy - s * 0.7, cx + s * 0.85, cy + s * 0.2, cx, cy + s);
      ctx.bezierCurveTo(cx - s * 0.85, cy + s * 0.2, cx - s * 0.85, cy - s * 0.7, cx, cy - s);
      ctx.closePath();
      const sg = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
      sg.addColorStop(0, "rgba(79,142,247,0.15)");
      sg.addColorStop(0.5, "rgba(124,58,237,0.12)");
      sg.addColorStop(1, "rgba(6,214,160,0.08)");
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.strokeStyle = "rgba(79,142,247,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.strokeStyle = "rgba(6,214,160,0.9)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.28, cy);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.25);
      ctx.lineTo(cx + s * 0.32, cy - s * 0.22);
      ctx.stroke();
      ctx.restore();
    }

    function drawCard(x, y, text, label, color, alpha) {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const w = 180, h = 40, r = 8;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(18,20,30,0.92)";
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
      ctx.fill();
      ctx.strokeStyle = color + "55";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x - w / 2 + 14, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(200,210,230,0.9)";
      ctx.font = "12px 'DM Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(text, x - w / 2 + 26, y + 4);
      const lw = ctx.measureText(label).width + 14;
      ctx.fillStyle = color + "22";
      ctx.beginPath();
      ctx.roundRect(x + w / 2 - lw - 6, y - 10, lw, 20, 4);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = "bold 10px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x + w / 2 - lw / 2 - 6, y + 4);
      ctx.restore();
    }

    const orbits = [
      { rx: 190, ry: 60,  baseAngle: -0.3  },
      { rx: 200, ry: 70,  baseAngle: 0.9   },
      { rx: 185, ry: 55,  baseAngle: 2.1   },
      { rx: 195, ry: 65,  baseAngle: 3.3   },
      { rx: 188, ry: 58,  baseAngle: 4.5   },
    ];

    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      const cx = W / 2;
      const cy = H / 2 - 20;
      const shieldBob = Math.sin(t * 0.7) * 8;
      ctx.save();
      ctx.translate(cx, cy + shieldBob);
      ctx.rotate(t * 0.2);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 140 + i * 18, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79,142,247,${0.06 - i * 0.015})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + t * 0.3;
        const r = 125 + Math.sin(t * 1.2 + i) * 20;
        const px = cx + Math.cos(angle) * r;
        const py = cy + shieldBob + Math.sin(angle) * r * 0.4;
        const pa = 0.3 + Math.sin(t * 2 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${pa})`;
        ctx.fill();
      }
      drawShield(cx, cy + shieldBob, 90, 1);
      cards.forEach((card, i) => {
        const orb = orbits[i];
        const phase = t * 0.5 + card.delay;
        const cardX = cx + Math.cos(phase) * orb.rx;
        const cardY = cy + shieldBob + Math.sin(phase) * orb.ry;
        const alpha = 0.6 + Math.sin(phase) * 0.4;
        drawCard(cardX, cardY, card.text, card.label, card.color, Math.max(0, alpha));
      });
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: 500,
        height: "auto",
        filter: "drop-shadow(0 0 40px rgba(79,142,247,0.15))",
      }}
    />
  );
}

export default function Hero() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCTA = (e) => {
    e.preventDefault();
    navigate(isLoggedIn ? "/dashboard" : "/signup");
  };

  return (
    <section className="sl-hero">
      <div className="sl-orb sl-orb1" />
      <div className="sl-orb sl-orb2" />
      <div className="sl-orb sl-orb3" />

      <div className="sl-hero-inner">
        <div className="sl-hero-left">
          <div className="sl-hero-badge">
            <div className="sl-badge-dot" />
            AI-Powered · Hinglish Ready · Real-time
          </div>
          <h1 className="sl-h1">
            Stop Toxic<br />Comments<br />
            <span className="sl-h1-grad">Before They Spread</span>
          </h1>
          <p className="sl-hero-sub">
            India's first AI moderation tool that truly understands Hinglish,
            Roman Hindi, and desi slang. Built for YouTube, Instagram &amp; Telegram creators.
          </p>
          <div className="sl-hero-actions">
            <a href="#" onClick={handleCTA} className="sl-btn-primary">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              {isLoggedIn ? "Go to Dashboard" : "Start Free — No Card Needed"}
            </a>
            <a href="#features" className="sl-btn-secondary">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              See How It Works
            </a>
          </div>
        </div>
        <div className="sl-hero-right">
          <Shield3D />
        </div>
      </div>
    </section>
  );
}