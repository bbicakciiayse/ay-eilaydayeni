import { useState } from "react";
import PaymentModal from "./PaymentModal.jsx";

export default function PricingCard({ onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="pricing" className="container pricing-section">
      <div className="card pricing-card">
        <div className="section-kicker">Pricing</div>
        <h2>Professional Plan</h2>
        <strong className="price">$49 <span>/ month</span></strong>
        <p>For sales teams, analysts, and pricing decision-makers.</p>
        <ul>
          <li>CRM / Excel data upload</li>
          <li>Model training and metric-based selection</li>
          <li>Win / Lost prediction and price sensitivity</li>
          <li>Dashboard reports and saved predictions</li>
        </ul>
        <button onClick={() => setOpen(true)}>Start Professional Plan</button>
      </div>
      {open && <PaymentModal onClose={() => setOpen(false)} onSuccess={() => onNavigate("auth")} />}
    </section>
  );
}
