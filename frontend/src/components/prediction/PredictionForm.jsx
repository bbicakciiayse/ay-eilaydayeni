export default function PredictionForm({ schema, values, onChange, onPredict, disabled, isPredicting }) {
  if (!schema?.fields?.length) {
    return <p>Train the model to generate prediction fields from model input columns.</p>;
  }

  return (
    <form className="grid two">
      {schema.fields.map((field) => (
        <label key={field.name}>
          {field.name}
          <input
            type={field.type}
            value={values[field.name] ?? ""}
            list={field.options?.length ? `${field.name}-options` : undefined}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
          {!!field.options?.length && (
            <datalist id={`${field.name}-options`}>
              {field.options.map((option) => <option value={option} key={option} />)}
            </datalist>
          )}
        </label>
      ))}
      <button type="button" onClick={onPredict} disabled={disabled || isPredicting}>
        {isPredicting ? "Predicting..." : "Predict"}
      </button>
    </form>
  );
}
