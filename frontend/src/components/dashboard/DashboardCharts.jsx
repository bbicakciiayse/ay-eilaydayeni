function formatPercent(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function DashboardCharts({ reports = [] }) {
  const won = reports.filter((report) => report.predicted_result === "Won").length;
  const lost = reports.filter((report) => report.predicted_result === "Lost").length;
  const topExpected = [...reports].sort((a, b) => (b.expected_value || 0) - (a.expected_value || 0)).slice(0, 5);
  const highRisk = [...reports].sort((a, b) => (a.win_probability || 0) - (b.win_probability || 0)).slice(0, 5);

  return (
    <div className="grid two">
      <div className="card">
        <h3>Won / Lost Prediction Ratio</h3>
        <p>Won: {won}</p>
        <p>Lost: {lost}</p>
      </div>
      <div className="card">
        <h3>Price vs Win Probability Summary</h3>
        {reports.slice(0, 5).map((report) => (
          <p key={report.report_id}>{formatMoney(report.selected_price || report.price)} - {formatPercent(report.win_probability)}</p>
        ))}
      </div>
      <div className="card">
        <h3>Expected Value Ranking</h3>
        {topExpected.map((report) => (
          <p key={report.report_id}>{report.scenario?.Company || "Opportunity"} - {formatMoney(report.expected_value)}</p>
        ))}
      </div>
      <div className="card">
        <h3>Risk Level Distribution</h3>
        {highRisk.map((report) => (
          <p key={report.report_id}>{report.scenario?.Company || "Opportunity"} - {formatPercent(report.win_probability)}</p>
        ))}
      </div>
    </div>
  );
}
