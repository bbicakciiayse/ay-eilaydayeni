function LineChart({ title, points = [], valueKey, selectedPrice }) {
  if (!points.length) {
    return <div className="card chart-placeholder">{title}: no sensitivity data yet.</div>;
  }

  const width = 520;
  const height = 220;
  const pad = 28;
  const prices = points.map((point) => point.price);
  const values = points.map((point) => point[valueKey]);
  const minX = Math.min(...prices);
  const maxX = Math.max(...prices);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const x = (price) => pad + ((price - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const y = (value) => height - pad - ((value - minY) / (maxY - minY || 1)) * (height - pad * 2);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.price)} ${y(point[valueKey])}`).join(" ");
  const selected = points.reduce((best, point) =>
    Math.abs(point.price - selectedPrice) < Math.abs(best.price - selectedPrice) ? point : best
  );

  return (
    <div className="card chart-placeholder">
      <h3>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#d9e2ef" />
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#d9e2ef" />
        <path d={path} fill="none" stroke="#2f80ed" strokeWidth="3" />
        {selected && (
          <circle cx={x(selected.price)} cy={y(selected[valueKey])} r="5" fill="#0b1220" />
        )}
      </svg>
      <p>Range: {Number(minX).toLocaleString()} - {Number(maxX).toLocaleString()}</p>
    </div>
  );
}

export default function SensitivityCharts({ sensitivityResult, selectedPrice }) {
  const points = sensitivityResult?.points || [];

  return (
    <div className="grid two">
      <LineChart title="Price vs Win Probability" points={points} valueKey="win_probability" selectedPrice={selectedPrice} />
      <LineChart title="Price vs Expected Value" points={points} valueKey="expected_value" selectedPrice={selectedPrice} />
    </div>
  );
}
