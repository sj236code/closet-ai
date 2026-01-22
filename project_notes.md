# ClosetAI – Project Plan, Architecture & Progress

Last updated: 2026-01-22

This document is the single source of truth for the ClosetAI project.
It is intended to be shared with future AI tools and collaborators to
fully understand the app’s setup, structure, and current state.

---

## 1) High-level overview

ClosetAI is an outfit tracking application that allows users to:
- store clothing items (with images)
- build outfits from items
- track outfit wear over time (calendar)
- analyze wear insights
- plan outfits for travel

---

## 2) Tech stack

### Frontend
- React + Vite
- react-router-dom
- Supabase JS client

### Backend (managed)
- Supabase Auth (email/password)
- Supabase Postgres
- Supabase Storage (images)

### Optional backend (future)
- Flask API (`apps/api`) for advanced logic if needed

### Deployment
- Vercel → frontend (`apps/web`)
- Supabase → DB, Auth, Storage

---

## 3) Repository structure (ACTUAL)

```
closet-ai/
├── apps/
│   ├── api/
│   └── web/
│       ├── src/
│       │   ├── auth/
│       │   ├── home/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── services/
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
├── supabase/
│   ├── schema.sql
│   ├── rls-policies.sql
│   └── triggers.sql
├── PROJECT_NOTES.md
└── README.md
```

---

## 4) Authentication (Supabase)

- Email/password signup with confirmation
- Secure password hashing handled by Supabase
- Unique email enforced
- Session persistence
- Protected routes

### 4.1 Requirements
- Secure email/password auth
- Password hashing handled by Supabase
- Unique email per account
- Email confirmation required
- Forgot password + reset password flow
- Persist session across refresh
- Protected routes

### 4.2 Database design
User profile data lives in `public.profiles`, linked to `auth.users(id)`.

Key fields:
- id (uuid, FK to auth.users)
- email
- display_name
- gender
- birthdate
- city
- created_at / updated_at

Birthdate is stored instead of age (age is computed in UI).

### 4.3 Profile creation strategy
- Signup sends profile fields as `raw_user_meta_data`
- Trigger auto-creates a `profiles` row on `auth.users` insert
- Metadata is copied into profiles table
- Avoids needing auth session during signup

### 4.4 Row Level Security
- Users can read/update/delete only their own profile
- RLS enabled on all user-owned tables

---

## 5) Auth flows (CURRENT STATUS)

### ✅ Implemented
- AuthEntryPage (sign up or log in)
- SignupPage (email/password + metadata)
- LoginPage
- Logout
- Session persistence
- ProtectedRoute
- Redirect logic:
  - logged-out → AuthEntryPage
  - logged-in → /home

### 🔜 To implement
- ForgotPassword.jsx
- ResetPassword.jsx
  - use Supabase reset password email
  - user clicks link → sets new password

---

## 6) Current app state

### Home
- `/home` is protected
- Shows placeholder LandingPage
- Logout returns user to AuthEntryPage

### Auth lifecycle
- Signup → email confirmation → login → home
- Logout clears session + blocks protected routes
- Manual access to `/home` when logged out is blocked

---

## 7) Upcoming features (HIGH LEVEL TODO)

### Phase 1 – Complete auth
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Password reset redirect handling

### Phase 2 – Closet MVP
- [ ] `clothing_items` table
- [ ] CRUD services (`closet.service.js`)
- [ ] Closet page UI
- [ ] Add/edit/delete item modal

### Phase 3 – Image upload
- [ ] Supabase Storage bucket
- [ ] Upload images on item creation
- [ ] Store image URL in DB
- [ ] Cleanup storage on delete

### Phase 4 – Outfits
- [ ] `outfits` table
- [ ] `outfit_items` join table
- [ ] Outfit builder UI
- [ ] Save + view outfits

### Phase 5 – Wear tracking
- [ ] `wear_log` table
- [ ] Calendar UI
- [ ] Prevent duplicate wears per date

### Phase 6 – Insights
- [ ] Most worn items
- [ ] Least worn items
- [ ] Category distribution
- [ ] Cost per wear (optional)

---

## 8) Security principles

- Never store passwords manually
- Never expose Supabase service role key
- Use anon key only on frontend
- Enforce RLS on all user tables
- Validate inputs client-side

---

## 9) Notes for future AI usage

- This repo uses Supabase directly from frontend
- No backend API required for MVP
- All data access should go through `/services`
- Auth state is centralized in `useAuth`
- Routing logic lives in `App.jsx`