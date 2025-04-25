import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiUsers, FiMousePointer, FiAward, FiHome, FiEdit, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./home.css";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    planClicks: 0,
    points: 0,
  });
  const navigate = useNavigate();

  const [displayStats, setDisplayStats] = useState({
    users: 0,
    planClicks: 0,
    points: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  // Animate counters with smooth transition
  const animateCounters = (targetStats) => {
    const duration = 1500;
    const startTime = performance.now();

    const updateCounters = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      Object.keys(targetStats).forEach((key) => {
        const targetValue = targetStats[key];
        const currentValue = Math.floor(progress * targetValue);
        setDisplayStats((prev) => ({ ...prev, [key]: currentValue }));
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    };

    requestAnimationFrame(updateCounters);
  };

  // Fetch data from Supabase
  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home")
        .select("*")
        .limit(1);

      if (error || !data || data.length === 0) {
        throw error || new Error("No data available");
      }

      const row = data[0];
      const newStats = {
        users: row?.user ?? 0,
        planClicks: row?.plan_click ?? 0,
        points: row?.points ?? 0,
      };

      setStats(newStats);
      animateCounters(newStats);
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh data every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Analytics Dashboard</h1>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated}
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
      </header> */}

      <main className="dashboard-content">
        {error && (
          <div className="error-message">
            <div className="error-content">
              <FiAlertCircle className="error-icon" />
              <div>
                <h3>Error!</h3>
                <p>{error}</p>
              </div>
              <button
                className="retry-btn"
                onClick={fetchStats}
              >
                <FiRefreshCw /> Retry
              </button>
            </div>
          </div>
        )}

        <section className="stats-section">
          <h2 className="section-title">
            <span className="title-decoration"></span>
            Key Metrics
          </h2>

          {loading ? (
            <div className="stats-grid">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="stat-card loading">
                  <div className="loading-placeholder"></div>
                  <div className="loading-placeholder large"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <FiUsers className="stat-icon" />
                  <h3>Total Users</h3>
                </div>
                <p className="stat-value">
                  {displayStats.users.toLocaleString()}
                </p>
                <div className="stat-footer">
                  <span className="stat-trend up">↑ 12% from last month</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <FiMousePointer className="stat-icon" />
                  <h3>Plan Clicks</h3>
                </div>
                <p className="stat-value">
                  {displayStats.planClicks.toLocaleString()}
                </p>
                <div className="stat-footer">
                  <span className="stat-trend up">↑ 5% from last week</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <FiAward className="stat-icon" />
                  <h3>Points Earned</h3>
                </div>
                <p className="stat-value">
                  {displayStats.points.toLocaleString()}
                </p>
                <div className="stat-footer">
                  <span className="stat-trend down">↓ 3% from last week</span>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="dashboard-actions">
          <section className="quick-actions">
            <h2 className="section-title">
              <span className="title-decoration"></span>
              Quick Actions
            </h2>
            <div className="action-buttons">
              <button className="action-btn primary">
                <FiEdit /> Manage Content
              </button>
              <button className="action-btn secondary">
                <FiUsers /> User Management
              </button>
              <button className="action-btn tertiary">
                <FiAward /> Points System
              </button>
            </div>
          </section>

          <section className="recent-activity">
            <h2 className="section-title">
              <span className="title-decoration"></span>
              Recent Activity
            </h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🔔</div>
                <div className="activity-content">
                  <p>New login from unrecognized device</p>
                  <span className="activity-time">5 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📊</div>
                <div className="activity-content">
                  <p>User statistics updated successfully</p>
                  <span className="activity-time">30 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🔄</div>
                <div className="activity-content">
                  <p>Data synchronized with server</p>
                  <span className="activity-time">1 hour ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;