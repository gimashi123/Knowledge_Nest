import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import OAuthSuccessPage from "@/pages/OAuthSuccessPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProfilePage from "@/pages/AdminProfilePage";

// Skill Posts Pages
import SkillPostsPage from "@/pages/skills/SkillPostsPage";
import SkillPostFormPage from "@/pages/skills/SkillPostFormPage";
import SkillPostDetailPage from "@/pages/skills/SkillPostDetailPage";

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

      {/* Skill Posts Routes */}
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <SkillPostsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/skills/create"
        element={
          <ProtectedRoute>
            <SkillPostFormPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/skills/edit/:id"
        element={
          <ProtectedRoute>
            <SkillPostFormPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/skills/:id"
        element={
          <ProtectedRoute>
            <SkillPostDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
