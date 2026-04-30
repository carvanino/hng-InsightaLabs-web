import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";

export default function Nav() {
  const { user } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-brand">⚡ Insighta Labs+</div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/profiles"  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profiles</NavLink>
        <NavLink to="/search"    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Search</NavLink>
        <NavLink to="/account"   className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          @{user?.username}
        </NavLink>
      </div>
    </nav>
  );
}
