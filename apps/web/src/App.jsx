import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./auth/ProtectedRoute";

import AuthEntryPage from "./auth/AuthEntryPage";
import SignupPage from "./auth/SignupPage";
import LoginPage from "./auth/LoginPage";
import LandingPage from "./home/LandingPage";

function App() {
  const { authLoading, isAuthed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Root: if logged in go to /home, else show entry */}
        <Route path="/" element={authLoading ? <div style={{ padding: 40 }}>Loading...</div> : (isAuthed ? <Navigate to="/home" replace /> : <AuthEntryPage />)} />

        {/* Public auth routes: if already logged in, redirect to home */}
        <Route path="/signup" element={authLoading ? <div style={{ padding: 40 }}>Loading...</div> : (isAuthed ? <Navigate to="/home" replace /> : <SignupPage />)} />
        <Route path="/login" element={authLoading ? <div style={{ padding: 40 }}>Loading...</div> : (isAuthed ? <Navigate to="/home" replace /> : <LoginPage />)} />

        {/* Protected app route */}
        <Route path="/home"
          element={
            <ProtectedRoute authLoading={authLoading} isAuthed={isAuthed}>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: go to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
