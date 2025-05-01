import {Outlet} from "react-router-dom";
import {UserSidebar} from "@/components/sidebar/UserSidebar.tsx";

export const UserDashboardPage = () => {
    return (

        <div className="flex min-h-screen">
            <UserSidebar />

            <main className="flex-1 ml-[220px] p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );

};
