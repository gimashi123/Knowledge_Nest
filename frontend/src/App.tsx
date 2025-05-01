
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import OAuthSuccessPage from "@/pages/OAuthSuccessPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProfilePage from "@/pages/AdminProfilePage";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import LaunchPage from "@/pages/LaunchPage.tsx";

// PrivateRoute component
function PrivateRoute() {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LaunchPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/oauth-success" element={<OAuthSuccessPage />} />

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin-profile" element={<AdminProfilePage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
