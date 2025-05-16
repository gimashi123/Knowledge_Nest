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
import OAuthSuccess from "@/pages/OAuthSuccess";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProfilePage from "@/pages/AdminProfilePage";
import AdminPostsPage from "@/pages/AdminPostsPage";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { NotificationProvider } from "@/contexts/notification-context";



import {UserDashboardPage} from "@/pages/UserDashboardPage.tsx";
import LaunchPage from "@/pages/LaunchPage.tsx";
import ChallengeListPage from "@/pages/Challenges/ChallengeListPage.tsx";
import {ChallengeForm} from "@/pages/Challenges/ChallengeForm.tsx";
import ChallengeAttemptPage from "@/pages/Challenges/ChallengeAttemptPage.tsx";
import {ProgressPage} from "@/pages/progressTrack/ProgressTrack.tsx";


import SkillPostsPage from "@/pages/skillpost/SkillPostsPage";
import SkillPostDetailPage from "@/pages/skillpost/SkillPostDetailPage";
// import UserSkillPostsPage from "@/pages/UserSkillPostsPage.tsx";
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
                <NotificationProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path={'/'} element={<LaunchPage/>} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/oauth-success" element={<OAuthSuccess/>} />

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

                            <Route element={<AdminRoute />}>
                                <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                                <Route path="/admin-profile" element={<AdminProfilePage />} />
                                <Route path="/admin-progress" element={<ProgressPage/>} />
                                <Route path="/admin/posts" element={<AdminPostsPage />} />
                                <Route path="/admin/posts/:id" element={<AdminPostsPage />} />
                            </Route>

                            {/* Admin Nested Routes */}
                            <Route path="/admin-dashboard" element={<AdminDashboardPage />}>
                                {/*<Route index element={<AdminHome />} /> /!* Create this component *!/*/}

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

                            {/* Regular User Routes */}
                            <Route element={<UserRoute />}>
                                <Route path="challenges" element={<ChallengeListPage />} />
                                <Route path="add-challenges" element={<ChallengeForm />} />
                                <Route path="challenge-attempt/:id/attempt" element={<ChallengeAttemptPage />} />

                                <Route path="/user-dashboard" element={<UserDashboardPage />} />
                                <Route path="/skill-posts" element={<SkillPostsPage />} />
                                <Route path="/skill-posts/:id" element={<SkillPostDetailPage />} />
                                <Route path="/user-settings" element={<UserSettingsPage />} />
                                <Route path="/progress" element={<ProgressPage />} />
                            </Route>
                        </Route>
                        </Route>
                    </Routes>
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

