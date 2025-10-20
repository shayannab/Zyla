import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroPage from "./components/landing page/HeroPage";
import FinanceDashboard from "./components/dashboard/FinanceDashboard";
import ZylaAuth from "./components/auth/ZylaAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/auth" element={<ZylaAuth />} />
        <Route path="/login" element={<ZylaAuth />} />
        <Route path="/signup" element={<ZylaAuth />} />
        <Route path="/dashboard" element={<FinanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;