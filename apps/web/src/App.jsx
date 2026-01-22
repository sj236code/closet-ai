import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthEntryPage from "./auth/AuthEntryPage";
import SignupPage from "./auth/SignupPage";

function PlaceholderLogin() {
  return <div style={{ padding: 40 }}>Login page coming next</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthEntryPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<PlaceholderLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
