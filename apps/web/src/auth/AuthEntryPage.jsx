import { useNavigate } from "react-router-dom";

export default function AuthEntryPage() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: 420, margin: "80px auto", padding: 20, textAlign: "center" }}>
            <h1>Welcome</h1>
            <p style={{ opacity: 0.8 }}>
                Create an account or log in to continue.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 30 }}>
                <button onClick={() => navigate("/signup")}>
                    Sign up
                </button>

                <button onClick={() => navigate("/login")}>
                    Log in
                </button>
            </div>
        </div>
    );
}