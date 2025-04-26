import React from "react";
import { FiHome, FiEdit } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const time = new Date().toLocaleTimeString();

  const links = [
    { path: "/", label: "Dashboard", icon: <FiHome className="nav-icon" /> },
    { path: "/editor", label: "Editor", icon: <FiEdit className="nav-icon" /> },
  ];

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <span className="last-updated">Last updated: {time}</span>
        </div>

        <nav className="header-nav">
          {links.map(({ path, label, icon }) => (
            <a
              key={path}
              onClick={() => navigate(path)}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
            >
              {icon}
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;