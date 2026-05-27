export default function PriceSlider({
  minPrice,
  maxPrice,
  stepSize,
  selectedPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onStepSizeChange,
  onSelectedPriceChange,
  onAnalyze,
  onSaveReport,
  disabled,
  isAnalyzing,
}) {
  return (
    <div className="card">
      <h3>Offer Information</h3>
      <label>
        Minimum price
        <input type="number" value={minPrice} onChange={(event) => onMinPriceChange(event.target.value)} />
      </label>
      <label>
        Maximum price
        <input type="number" value={maxPrice} onChange={(event) => onMaxPriceChange(event.target.value)} />
      </label>
      <label>
        Step size
        <input type="number" value={stepSize} onChange={(event) => onStepSizeChange(event.target.value)} />
      </label>
      <label>
        Selected price: {Number(selectedPrice || 0).toLocaleString()}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={stepSize}
          value={selectedPrice}
          onChange={(event) => onSelectedPriceChange(event.target.value)}
        />
      </label>
      <button type="button" onClick={onAnalyze} disabled={disabled || isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Analyze Price Sensitivity"}
      </button>
      <button type="button" className="secondary" onClick={onSaveReport} disabled={disabled}>
        Save Report
      </button>
    </div>
  );
}
