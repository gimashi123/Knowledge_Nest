// components/sidebar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
    LayoutDashboard,
    BookOpen,
    User,
    // FileText,
    Settings,
    LoaderPinwheel,
    LogOut,
    // Package2,
    Trophy, // Added Trophy icon for challenges
    GraduationCap
} from "lucide-react";

export function UserSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logoutUser, currentUser } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="hidden border-r bg-muted/40 md:block w-[220px] fixed left-0 top-0 h-screen">
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <GraduationCap className="h-6 w-6" />
                        <span className="">Knowledge Nest</span>
                    </Link>
                </div>
                <div className="flex-1 p-2">
                    <nav className="grid items-start gap-1">
                        <Button
                            variant={isActive("/user-dashboard") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/user-dashboard")}
                            //onClick={() => navigate("/user-dashboard/progress")}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button
                            variant={isActive("/skill-posts") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/skill-posts")}
                        >
                            <BookOpen className="h-4 w-4" />
                            Learning Resources
                        </Button>
                        <Button
                            variant={isActive("/profile") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/profile")}
                        >
                            <User className="h-4 w-4" />
                            My Profile
                        </Button>
                        {/* Challenges Section */}
                        <Button
                            variant="ghost"
                            className="justify-start gap-2"
                            onClick={() => navigate("/challenges")}
                        >
                            <Trophy className="h-4 w-4" />
                            View Challenges
                        </Button>
                        <Button
                            variant="ghost"
                            className="justify-start gap-2"
                            onClick={() => navigate("/add-challenges")}
                        >
                            <Trophy className="h-4 w-4" />
                            Create Challenge
                        </Button>
                        <Button
                            variant={isActive("/progress") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/progress")}
                        >
                            <LoaderPinwheel className="h-4 w-4" />
                            Progress
                        </Button>
                        <Button
                            variant={isActive("/user-settings") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/user-settings")}
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>

                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className="mb-4">
                        {currentUser && (
                            <div className="text-sm font-medium">
                                <p>{currentUser.name}</p>

                            </div>
                        )}
                    </div>
                    <Button
                        onClick={logoutUser}
                        variant="outline"
                        className="w-full gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}