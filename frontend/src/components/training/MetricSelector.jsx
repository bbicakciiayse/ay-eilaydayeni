export default function MetricSelector({ value, onChange, onTrain, disabled, isTraining }) {
  return (
    <div className="grid">
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled || isTraining}>
        <option>Accuracy</option>
        <option>F1 Score</option>
        <option>ROC-AUC</option>
        <option>Precision</option>
        <option>Recall</option>
        <option>Best Overall</option>
      </select>
      <p>The system evaluates multiple metrics together and selects the model with the strongest overall performance.</p>
      <button type="button" onClick={onTrain} disabled={disabled || isTraining}>
        {isTraining ? "Training..." : "Train Model"}
      </button>
    </div>
  );
}
