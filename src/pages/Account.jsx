import { useAuth } from "../lib/AuthContext.jsx";

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <h2>Account</h2>
      </div>

      <div className="account-card">
        {user?.avatar_url && (
          <img src={user.avatar_url} alt="avatar" className="avatar" />
        )}
        <div className="account-info">
          <div className="account-row">
            <span className="label">Username</span>
            <span>@{user?.username}</span>
          </div>
          <div className="account-row">
            <span className="label">Email</span>
            <span>{user?.email ?? "—"}</span>
          </div>
          <div className="account-row">
            <span className="label">Role</span>
            <span className="badge">{user?.role}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-danger" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}
