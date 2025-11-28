export default function Header() {
  return (
    <header className="header">
      <div className="logo">FairShare</div>

      <div className="header-right">
        <div className="user">
          <div className="avatar">FS</div>
          <span className="user-name">Usuario</span>
        </div>
        <button className="btn ghost">⚙️ Ajustes</button>
      </div>
    </header>
  );
}
