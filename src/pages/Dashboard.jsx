import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/profiles?limit=1"),
      api.get("/api/profiles?gender=male&limit=1"),
      api.get("/api/profiles?gender=female&limit=1"),
    ])
      .then(([all, male, female]) => {
        setStats({
          total:  all.data.total,
          male:   male.data.total,
          female: female.data.total,
        });
      })
      .catch(() => setError("Failed to load metrics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back, <strong>@{user?.username}</strong></p>
      </div>

      {loading && <p className="muted">Loading metrics...</p>}
      {error   && <p className="error">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Profiles</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.male}</span>
            <span className="stat-label">Male</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.female}</span>
            <span className="stat-label">Female</span>
          </div>
          <div className="stat-card">
            <span className="stat-value capitalize">{user?.role}</span>
            <span className="stat-label">Your Role</span>
          </div>
        </div>
      )}

      <div className="quick-links">
        <Link to="/profiles" className="btn">Browse Profiles</Link>
        <Link to="/search"   className="btn btn-outline">Search</Link>
      </div>
    </div>
  );
}
