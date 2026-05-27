export default function TargetColumnSelector({ columns = [], value, onChange, onContinue, disabled }) {
  return (
    <div className="grid">
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled || !columns.length}>
        {!columns.length && <option>No uploaded columns</option>}
        {columns.map((column) => <option key={column}>{column}</option>)}
      </select>
      <button type="button" onClick={onContinue} disabled={disabled || !value}>Continue to Training</button>
    </div>
  );
}
