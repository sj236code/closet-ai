import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // After logout, ProtectedRoute will kick them out,
            // but we also navigate explicitly for clarity.
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout error:", err);
            alert("Failed to log out. Please try again.");
        }
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Home</h1>
            <p>You are logged in 🎉</p>

            <button onClick={handleLogout} style={{ marginTop: 20 }}>
                Log out
            </button>
        </div>
    );
}
