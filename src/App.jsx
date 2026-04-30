import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Nav           from "./components/Nav.jsx";
import Login         from "./pages/Login.jsx";
import Dashboard     from "./pages/Dashboard.jsx";
import Profiles      from "./pages/Profiles.jsx";
import ProfileDetail from "./pages/ProfileDetail.jsx";
import Search        from "./pages/Search.jsx";
import Account       from "./pages/Account.jsx";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Nav />}
      <main className="main">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profiles"  element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
          <Route path="/profiles/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
          <Route path="/search"    element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/account"   element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
