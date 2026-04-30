import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function ProfileDetail() {
  const { id }  = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/api/profiles/${id}`)
      .then(({ data }) => setProfile(data.data))
      .catch(() => setError("Profile not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this profile?")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/profiles/${id}`);
      window.location.href = "/profiles";
    } catch {
      setError("Failed to delete profile.");
      setDeleting(false);
    }
  };

  if (loading) return <div className="page"><p className="muted">Loading...</p></div>;
  if (error)   return <div className="page"><p className="error">{error}</p></div>;

  const rows = [
    ["ID",                  profile.id],
    ["Name",                profile.name],
    ["Gender",              `${profile.gender} (${(profile.gender_probability * 100).toFixed(0)}%)`],
    ["Age",                 `${profile.age} (${profile.age_group})`],
    ["Country",             `${profile.country_name} (${profile.country_id})`],
    ["Country Probability", `${(profile.country_probability * 100).toFixed(0)}%`],
    ["Created At",          new Date(profile.created_at).toLocaleString()],
  ];

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/profiles" className="link">← Back to Profiles</Link>
        {user?.role === "admin" && (
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        )}
      </div>

      <h2 className="capitalize">{profile.name}</h2>

      <table className="table detail-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
