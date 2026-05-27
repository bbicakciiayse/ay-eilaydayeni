const features = [
  ["CRM / Excel Data Upload", "Upload sales opportunity data directly from Excel or CRM exports and preview your dataset before training."],
  ["Train Your Own Model", "Select your target column and train models based on selected performance metrics."],
  ["Predict Win Probability", "Estimate whether a pricing opportunity is likely to be won or lost before sending the quote."],
  ["Price Sensitivity Analysis", "See how changing the price affects win probability, expected value, and decision quality."],
];

export default function FeatureCards() {
  return (
    <section id="features" className="container section-block">
      <div className="section-kicker">Core workflow</div>
      <h2>Everything your pricing team needs</h2>
      <div className="grid four">
      {features.map(([title, text]) => (
        <article className="card feature-card" key={title}>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
      </div>
    </section>
  );
}
