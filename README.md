# STC-2026 Website

Modern Next.js website for **STC-2026 - Summer Tech Camp 2026** in Chiroqchi.

Includes:
- Landing page in Uzbek Latin
- Camp detail pages with 45-day module plans
- STC Guide AI chat quiz with Groq support and deterministic fallback
- Registration form with Firestore or localStorage demo fallback
- Hidden admin panel at `/admin-stc-2026`
- Analytics charts, filters, admin notes/status, CSV export

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

Update `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ADMIN_PASSCODE=change_this_passcode
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-70b-versatile
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_REGISTRATION_DEADLINE=2026-07-11T23:59:00+05:00
NEXT_PUBLIC_FIRST_LESSON=2026-07-13T09:00:00+05:00
NEXT_PUBLIC_REFERRAL_DISCOUNT=50000
NEXT_PUBLIC_TELEGRAM=@your_username
NEXT_PUBLIC_PHONE=+998 XX XXX XX XX
```

If Firestore keys are missing, registrations are stored in browser `localStorage` for demo/development.

## Firestore

1. Create a Firebase project.
2. Enable Firestore Database.
3. Go to Project settings -> Service accounts -> Generate new private key.
4. Put these values into `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
5. Public registration insert and admin read/update go through Next.js API routes.
6. Keep `FIREBASE_PRIVATE_KEY` secret and never expose it with `NEXT_PUBLIC_`.

Private key note:

```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The app stores registrations in a `registrations` collection.

## Groq AI

1. Create a Groq API key.
2. Add it to `.env.local` as `GROQ_API_KEY`.
3. Optionally change `GROQ_MODEL`.
4. Open `/quiz`.

STC Guide asks adaptive "nega?" follow-up questions, recommends the most suitable camp, shows all camp percentages, and saves the result so `/register` can prefill it.

If `GROQ_API_KEY` is missing, `/quiz` uses a deterministic fallback question flow.

## Admin

Hidden route:

```text
/admin-stc-2026
```

Login uses `ADMIN_PASSCODE`. The session is stored in an httpOnly cookie. The dashboard can filter registrations, view analytics, update admin status/note, and export CSV.

## Updating Content

- Camp content: `src/data/camps.ts`
- 45-day module plans: `src/data/modulePlans.ts`
- Dates, referral discount, Telegram, phone: `.env.local`
- Placeholder location: `src/lib/config.ts`
- Launch video: add `public/videos/stc-launch.mp4`
- Logo/OG image: replace the STC text mark in `Header` and add `public/og-stc-2026.png`

## Deploy To Vercel

1. Push the project to GitHub.
2. Import it in Vercel.
3. Add the same environment variables.
4. Deploy.

## Notes

`src/lib/recommendation/recommendationEngine.ts` remains as the fallback and scoring normalizer. Groq output is parsed into the same recommendation shape.
