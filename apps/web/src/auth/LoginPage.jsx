import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLocation } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const location = useLocation();
    const from = location.state?.from || "/home";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length >= 8;
    }, [email, password]);

    async function onSubmit(e) {
        e.preventDefault();
        setErrorMsg("");

        if (!canSubmit) {
            setErrorMsg("Enter your email and password (min 8 characters).");
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) throw error;

            // If email confirmations are ON and user isn't confirmed, Supabase will error.
            // If login succeeds, data.session will exist.
            if (data?.session) {
                // For now: send them somewhere simple
                // Later you'll redirect to onboarding if profile incomplete.
                console.log("Login Successful.")
                navigate(from, { replace: true });
            } else {
                // Rare, but handle gracefully
                setErrorMsg("Login succeeded but no session was created. Please try again.");
            }
        } catch (err) {
            setErrorMsg(err?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
            <h1 style={{ marginBottom: 8 }}>Log in</h1>
            <p style={{ marginTop: 0, opacity: 0.8 }}>
                Enter the email and password you used to create your account.
            </p>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Email</span>
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
                    <span>Password</span>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        required
                    />
                </label>

                {errorMsg ? <div style={{ color: "crimson", fontSize: 14 }}>{errorMsg}</div> : null}

                <button type="submit" disabled={!canSubmit || loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12 }}>
                <a href="/signup" style={{ fontSize: 14 }}>
                    Need an account? Sign up
                </a>

                {/* We'll wire this later to ForgotPasswordPage */}
                <a href="/forgot-password" style={{ fontSize: 14 }}>
                    Forgot password?
                </a>
            </div>
        </div>
    );
}
