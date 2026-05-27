export default function ModelMetricsCards({ trainingResult }) {
  if (!trainingResult) {
    return <p>Train the model to view performance metrics.</p>;
  }

  const topRow = trainingResult.metrics_table?.[0] || {};
  const metrics = [
    ["Selected Model", trainingResult.selected_model],
    ["ROC-AUC", topRow["Nested CV Mean ROC-AUC"]],
    ["Accuracy", topRow["Nested CV Mean Accuracy"]],
    ["F1 Score", topRow["Nested CV Mean F1-score"]],
  ];

  return (
    <div className="grid four">
      {metrics.map(([label, value]) => (
        <div className="card" key={label}>
          <span>{label}</span>
          <strong>{typeof value === "number" ? value.toFixed(3) : value || "N/A"}</strong>
        </div>
      ))}
    </div>
  );
}
