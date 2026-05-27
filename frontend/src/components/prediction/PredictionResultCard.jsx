export default function PredictionResultCard({ result }) {
  if (!result) {
    return <p>No prediction result yet.</p>;
  }

  return (
    <div className="grid four">
      <div className="card">Predicted Result: {result.predicted_result}</div>
      <div className="card">Win Probability: {(result.win_probability * 100).toFixed(1)}%</div>
      <div className="card">Expected Value: {Number(result.expected_value).toLocaleString()}</div>
      <div className="card">{result.model_comment}</div>
    </div>
  );
}
