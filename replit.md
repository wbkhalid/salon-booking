# Looks N Styles – Beauty Salon Website

## Overview

A premium, fully functional beauty salon website for "Looks N Styles" in Lahore, Pakistan. Built as a pnpm workspace monorepo with a React + Vite frontend and an Express API backend connected to PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Wouter routing
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Session management**: express-session (admin auth)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/salon run dev` — run frontend locally

## Website Pages

- `/` — Home: Hero, featured services, testimonials, gallery CTA
- `/services` — All salon services with category filters
- `/booking` — 3-step appointment booking flow
- `/gallery` — Image gallery with lightbox
- `/reviews` — Customer reviews + submission form
- `/contact` — Contact form + salon details + Google Maps
- `/admin` — Admin dashboard (password: `admin123`)

## Admin Dashboard Features

- View/manage all appointments (change status: pending/confirmed/completed/cancelled)
- Add/edit/delete services
- Add/delete gallery images
- Approve/delete customer reviews
- View contact messages
- Appointment statistics

## Database Tables

- `services` — Salon services (name, price, duration, category)
- `appointments` — Customer bookings (with double-booking prevention)
- `gallery` — Gallery images (URL, caption, category)
- `reviews` — Customer reviews (with admin approval system)
- `contact_messages` — Contact form submissions

## API Endpoints

All under `/api`:
- `GET/POST /services`, `GET/PATCH/DELETE /services/:id`
- `GET/POST /appointments`, `GET/PATCH/DELETE /appointments/:id`
- `GET /appointments/available-slots` — dynamic slot availability
- `GET /appointments/stats` — admin stats
- `GET/POST /gallery`, `DELETE /gallery/:id`
- `GET/POST /reviews`, `PATCH /reviews/:id/approve`, `DELETE /reviews/:id`
- `GET/POST /contact`
- `POST /admin/login`, `POST /admin/logout`, `GET /admin/me`

## Artifacts

- `artifacts/salon` — React + Vite frontend (served at `/`)
- `artifacts/api-server` — Express API server (served at `/api`)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
