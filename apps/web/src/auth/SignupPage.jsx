// apps/web/src/app/auth/SignupPage.jsx
import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CITY_OPTIONS = [
  "New York",
  "Jersey City",
  "Hoboken",
  "Newark",
  "Boston",
  "Philadelphia",
  "Other",
];

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Profile fields (saved into Supabase Auth user metadata on signup)
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [birthdate, setBirthdate] = useState(""); // YYYY-MM-DD from <input type="date" />
  const [city, setCity] = useState(CITY_OPTIONS[0]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isValid = useMemo(() => {
    if (!email.trim()) return false;
    if (!password || password.length < 8) return false;
    if (!displayName.trim()) return false;
    if (!city.trim()) return false;
    // birthdate optional; make required by adding: if (!birthdate) return false;
    return true;
  }, [email, password, displayName, city]);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isValid) {
      setErrorMsg("Please fill all required fields. Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      // With email confirmation ON, Supabase may NOT create a session immediately.
      // That's expected: it will send a confirmation email and the user confirms before logging in.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          // These values go into auth.users.raw_user_meta_data
          // Your trigger should copy them into public.profiles on user creation.
          data: {
            display_name: displayName.trim(),
            gender: gender || null,
            birthdate: birthdate || null, // keep as YYYY-MM-DD or null
            city: city || null,
          },
        },
      });

      if (error) throw error;

      // If confirmations are enabled, data.session is often null here — that's fine.
      // The important part is: user exists + email is sent + metadata stored.
      if (data?.user) {
        console.log("Account Created. Email Sent")
        setSuccessMsg(
          "Account created! Check your email to confirm your account, then return and log in."
        );
      } else {
        setSuccessMsg("Account created! Check your email to confirm your account.");
      }
    } catch (err) {
      setErrorMsg(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Create your account</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Sign up with email and password. You’ll receive a confirmation email.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email *</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password *</span>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
          />
          <small style={{ opacity: 0.75 }}>Use at least 8 characters.</small>
        </label>

        <hr style={{ opacity: 0.2, width: "100%" }} />

        <label style={{ display: "grid", gap: 6 }}>
          <span>Display name *</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Saanya"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Birthdate</span>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
          <small style={{ opacity: 0.75 }}>
            We store birthdate (not “age”) so it stays accurate over time.
          </small>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>City *</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} required>
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {errorMsg ? (
          <div style={{ color: "crimson", fontSize: 14 }}>{errorMsg}</div>
        ) : null}

        {successMsg ? (
          <div style={{ color: "green", fontSize: 14 }}>{successMsg}</div>
        ) : null}

        <button type="submit" disabled={!isValid || loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: 14, fontSize: 14, opacity: 0.85 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
