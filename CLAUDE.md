# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Event site for a free 3-day "YouTube Monetization" live class by Ethio Computer School: a bilingual
(English / Amharic) landing page, Google sign-in registration, and an admin dashboard.
Next.js 16 App Router · React 19 · Prisma 7 · Neon Postgres · better-auth. Deployed on Vercel.

## Commands

```
npm install            # also runs `prisma generate` (postinstall)
npm run dev            # http://localhost:3000
npm run build
npx tsc --noEmit       # type-check; there is no lint script and no test suite
npx prisma migrate dev --name <change>   # create + apply a migration locally
npm run db:migrate     # prisma migrate deploy (production)
npx prisma generate    # regenerate client after editing prisma/schema.prisma
```

Secrets live in `.env.local` (see `.env.example`). `prisma.config.ts` loads `.env.local` then `.env`
and runs migrations on `DATABASE_URL_UNPOOLED`; the app itself uses the pooled `DATABASE_URL`.

## Architecture

**Prisma client is generated into `lib/generated/prisma`** (gitignored). Import from
`@/lib/generated/prisma/client`, never `@prisma/client`. `lib/db.ts` wraps it with the `pg` adapter and
a globalThis singleton.

**Server-only vs client-safe split.** Modules that touch the DB or auth import `"server-only"`
(`lib/db.ts`, `lib/auth.ts`, `lib/session.ts`, `lib/settings.ts`). `lib/settings-shared.ts` is the
client-safe counterpart: types, `DEFAULT_SETTINGS`, and pure helpers (time formatting, template `fill`,
`mergeSettings`, `calendarLink`, `hideVenue`). Keep that boundary when adding code.

**All site copy and event config is data, not code.** `SiteSettings` (dates, links, host, toggle, and
every string in both languages as `text.en` / `text.am`) is stored as one JSON row in the `setting` table
under key `"site"`, edited at `/admin/settings`. `getSettings()` deep-merges the stored row over
`DEFAULT_SETTINGS`, so adding a new text key means: add it to `SiteText` and both `en`/`am` defaults in
`settings-shared.ts`; existing DB rows pick it up automatically. Components must never hardcode
user-facing strings; read them from `s.text[lang]`. Strings may contain `<em>`/`<b>` markup and
`{token}` placeholders.

**Language.** `useLang()` (components/use-lang.tsx) holds the EN/AM choice in localStorage and sets
`<html lang>`; `globals.css` switches the font stack on `html[lang="am"]`.

**Time.** The event is in Ethiopia (UTC+3, no DST). Day windows are ISO strings with an explicit
`+03:00` offset; helpers in `settings-shared.ts` convert to/from `datetime-local` inputs and render
Ethiopian-clock labels for Amharic.

**Auth and admin gating.** better-auth (`lib/auth.ts`, handler at `app/api/auth/[...all]/route.ts`)
with Google for registrants and email + password for admins (sign-up disabled; credential rows are
seeded directly in the `account` table). `getCurrentUser()` in `lib/session.ts` is request-cached and
sets `isAdmin` via `lib/admins.ts`: the email is either in the `ADMIN_EMAILS` env var or in the
`setting` row with key `"admins"` (a JSON array of emails). Every admin server action starts with
`await assertAdmin()`; admin pages return `<AdminLogin />` when signed out and `notFound()` for
non-admins (so `/admin` 404s for outsiders).

**Registration flow.** `/register` → Google sign-in → phone form → `registerAction` upserts a
`Registration` (auto-increment `seat`) and copies name/phone onto the user → redirect to `/thank-you`.
Venue details (Telegram link, subscribe link, post-registration copy) are stripped with `hideVenue()`
for anyone without a registration; only `/thank-you` and the landing page for registered users receive
them. Phone numbers are normalised to E.164 by `lib/phone.ts` (Ethiopian local formats → `+251…`).

**Data mutations are server actions** (`app/register/actions.ts`, `app/admin/actions.ts`) called from
client components via `useActionState` / `useTransition`, validated with zod, followed by
`revalidatePath`. The one route handler besides auth is the CSV export at `app/api/admin/export`.

**Rendering.** Every page is `force-dynamic`. Pages are thin server components that load settings +
user and hand props to a `"use client"` component in `components/`.

**Styling** is a single hand-written `app/globals.css` with CSS variables and plain class names. No
Tailwind, no CSS modules. Fonts come from `next/font/google` in `app/layout.tsx`.
