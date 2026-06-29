export const FEATURES = [
  { icon: "🧠", color: "sl-fi-blue",   title: "Hinglish Intelligence",  desc: "Understands Roman Hindi, mixed scripts, regional slang, and context — not just keyword matching." },
  { icon: "⚡", color: "sl-fi-green",  title: "Real-time Moderation",   desc: "Comments analyzed under 1 second. Auto-hide or delete toxic content before your audience sees it." },
  { icon: "🎯", color: "sl-fi-purple", title: "Smart Categories",        desc: "5 precise labels — Safe, Toxic, Spam, Hate, Warning — with confidence scores and suggested actions." },
  { icon: "📊", color: "sl-fi-orange", title: "Analytics Dashboard",     desc: "Track comment trends, toxic spikes, peak hours, and audience sentiment over time." },
  { icon: "🔗", color: "sl-fi-pink",   title: "Multi-Platform",          desc: "Connect YouTube, Instagram, and Telegram in one dashboard. One tool, all platforms." },
  { icon: "🛡️", color: "sl-fi-teal",  title: "Auto-Actions",            desc: "Set rules once — ModeraAI auto-deletes, hides, or flags comments based on your preferences." },
];

export const PLATFORMS = [
  { icon: "▶️", name: "YouTube",   status: "✓ Live",      live: true },
  { icon: "📸", name: "Instagram", status: "✓ Live",      live: true },
  { icon: "✈️", name: "Telegram",  status: "✓ Live",      live: true },
  { icon: "🎵", name: "TikTok",    status: "Coming Soon", live: false },
];

export const STEPS = [
  { num: 1, title: "Connect Platform",  desc: "Link your YouTube, Instagram, or Telegram with one-click OAuth." },
  { num: 2, title: "AI Analyzes",       desc: "Every incoming comment is analyzed in under 1 second by our Hinglish AI." },
  { num: 3, title: "Auto Action",       desc: "Toxic comments are auto-hidden, deleted, or flagged based on your rules." },
  { num: 4, title: "Review & Grow",     desc: "Monitor your clean community via dashboard with full analytics." },
];

export const PLANS = [
  { name: "Free",    price: "₹0",    period: "Forever free",    popular: false, features: ["50 comments/month","1 platform","Basic categories","Manual review"], cta: "Get Started" },
  { name: "Starter", price: "₹299",  period: "Billed monthly",  popular: true,  features: ["500 comments/month","3 platforms","Auto-hide toxic","Analytics dashboard","Email alerts"], cta: "Start Free Trial" },
  { name: "Pro",     price: "₹799",  period: "Billed monthly",  popular: false, features: ["Unlimited comments","All platforms","Auto-delete + ban","Advanced analytics","API access","Priority support"], cta: "Get Pro" },
  { name: "Agency",  price: "₹2499", period: "Billed monthly",  popular: false, features: ["10 client accounts","White-label option","Dedicated support","Custom rules engine","Bulk export"], cta: "Contact Us" },
];

export const DEMO_COMMENTS = [
  { text: "Bhai kya video banayi hai! Mast content 🔥",          tag: "✓ Safe",   cls: "sl-tag-safe" },
  { text: "subscribe karo free iphone milega link bio mein",     tag: "⚠ Spam",   cls: "sl-tag-spam" },
  { text: "ye sab bekar log hain, band karo inhe",               tag: "✗ Toxic",  cls: "sl-tag-toxic" },
  { text: "OMG this is actually fire content yaar!",             tag: "✓ Safe",   cls: "sl-tag-safe" },
];
