import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

const LINKS = [
  { to: "/", label: "總覽" },
  { to: "/learn", label: "教學" },
  { to: "/trainer", label: "練習器" },
  { to: "/algs", label: "公式表" },
  { to: "/timer", label: "計時器" },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <NavLink to="/" className="nav-logo" onClick={() => setOpen(false)}>
            <span className="nav-logo-cube" aria-hidden>
              <i /><i /><i /><i />
            </span>
            橋式解法教室
          </NavLink>
          <button
            className="nav-toggle"
            aria-label="選單"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
          <nav className={`nav-links${open ? " open" : ""}`}>
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
