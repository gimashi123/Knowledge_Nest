// components/sidebar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Package2
} from "lucide-react";

export function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logoutUser, currentUser } = useAuth();
    
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="hidden border-r bg-muted/40 md:block w-[220px] fixed left-0 top-0 h-screen">
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Admin Panel</span>
                    </Link>
                </div>
                <div className="flex-1 p-2">
                    <nav className="grid items-start gap-1">
                        <Button
                            variant={isActive("/admin-dashboard/progress") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/admin-dashboard/progress")}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button
                            variant={isActive("/admin/posts") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/admin/posts")}
                        >
                            <FileText className="h-4 w-4" />
                            Posts
                        </Button>
                        <Button
                            variant={isActive("/admin/users") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/admin/users")}
                        >
                            <Users className="h-4 w-4" />
                            Users
                        </Button>
                        <Button
                            variant={isActive("/admin/settings") ? "default" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => navigate("/admin/settings")}
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
                                <p className="text-muted-foreground">{currentUser.role}</p>
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