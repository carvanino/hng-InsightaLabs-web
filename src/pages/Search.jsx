import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";

export default function Search() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const { data } = await api.get("/api/profiles/search", { params: { q: query } });
      setResults(data);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Search Profiles</h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "young males from Nigeria"'
          className="search-input"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results && (
        <>
          <p className="muted">Found {results.total} profiles</p>

          {results.data.length === 0 ? (
            <p className="muted">No profiles matched your query.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th><th>Gender</th><th>Age</th>
                  <th>Age Group</th><th>Country</th><th></th>
                </tr>
              </thead>
              <tbody>
                {results.data.map((p) => (
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
          )}
        </>
      )}
    </div>
  );
}
