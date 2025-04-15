import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import OAuthSuccessPage from "@/pages/OAuthSuccessPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProfilePage from "@/pages/AdminProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />

      {/* Protected dashboard for USER */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected dashboard for ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/admin-profile" element={<ProtectedRoute><AdminProfilePage /></ProtectedRoute>} />

    </Routes>
  );
}
