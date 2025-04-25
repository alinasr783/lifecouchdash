import React,{useState} from "react";
import { FiHome, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = ({ lastUpdated }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  
  

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <h1>Analytics Dashboard</h1>
          {time && (
            <span className="last-updated">
              Last updated: {time}
            </span>
          )}
        </div>

        <nav className="header-nav">
          <a href="#dashboard" className="nav-link active">
            <FiHome className="nav-icon" />
            Dashboard
          </a>
          <a className="nav-link" onClick={() => navigate("/editor")}>
            <FiEdit className="nav-icon" />
            Editor
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;