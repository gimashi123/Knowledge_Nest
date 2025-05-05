import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
}
from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import OAuthSuccessPage from "@/pages/OAuthSuccessPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProfilePage from "@/pages/AdminProfilePage";
import AdminPostsPage from "@/pages/AdminPostsPage";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import {ProgressPage} from "@/pages/authorized/admin/ProgressPage.tsx";
import {UserDashboardPage} from "@/pages/UserDashboardPage.tsx";
import LaunchPage from "@/pages/LaunchPage.tsx";
import SkillPostsPage from "@/pages/skillpost/SkillPostsPage";
import SkillPostDetailPage from "@/pages/skillpost/SkillPostDetailPage";
import UserSkillPostsPage from "@/pages/UserSkillPostsPage.tsx";
import UserSettingsPage from "@/pages/UserSettingsPage.tsx";

function PrivateRoute() {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}

function AdminRoute() {
    const { currentUser } = useAuth();
    return currentUser && currentUser.role === "ROLE_ADMIN" ? 
        <Outlet /> : 
        <Navigate to="/user-dashboard" replace />;
}

function UserRoute() {
    const { currentUser } = useAuth();
    return currentUser && currentUser.role !== "ROLE_ADMIN" ? 
        <Outlet /> : 
        <Navigate to="/admin-dashboard" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path={'/'} element={<LaunchPage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/oauth-success" element={<OAuthSuccessPage />} />

                    {/* Private Routes for Everyone */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        
                        {/* Admin Only Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                            <Route path="/admin-profile" element={<AdminProfilePage />} />
                            <Route path="/admin-progress" element={<ProgressPage/>} />
                            <Route path="/admin/posts" element={<AdminPostsPage />} />
                            <Route path="/admin/posts/:id" element={<AdminPostsPage />} />
                        </Route>
                        
                        {/* Regular User Routes */}
                        <Route element={<UserRoute />}>
                            <Route path="/user-dashboard" element={<UserDashboardPage />} />
                            <Route path="/skill-posts" element={<UserSkillPostsPage />} />
                            <Route path="/skill-posts/:id" element={<UserSkillPostsPage />} />
                            <Route path="/user-settings" element={<UserSettingsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
