import { useState } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import MainPricingAnalysisPage from "./pages/MainPricingAnalysisPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  const [page, setPage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = (nextPage) => setPage(nextPage);
  const enterApp = () => {
    setIsAuthenticated(true);
    setPage("analysis");
  };

  if (page === "auth") {
    return <AuthPage onAuthenticated={enterApp} onBack={() => navigate("landing")} />;
  }

  if (page === "dashboard" && isAuthenticated) {
    return <DashboardPage onNavigate={navigate} />;
  }

  if (page === "analysis" && isAuthenticated) {
    return <MainPricingAnalysisPage onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}
