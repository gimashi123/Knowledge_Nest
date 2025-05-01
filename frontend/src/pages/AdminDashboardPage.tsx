// pages/admin-dashboard.tsx
import { Outlet } from "react-router-dom";
import {Sidebar} from "@/components/sidebar/Sidebar.tsx";



export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-[220px] p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}