# ModeraAI Frontend (modera-web)

React + Vite frontend for ModeraAI — landing page + dashboard for an AI
comment moderation tool (YouTube/Instagram/Telegram) targeted at Indian
creators dealing with Hindi/Hinglish toxic comments.

## Stack
- React (Vite, JSX, no TypeScript)
- React Router (`react-router-dom`)
- Axios for API calls
- `react-hot-toast` for notifications
- Plain CSS per-component (`src/styles/*.css`), no Tailwind/CSS-in-JS
- Canvas-based custom animations (no Three.js/heavy 3D libs) — see `Hero.jsx`

## Structure
- `src/pages/` — route-level pages (`Dashboard.jsx` is the big one — all
  tabs for manual/youtube/instagram/history/telegram/billing/flagged live
  in this single file with tab-based conditional rendering)
- `src/components/` — landing page sections (Hero, Features, Pricing, etc.)
- `src/components/dashboard/` — dashboard-specific pieces (BillingTab,
  FeedbackButton, FlaggedWordsPanel, Sidebar, UsageBar, LabelBadge)
- `src/context/AuthContext.jsx` — global auth state + axios interceptor
- `src/hooks/useAuth.js` — separate from AuthContext, used in places that
  don't need the full context (e.g. Hero CTA button)
- `src/data/constants.js` — static content (FEATURES array, demo comments)

## Backend connection
`VITE_API_URL` env var (`.env.local` for dev, set in Vercel/host for prod).
NEVER hardcode `http://127.0.0.1:3000` — always read from
`import.meta.env.VITE_API_URL`.

## Critical patterns / gotchas
- **Global 401 interceptor** (`AuthContext.jsx`): any 401 response force-logs
  the user out and redirects to `/login`. Platform-specific errors (YouTube
  token expired, Instagram not connected) must come back from backend as
  `422`, not `401` — or this interceptor wrongly nukes the session. If a new
  backend error code needs special handling, check
  `isPlatformReconnectError` logic in the interceptor.
- **Comment analysis batching**: `/api/v1/comments/analyze` caps backend
  requests at 50 comments. `analyzeBatched()` in `Dashboard.jsx` chunks larger
  arrays (e.g. 100-comment YouTube pages) into 50-sized requests automatically
  — always use this helper, never call `axios.post(.../analyze)` directly
  with an unbounded array.
- **Pagination**: YouTube/Instagram videos, posts, and comments are all
  paginated via `next_page_token` / `next_cursor` from backend. "Load More"
  buttons only render when that token is present. Never fetch all pages
  upfront — some channels have 1000+ videos.
- **Dashboard tab state** persists via `localStorage.getItem("sl_active_tab")`
  — refreshing the page keeps the user on the same tab.
- **Disconnect buttons** (YouTube/Instagram) only render when actually
  connected (`ytConnected` / `igActuallyConnected` flags) — never show a
  disconnect option for a platform that isn't linked.
- **Dashboard has no global Navbar** — `App.jsx` explicitly hides it on
  `/dashboard` because the sidebar has its own logo + nav. There's a separate
  `DashboardHeader` component (sticky top bar inside `sl-dash-main`) for
  breadcrumb/plan badge/avatar — don't confuse this with the landing-page
  `Navbar.jsx`.

## Styling conventions
- All class names prefixed `sl-` (legacy from "Siftly", the old project name
  — kept for consistency, don't rename mid-refactor)
- CSS variables defined in `global.css` (`--sl-bg`, `--sl-accent`, `--sl-text2`
  etc.) — always use these instead of hardcoded hex colors
- Minimal/no Tailwind — write actual CSS in the matching `styles/*.css` file
- Hero/Features sections use scroll-reveal + canvas animations — keep heavy
  animation logic in `useEffect` with `requestAnimationFrame`, clean up with
  `cancelAnimationFrame` on unmount

## Known tech debt
- `Dashboard.jsx` is a single large file with all tabs — not yet split into
  per-tab components. Be careful with merge conflicts / large edits here.
- Project was renamed from "Siftly" to "ModeraAI" — some internal naming
  (CSS classes, copied comments) may still reference the old name.
