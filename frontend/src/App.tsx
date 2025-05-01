
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
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import {ProgressPage} from "@/pages/authorized/admin/ProgressPage.tsx";
import {UserDashboardPage} from "@/pages/UserDashboardPage.tsx";
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
                    <Route path={'/'} element={<LaunchPage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/oauth-success" element={<OAuthSuccessPage />} />

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                        <Route path="/user-dashboard" element={<UserDashboardPage />} />
                        <Route path="/admin-profile" element={<AdminProfilePage />} />
                        <Route path={'/admin-progress'} element={<ProgressPage/>} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<ProfilePage />} />

                            {/* Admin Nested Routes */}
                            <Route path="/admin-dashboard" element={<AdminDashboardPage />}>
                                {/*<Route index element={<AdminHome />} /> /!* Create this component *!/*/}
                                <Route path="progress" element={<ProgressPage />} />
                                {/*<Route path="posts" element={<PostsPage />} />*/}
                                {/*<Route path="users" element={<UsersPage />} />*/}
                                {/*<Route path="settings" element={<SettingsPage />} />*/}
                                <Route path="admin-profile" element={<AdminProfilePage />} />
                            </Route>
                            <Route path="/user-dashboard" element={<UserDashboardPage />}>
                                {/*<Route index element={<AdminHome />} /> /!* Create this component *!/*/}
                                <Route path="progress" element={<ProgressPage />} />
                                {/*<Route path="posts" element={<PostsPage />} />*/}
                                {/*<Route path="users" element={<UsersPage />} />*/}
                                {/*<Route path="settings" element={<SettingsPage />} />*/}
                                <Route path="admin-profile" element={<AdminProfilePage />} />
                            </Route>
                        </Route>

                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
