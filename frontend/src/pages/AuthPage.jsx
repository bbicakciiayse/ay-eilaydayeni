import { useState } from "react";
import LoginForm from "../components/auth/LoginForm.jsx";
import MFAForm from "../components/auth/MFAForm.jsx";

export default function AuthPage({ onAuthenticated, onBack }) {
  const [step, setStep] = useState("login");

  return (
    <main className="page auth-page">
      <section className="auth-visual">
        <button className="secondary" onClick={onBack}>Back</button>
        <h1>Pricing Intelligence Platform</h1>
        <p>Predict deal outcomes, analyze pricing sensitivity, and make smarter quotation decisions.</p>
        <div className="auth-mock">
          <span>Forecast Quality</span>
          <strong>94%</strong>
          <p>Model workspace ready</p>
        </div>
      </section>
      <section className="auth-panel">
        {step === "login" ? (
          <LoginForm onSuccess={() => setStep("mfa")} />
        ) : (
          <MFAForm onSuccess={onAuthenticated} />
        )}
      </section>
    </main>
  );
}
