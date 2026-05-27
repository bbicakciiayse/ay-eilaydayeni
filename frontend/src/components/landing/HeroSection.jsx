export default function HeroSection({ onNavigate }) {
  return (
    <section className="container hero">
      <nav className="top-nav">
        <strong>Pricing Intelligence</strong>
        <div>
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#workflow">How It Works</a>
          <a href="#pricing">Pricing</a>
          <button className="secondary" onClick={() => onNavigate("auth")}>Login</button>
        </div>
      </nav>
      <div id="product" className="hero-grid">
        <div className="hero-copy">
          <h1>Predict Deal Outcomes Before You Quote</h1>
          <p>Upload your CRM or Excel data, train your win/loss model, analyze price sensitivity, and make smarter pricing decisions with AI-powered sales intelligence.</p>
          <div className="hero-actions">
            <button onClick={() => onNavigate("auth")}>Get Started</button>
            <a className="button-link" href="#pricing">View Pricing</a>
          </div>
        </div>
        <div className="card dashboard-mock">
          <div className="mock-header">
            <span>Live Opportunity</span>
            <strong>Won</strong>
          </div>
          <div className="mock-kpis">
            <div><small>Win Probability</small><strong>91.4%</strong></div>
            <div><small>Expected Value</small><strong>$42.8k</strong></div>
          </div>
          <label>
            Price Sensitivity
            <input type="range" min="10000" max="70000" defaultValue="42000" />
          </label>
          <div className="mini-chart">
            <span style={{ height: "42%" }}></span>
            <span style={{ height: "58%" }}></span>
            <span style={{ height: "74%" }}></span>
            <span style={{ height: "91%" }}></span>
            <span style={{ height: "69%" }}></span>
            <span style={{ height: "52%" }}></span>
          </div>
        </div>
      </div>
    </section>
  );
}
