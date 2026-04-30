import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

const GENDERS    = ["", "male", "female"];
const AGE_GROUPS = ["", "child", "teenager", "adult", "senior"];

export default function Profiles() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page   = Number(searchParams.get("page")  ?? 1);
  const limit  = Number(searchParams.get("limit") ?? 10);
  const gender = searchParams.get("gender")    ?? "";
  const group  = searchParams.get("age_group") ?? "";

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit };
    if (gender) params.gender    = gender;
    if (group)  params.age_group = group;

    api.get("/api/profiles", { params })
      .then(({ data }) => setData(data))
      .catch(() => setError("Failed to load profiles."))
      .finally(() => setLoading(false));
  }, [page, limit, gender, group]);

  const setFilter = (key, val) => {
    const next = Object.fromEntries(searchParams);
    if (val) next[key] = val; else delete next[key];
    next.page = "1"; // reset to page 1 on filter change
    setSearchParams(next);
  };

  const goToPage = (newPage) => {
    const next = Object.fromEntries(searchParams);
    next.page  = String(newPage);
    setSearchParams(next);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Profiles</h2>
        {user?.role === "admin" && (
          <Link to="/profiles/create" className="btn">+ Create Profile</Link>
        )}
      </div>

      <div className="filters">
        <select value={gender} onChange={(e) => setFilter("gender", e.target.value)}>
          {GENDERS.map((g) => <option key={g} value={g}>{g || "All Genders"}</option>)}
        </select>
        <select value={group} onChange={(e) => setFilter("age_group", e.target.value)}>
          {AGE_GROUPS.map((g) => <option key={g} value={g}>{g || "All Age Groups"}</option>)}
        </select>
      </div>

      {loading && <p className="muted">Loading...</p>}
      {error   && <p className="error">{error}</p>}

      {data && (
        <>
          <p className="muted">
            Showing {data.data.length} of {data.total} profiles
            (page {data.page} / {data.total_pages})
          </p>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th><th>Gender</th><th>Age</th>
                <th>Age Group</th><th>Country</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((p) => (
                <tr key={p.id}>
                  <td className="capitalize">{p.name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_name}</td>
                  <td>
                    <Link to={`/profiles/${p.id}`} className="link">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {data.links.prev && (
              <button className="btn btn-outline" onClick={() => goToPage(page - 1)}>
                ← Prev
              </button>
            )}
            <span className="muted">Page {data.page}</span>
            {data.links.next && (
              <button className="btn btn-outline" onClick={() => goToPage(page + 1)}>
                Next →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
