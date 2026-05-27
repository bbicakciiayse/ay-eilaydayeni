const steps = [
  "Upload your data",
  "Select the target column",
  "Train the model",
  "Enter a pricing opportunity",
  "Analyze win probability and expected value",
  "Save reports to the dashboard",
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="container card workflow-card">
      <div>
        <div className="section-kicker">Process</div>
        <h2>How It Works</h2>
        <p>From raw CRM export to saved pricing intelligence report.</p>
      </div>
      <ol className="workflow-list">
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </section>
  );
}
