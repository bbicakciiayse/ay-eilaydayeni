export default function MetricCard({ label, value }) {
  return (
    <article className="card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
