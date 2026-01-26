# closet-ai

# 🔐 Auth System (Supabase + React)

A secure, production-ready authentication system built with **Supabase Auth** and **React (Vite)**.  
Includes login, signup, protected routes, password reset, and user profile onboarding with **Row Level Security (RLS)**.

---

## ✨ Features

- ✅ Secure email/password authentication (Supabase Auth)
- 🔐 Password hashing handled by Supabase (never stored manually)
- 📧 Unique email enforcement
- 🔁 Forgot & reset password flow
- 👤 User profile onboarding after signup
- 🛡️ Protected routes for authenticated users only
- 🔒 Row Level Security (RLS) on all user data

---

## 🧠 Architecture Overview

### Authentication
- Uses **Supabase email/password auth**
- Supabase manages:
  - Password hashing
  - Email confirmation
  - Session handling
  - Token refresh

### User Profiles
- App-specific user data stored in a separate `public.profiles` table
- Linked 1:1 with `auth.users(id)`
- Profile row auto-created on signup via SQL trigger

---

## 🗄️ Database Design

### `profiles` table
Stores stable, user-owned profile data.

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  gender text,
  birthdate date,
  city text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
