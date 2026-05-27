export default function LoginForm({ onSuccess }) {
  return (
    <form className="card auth-card" onSubmit={(event) => { event.preventDefault(); onSuccess(); }}>
      <h2>Sign In</h2>
      <p>Access your pricing analysis workspace.</p>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  );
}
