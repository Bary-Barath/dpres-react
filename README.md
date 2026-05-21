# DPRES — Disaster Preparedness & Response Education System

A campus safety-training web app: drills, evacuation maps, AI scenario simulator,
quizzes, and leaderboards, with separate admin and student portals.

Built with **React 19**, **Vite 6**, **Tailwind CSS 4**, **Framer Motion**, and **lucide-react**.

## Getting started

```bash
npm install
npm run dev          # start dev server on http://localhost:5173
npm run build        # production build to dist/
npm run preview      # serve the production build locally
npm run lint         # eslint
```

## Demo credentials

These are **mock** credentials wired into `src/App.jsx` for demoing the two roles.
They are not real auth — do not ship this as-is.

| Role    | Email                     | Password       |
| ------- | ------------------------- | -------------- |
| Admin   | (any admin in registry)   | `Admin@2026`   |
| Student | `alex.smith@campus.edu`   | `Student@2026` |

New student accounts can also be created via the signup flow on `#/login`.

## Project layout

```
src/
  App.jsx               # router (hash-based) + auth context + toast/alert layer
  main.jsx              # Vite entry
  index.css             # Tailwind import + base styles
  components/           # landing-page + shared UI (Navbar, Hero, Sidebar, …)
  pages/                # routed pages (AdminDashboard, StudentPortal, Quiz, …)
  data/                 # mock campus + quiz data
  hooks/                # useRoute, useAppData
  utilities/            # mockGemini (AI simulator stub)
public/                 # favicon + icons
legacy/index.html       # the original standalone single-file prototype (kept for reference)
```

## Routes

Hash-based router (`#/...`):

- `#/` or `#/home` — landing page
- `#/login` — auth
- `#/admin`, `#/admin/students`, `#/admin/drills` — admin portal
- `#/portal`, `#/portal/quiz/:id`, `#/portal/simulator`, `#/portal/map`,
  `#/portal/leaderboard`, `#/portal/contacts`, `#/portal/settings` — student portal

## Notes

- `legacy/index.html` is the older single-file CDN-React prototype, kept as a
  reference. It is **not** loaded by Vite.
- Mock credentials and an in-memory user registry live in `src/App.jsx` and
  `src/data/`. Replace with a real backend before any real-world use.
