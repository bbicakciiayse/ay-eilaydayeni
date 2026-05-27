import { useMemo, useState } from "react";

function formatPercent(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function SavedReportsTable({ reports = [], onViewDetails, onGoToAnalysis }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("timestamp");

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => filter === "All" || report.predicted_result === filter)
      .filter((report) => {
        const haystack = [
          report.report_id,
          report.scenario?.Company,
          report.scenario?.Product,
          report.predicted_result,
          report.selected_model,
        ].join(" ").toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === "win_probability") return (b.win_probability || 0) - (a.win_probability || 0);
        if (sortBy === "expected_value") return (b.expected_value || 0) - (a.expected_value || 0);
        return String(b.timestamp || "").localeCompare(String(a.timestamp || ""));
      });
  }, [reports, search, filter, sortBy]);

  if (!reports.length) {
    return (
      <div className="empty-state">
        <h3>No saved reports yet</h3>
        <p>Run a pricing prediction and save your first report to start building your dashboard.</p>
        <button type="button" onClick={onGoToAnalysis}>Go to Pricing Analysis</button>
      </div>
    );
  }

  return (
    <div>
      <div className="table-controls">
        <input placeholder="Search reports" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option>All</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="timestamp">Newest</option>
          <option value="win_probability">Win Probability</option>
          <option value="expected_value">Expected Value</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Date</th>
            <th>Opportunity / Company</th>
            <th>Product</th>
            <th>Quoted Price</th>
            <th>Predicted Result</th>
            <th>Win Probability</th>
            <th>Expected Value</th>
            <th>Selected Model</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.report_id}>
              <td>{report.report_id.slice(0, 8)}</td>
              <td>{new Date(report.timestamp).toLocaleString()}</td>
              <td>{report.scenario?.Company || report.scenario?.company || "N/A"}</td>
              <td>{report.scenario?.Product || report.scenario?.product || "N/A"}</td>
              <td>{formatMoney(report.selected_price || report.price)}</td>
              <td>{report.predicted_result}</td>
              <td>{formatPercent(report.win_probability)}</td>
              <td>{formatMoney(report.expected_value)}</td>
              <td>{report.selected_model}</td>
              <td>{report.sensitivity_summary?.risk_zone || "Saved"}</td>
              <td><button type="button" onClick={() => onViewDetails(report)}>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
