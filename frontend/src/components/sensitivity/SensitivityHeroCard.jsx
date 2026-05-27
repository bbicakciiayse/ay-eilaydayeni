function nearestPoint(points = [], selectedPrice) {
  if (!points.length) return null;
  return points.reduce((best, point) =>
    Math.abs(point.price - selectedPrice) < Math.abs(best.price - selectedPrice) ? point : best
  );
}

export default function SensitivityHeroCard({ predictionResult, sensitivityResult, selectedPrice }) {
  const activePoint = nearestPoint(sensitivityResult?.points, selectedPrice);
  const probability = activePoint?.win_probability ?? predictionResult?.win_probability;
  const expectedValue = activePoint?.expected_value ?? predictionResult?.expected_value;
  const predictedResult = probability >= 0.5 ? "Won" : "Lost";

  return (
    <div className="card">
      <h3>Win Probability</h3>
      <strong>{probability == null ? "N/A" : `${(probability * 100).toFixed(1)}%`}</strong>
      <p>Selected model: {predictionResult?.selected_model || "N/A"}</p>
      <p>Expected Value: {expectedValue == null ? "N/A" : Number(expectedValue).toLocaleString()}</p>
      <p>Predicted Result: {probability == null ? "N/A" : predictedResult}</p>
      <p>Optimum Price: {sensitivityResult?.optimum_price ? Number(sensitivityResult.optimum_price.price).toLocaleString() : "N/A"}</p>
    </div>
  );
}
