import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroPage from "./components/landing page/HeroPage";
import FinanceDashboard from "./components/dashboard/FinanceDashboard";
import ZylaDashboard from "./components/dashboard/ZylaDashboard";
import LoginPage from "./components/auth/login";
import RegisterPage from "./components/auth/RegisterPage";
import TransactionsPage from "./components/dashboard/TransactionsPage";
import PlaidDemo from "./components/dashboard/PlaidDemo";
import BudgetsPage from "./components/dashboard/BudgetsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutUsPage from "./components/static/AboutUsPage";
import ContactPage from "./components/static/ContactPage";
import PrivacyPolicyPage from "./components/static/PrivacyPolicyPage";
import TermsOfServicePage from "./components/static/TermsOfServicePage";
import AccountsPage from "./components/dashboard/AccountsPage";
import InsightsPage from "./components/dashboard/InsightsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
  <Route path="/about" element={<AboutUsPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/privacy" element={<PrivacyPolicyPage />} />
  <Route path="/terms" element={<TermsOfServicePage />} />

        {/* Protected areas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ZylaDashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/plaid-demo" element={<PlaidDemo />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;