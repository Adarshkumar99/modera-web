---
name: react-app-debugging
description: "Debug React/Vite frontend bugs. Use when reproducing UI issues, tracing state/render/network problems, fixing regressions, or validating browser behavior."
argument-hint: "What React bug are you debugging?"
---

# React App Debugging

## When to Use

- A React screen renders incorrectly or not at all.
- State, props, effects, routing, or context behavior looks wrong.
- A browser console error, network failure, or build/lint error needs to be traced to its source.
- A regression needs a small, local fix and a focused validation step.

## Procedure

1. Restate the expected behavior, the observed behavior, and the smallest reliable repro path.
2. Identify the exact surface area first: route, page, component, hook, context, API call, or effect.
3. Gather the cheapest discriminating evidence available:

- Browser console errors
- Network failures and response shapes
- Terminal, build, or lint errors
- A screenshot or DOM snapshot if the issue is visual

4. Form one local hypothesis about the controlling code path.
5. Make the smallest edit that tests that hypothesis.
6. Validate immediately with the narrowest useful check:

- A targeted browser repro
- `npm run lint` for code-level issues
- `npm run build` for build-time regressions

7. If the hypothesis is wrong, move one hop closer to the actual controller and repeat.
8. Stop when the behavior is fixed and the validation path passes.

## Decision Points

- If the problem is runtime-only, inspect the browser console and network before changing code.
- If the problem is a build or lint failure, fix the reported file and rerun the narrow check first.
- If the problem is state-related, inspect the nearest hook, reducer, or context provider before touching the UI shell.
- If the problem is API-related, confirm request payloads, status codes, and response shapes before editing rendering code.
- If the problem is routing-related, verify the active route, guards, and redirect conditions before changing layout logic.

## Completion Checks

- The original repro no longer fails.
- The fix is localized to the owning code path.
- The narrow validation used during the investigation passes.
- Any related comments or docs that became inaccurate have been updated.

## Repo-Specific Checks

- Use `npm run lint` before widening the search if the bug might be code-quality related.
- Use `npm run build` if the issue could be caused by a bundling, import, or syntax problem.
- Use the browser and network panel to confirm `VITE_API_URL` is set correctly before touching request code.
- If a 401 unexpectedly logs the user out, inspect `src/context/AuthContext.jsx` before changing dashboard or login code.
- If comment analysis breaks on larger batches, inspect `analyzeBatched()` in `src/pages/Dashboard.jsx` before changing API usage.
- If a dashboard view seems to reset on refresh, check the `sl_active_tab` localStorage path before changing navigation state.

## Repository Notes

- In this repo, prefer `VITE_API_URL` over hardcoded backend URLs.
- Check `CLAUDE.md` for repo-specific patterns and gotchas before widening the search.
- Keep edits consistent with the existing React + Vite, JSX, and CSS-per-component structure.
