# ModeraAI Frontend Codex Guide

This is the React + Vite frontend for ModeraAI. Follow these instructions when working in this repository.

## Work Style

- Keep changes scoped to the requested feature or bug. Do not refactor unrelated code while passing through.
- Preserve existing project guidance from `CLAUDE.md` and `.claude/`; this file is the Codex-facing summary, not a replacement.
- Prefer precise React and Vite conventions over new abstractions unless they remove real duplication.
- Never read, print, or commit `.env.local` contents. Use `VITE_API_URL` from the environment.

## Project Stack

- React 19 + Vite
- React Router
- Axios for API calls
- `react-hot-toast` for notifications
- Plain CSS per component in `src/styles/*.css`

## Verification Commands

Use the narrowest useful check first:

```bash
npm run lint
npm run build
```

For small component, hook, or context changes, run the relevant command before considering the task done.

## Code Review Checklist

- Avoid breaking the global `401` logout behavior in `src/context/AuthContext.jsx`.
- Do not hardcode the backend URL; always use `import.meta.env.VITE_API_URL`.
- Respect backend pagination tokens like `next_page_token` and `next_cursor`.
- Keep comment analysis batching intact; do not send unbounded arrays to the API.
- Keep the `sl-` class prefix and the existing plain CSS approach.

## UI and Styling Rules

- Keep animations lightweight and cleanup-safe.
- Prefer CSS variables from `src/styles/global.css` over hardcoded colors.
- Avoid switching the codebase to Tailwind or CSS-in-JS unless explicitly requested.
