import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { updateMyProfile } from "../../services/profile.service";

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

  // Profile fields
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [birthdate, setBirthdate] = useState(""); // YYYY-MM-DD
  const [city, setCity] = useState(CITY_OPTIONS[0]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isValid = useMemo(() => {
    if (!email.trim()) return false;
    if (!password || password.length < 8) return false;
    if (!displayName.trim()) return false;
    if (!city.trim()) return false;
    // birthdate optional; set required if you want
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

      // 1) Create user in Supabase Auth (password hashing happens in Supabase)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // Important note about email confirmation:
      // If email confirmations are ON, Supabase may not create a session immediately.
      // In that case, you might need to wait for confirmation before updating the profile.
      // Many dev setups keep confirmation OFF for MVP.
      const user = data?.user;

      if (!user) {
        setSuccessMsg("Account created. Please check your email to confirm your account.");
        return;
      }

      // 2) Update profile row (trigger should have created it)
      await updateMyProfile({
        display_name: displayName.trim(),
        gender,
        birthdate: birthdate || null,
        city,
        email: email.trim(), // optional mirror; auth.users is source of truth
      });

      setSuccessMsg("Account created! You’re all set.");
      // Optional: redirect to /closet or /home
      // window.location.href = "/"; // or use your router navigate
    } catch (err) {
      // Supabase errors often have `message`
      const msg = err?.message || "Something went wrong creating your account.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Create your account</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Sign up with email and password. Your password is securely hashed by Supabase.
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
            We store your birthdate (not “age”) so it stays accurate over time.
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
