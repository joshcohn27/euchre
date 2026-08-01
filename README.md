# Euchre Tracker

A single-page installable web app for tracking euchre games, sessions, and stats with friends. Built as one static `index.html` file with vanilla JS, IndexedDB for local storage, and Supabase for auth, cloud sync, and the global leaderboard.

## About this project

The product design, feature set, UX flow, and visual design are mine end to end - what to build, how it should behave, and how it should look and feel. Implementation was done with AI-assisted coding (Claude Code), which I directed and reviewed throughout: I made the architecture and product calls, and used AI as a tool to accelerate writing and iterating on the code itself.

## Features

- **Log games** - record partner, opponents, win/loss, stakes (per game / per bump), dollar amount, and notes
- **Sessions** - consecutive games with the same partner are grouped into a session automatically; sessions can be resumed after closing the app
- **Round Robin mode** - track a 3-game rotation as a single group
- **History** - searchable, grouped by session, with edit/delete and CSV export
- **Stats** - overall record, money, streaks, session performance, best/worst partners and opponents, round robin record
- **Leaderboard** - global rankings across all users, sortable by net winnings, win rate, wins, games, biggest win/loss; tap a player to see their full stats
- **Private stats** - users can hide their stats and name from the leaderboard and player stats modal via a settings toggle
- **Guest mode** - view the leaderboard without signing in
- **Accounts** - username + PIN auth (backed by Supabase Auth), with profile editing and PIN change
- **Admin panel** - user and game management (edit/reset/ban users, edit/delete games) for the admin account, backed by a secure Supabase Edge Function
- **Themes** - Dark Purple, Dark Green, Light Green
- **PWA support** - installable to home screen, offline caching, and auto-refresh on new deploys via a service worker
- **Feedback** - in-app "What's New" changelog (with a one-time post-login nudge to check it out) and a "Contact Support" form (submits to a Google Form)

## Tech stack

- Plain HTML/CSS/JS - no build step, no framework, no bundler
- [Supabase](https://supabase.com) (`@supabase/supabase-js` via CDN) for auth, Postgres storage, and the leaderboard
- A Supabase Edge Function (`admin-actions`, managed in the Supabase dashboard, not tracked in this repo) for privileged admin-panel operations
- Browser `IndexedDB` for local-first storage before sign-in (auto-migrated to Supabase on first login)
- A service worker (`sw.js`) for offline caching and cache-busting on new versions

## File overview

| File | Purpose |
|---|---|
| `index.html` | The entire app: markup, styles, and client logic |
| `sw.js` | Service worker - caches app shell assets and clears stale caches on activate |
| `manifest.json` | PWA manifest (name, icons, theme colors, standalone display) |
| `icon.png`, `icon192.png`, `icon.jpeg` | App icons |
| `backup/games-backup.json` | A local backup snapshot of logged games |
| `.claude/` | Claude Code settings for this project |

## Running locally

No build step is required. Serve the directory with any static file server, for example:

```
npx serve .
```

Then open the served URL in your browser. Since the app registers a service worker and calls out to Supabase, serve it over `http` (localhost is fine) rather than opening `index.html` directly via `file://`.

## Deployment note

`index.html` embeds the Supabase URL and anon key directly (safe to expose, as they're protected by Supabase row-level security). Whenever `index.html` changes, the `CACHE` constant at the top of `sw.js` must be bumped with the current unix timestamp so returning users get the new version instead of a stale cached copy.
