# KSP Chronicles

A full-stack web application for tracking and sharing Kerbal Space Program campaign progress — built as a living mission archive for two independent space agencies.

## Overview

KSP Chronicles hosts two agencies — **Valkyrie Orbital** and the **Brown Aerospace Initiative** — each with their own visual identity, mission data, and admin access. Readers can follow either agency's progress in real time, while each admin independently manages their own chronicle.

## Features

- **Mission archive** — log missions with screenshots, tags, career phase, outcome, crew, science, funds, and contracts
- **Fleet registry** — track every rocket, lander, station, and vehicle with images and mission counts
- **Crew roster** — register Kerbals with photos, roles, star ratings, and mission history
- **Campaign timeline** — chronological mission history grouped by career phase
- **Agency bio** — fully editable Markdown profile page per agency
- **Admin panel** — protected per-agency dashboard for logging, editing, and deleting all records
- **Public reader view** — clean, read-only access for anyone with the link

## Stack

- **React + Vite** — frontend framework and build tool
- **Supabase** — PostgreSQL database, authentication, and image storage
- **React Router** — client-side routing with per-agency path prefixes
- **GitHub Pages** — static hosting via `gh-pages`

## Agencies

| Agency | Theme | Admin |
|---|---|---|
| Valkyrie Orbital | Black + Gold | denyadev@proton.me |
| Brown Aerospace Initiative | Charcoal + Red-orange | yt.universaly@gmail.com |

## Deployment

```bash
npm run deploy
```

Live at: `https://denyakushnirchuk-glitch.github.io/valkyrie-orbital/`