import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroPage from "./components/landing page/HeroPage";
import FinanceDashboard from "./components/dashboard/FinanceDashboard";
import ZylaDashboard from "./components/dashboard/ZylaDashboard";
import ZylaAuth from "./components/auth/ZylaAuth";
import TransactionsPage from "./components/dashboard/TransactionsPage";
import PlaidDemo from "./components/dashboard/PlaidDemo";
import BudgetsPage from "./components/dashboard/BudgetsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/auth" element={<ZylaAuth />} />
        <Route path="/login" element={<ZylaAuth />} />
        <Route path="/signup" element={<ZylaAuth />} />
        <Route path="/dashboard" element={<ZylaDashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
  <Route path="/plaid-demo" element={<PlaidDemo />} />
  <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </Router>
  );
}

export default App;