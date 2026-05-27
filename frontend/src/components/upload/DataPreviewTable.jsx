export default function DataPreviewTable({ rows = [] }) {
  if (!rows.length) {
    return <p>No dataset preview yet.</p>;
  }

  const columns = Object.keys(rows[0]);

  return (
    <table>
      <thead>
        <tr>{columns.map((key) => <th key={key}>{key}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => <td key={column}>{row[column] ?? ""}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
