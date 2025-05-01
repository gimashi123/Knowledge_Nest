import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/contexts/auth-context.tsx";

const PrivateRoute = () => {
    const { currentUser } = useAuth();

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
