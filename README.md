# 🔐 Auth System (Supabase)

A secure authentication and user onboarding system built with **Supabase Auth** and **React (Vite)**.  
This project handles login, signup, password reset, protected routes, and user profile management.

---

## ✨ What This Project Does

- Email/password authentication using Supabase  
- Secure password hashing (handled by Supabase)  
- Unique email enforcement  
- Forgot & reset password flow  
- Protected routes for authenticated users  
- Automatic user profile creation after signup  
- Row Level Security (RLS) to protect user data  

---

## 🔁 User Flow

1. **Sign Up**
   - User signs up with email & password
   - Supabase creates an auth user
   - A matching profile row is automatically created

2. **Login**
   - User logs in with email/password

3. **Onboarding**
   - User completes profile details (gender, birthdate, city)
   - Data is saved to `public.profiles`

4. **Protected App**
   - App pages are blocked without an active session
   - Optionally blocked if profile is incomplete

5. **Forgot / Reset Password**
   - User requests a reset email
   - Sets a new password using Supabase’s secure flow

---

## 🗄️ Data Model

- **auth.users**
  - Managed entirely by Supabase
  - Stores authentication credentials and sessions

- **public.profiles**
  - Stores app-specific user data
  - Linked 1:1 with `auth.users(id)`
  - Uses birthdate instead of age (age calculated in UI)

---

## 🛡️ Security

- Passwords are never stored manually
- Supabase handles hashing and session management
- Row Level Security ensures users only access their own data
- Supabase anon key is safe for frontend usage

---

## 📁 Frontend Structure

```txt
src/
  app/auth/
    LoginPage.jsx
    SignupPage.jsx
    ForgotPasswordPage.jsx
    ResetPasswordPage.jsx
    OnboardingProfilePage.jsx
  components/auth/
    ProtectedRoute.jsx
  services/
    auth.service.js
    profile.service.js
  hooks/
    useAuth.js
```

---

## 🧰 Tech Stack

- **Frontend:** React, Vite  
- **Auth & Database:** Supabase  
- **Security:** Row Level Security (RLS)

---

## 🚧 Planned Features

- Closet CRUD
- Image uploads (Supabase Storage)
- Outfit relationships & join tables
- Calendar wear log UI
