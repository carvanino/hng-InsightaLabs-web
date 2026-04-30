import axios from "axios";

const api = axios.create({
  baseURL: "/",           // Vite proxy handles routing to backend
  withCredentials: true,  // Send cookies on every request
  headers: {
    "Content-Type": "application/json",
    "X-API-Version": "1",
  },
});

// Fetch CSRF token once and attach to all mutating requests
let csrfToken = null;

const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const { data } = await axios.get("/csrf-token", { withCredentials: true });
  csrfToken = data.csrf_token;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const mutating = ["post", "put", "patch", "delete"];
  if (mutating.includes(config.method)) {
    const token = await fetchCsrfToken();
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

// On 401, attempt silent refresh via cookie then retry once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axios.post("/auth/refresh", {}, { withCredentials: true });
        return api.request(original);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
