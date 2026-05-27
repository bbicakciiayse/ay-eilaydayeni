export default function MFAForm({ onSuccess }) {
  return (
    <form className="card auth-card" onSubmit={(event) => { event.preventDefault(); onSuccess(); }}>
      <h2>Verify your identity</h2>
      <p>Enter the 6-digit verification code sent to your email.</p>
      <input placeholder="123456" maxLength="6" />
      <button type="submit">Verify and Continue</button>
    </form>
  );
}
