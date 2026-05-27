import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import MetricCard from "../components/dashboard/MetricCard.jsx";
import SavedReportsTable from "../components/dashboard/SavedReportsTable.jsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import { api } from "../services/api.js";

function formatPercent(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function DashboardPage({ onNavigate }) {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setError("");
    try {
      const [savedResults, dashboardSummary] = await Promise.all([
        api.savedResults(),
        api.dashboardSummary(),
      ]);
      setReports(savedResults.results || []);
      setSummary(dashboardSummary);
    } catch (dashboardError) {
      setError(dashboardError.message);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="dashboard" onNavigate={onNavigate} />
      <main className="content">
        <Navbar title="Dashboard" badge="Saved Reports" />
        {error && <div className="card error-card">{error}</div>}
        <section className="grid four">
          <MetricCard label="Total Analyzed Offers" value={summary?.total_analyzed_offers ?? 0} />
          <MetricCard label="Average Win Probability" value={formatPercent(summary?.average_win_probability)} />
          <MetricCard label="Predicted Won Count" value={summary?.predicted_won_count ?? 0} />
          <MetricCard label="Predicted Lost Count" value={summary?.predicted_lost_count ?? 0} />
          <MetricCard label="Average Quoted Price" value={formatMoney(summary?.average_quoted_price)} />
          <MetricCard label="Highest Expected Value" value={formatMoney(summary?.highest_expected_value)} />
          <MetricCard label="Highest Risk Offer" value={summary?.highest_risk_offer?.scenario?.Company || "N/A"} />
        </section>
        <section className="card">
          <div className="section-row">
            <h2>Saved Reports</h2>
            <button type="button" className="secondary" onClick={loadDashboard}>Refresh</button>
          </div>
          <SavedReportsTable
            reports={reports}
            onViewDetails={setSelectedReport}
            onGoToAnalysis={() => onNavigate("analysis")}
          />
        </section>
        <section className="card">
          <h2>Dashboard Charts</h2>
          <DashboardCharts reports={reports} />
        </section>
        {selectedReport && (
          <div className="modal">
            <div className="card modal-card">
              <div className="section-row">
                <h2>Report Details</h2>
                <button type="button" className="secondary" onClick={() => setSelectedReport(null)}>Close</button>
              </div>
              <p>Report ID: {selectedReport.report_id}</p>
              <p>Date: {new Date(selectedReport.timestamp).toLocaleString()}</p>
              <p>Predicted Result: {selectedReport.predicted_result}</p>
              <p>Win Probability: {formatPercent(selectedReport.win_probability)}</p>
              <p>Expected Value: {formatMoney(selectedReport.expected_value)}</p>
              <p>Selected Price: {formatMoney(selectedReport.selected_price || selectedReport.price)}</p>
              <p>Selected Model: {selectedReport.selected_model}</p>
              <p>Model Comment: {selectedReport.model_comment}</p>
              <p>Optimum Price: {formatMoney(selectedReport.sensitivity_summary?.optimum_price?.price)}</p>
              <div className="card chart-placeholder">Mini chart placeholder</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
