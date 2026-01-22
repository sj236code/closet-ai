import { Navigate, useLocation } from "react-router-dom";

/**
 * Protects routes that require an authenticated user.
 * If auth is still loading, shows a simple loading state.
 * If not authenticated, redirects to /login and preserves "from".
 */
export default function ProtectedRoute({ authLoading, isAuthed, children }) {
  const location = useLocation();

  if (authLoading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
