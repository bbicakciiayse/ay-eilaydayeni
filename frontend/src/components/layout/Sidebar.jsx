export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>PI</span>
        <div>
          <strong>Pricing Intelligence</strong>
          <small>Sales Analytics</small>
        </div>
      </div>
      <button className={active === "analysis" ? "nav-active" : "nav-button"} onClick={() => onNavigate("analysis")}>Pricing Analysis</button>
      <button className={active === "dashboard" ? "nav-active" : "nav-button"} onClick={() => onNavigate("dashboard")}>Dashboard</button>
    </aside>
  );
}
