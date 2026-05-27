export default function Navbar({ title, badge }) {
  return (
    <header className="navbar">
      <div>
        <h1>{title}</h1>
        <span className="badge">{badge}</span>
      </div>
      <div className="profile">
        <span>AY</span>
        <div>
          <strong>User</strong>
          <small>Workspace</small>
        </div>
      </div>
    </header>
  );
}
