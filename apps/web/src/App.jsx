import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthEntryPage from "./auth/AuthEntryPage";
import SignupPage from "./auth/SignupPage";
import LoginPage from "./auth/LoginPage";
import LandingPage from "./home/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<AuthEntryPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Logged in */}
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
