import  { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {  login } from "../services/authService";
import {useNavigate} from "react-router-dom";


export interface User {
    email: string;
    name: string;
    role: string;
    profilePic: string;
}

interface AuthContextType {
    currentUser: User | null;
    loading : boolean
    accessToken: string | null;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        if (token && user) {
            setAccessToken(token);
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    const loginUser = async (email: string, password: string) => {
        const res = await login(email, password);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
        setAccessToken(res.accessToken);
        setCurrentUser(res.user);

        if(res.user.role === "ROLE_ADMIN"){
            navigate("/admin-dashboard");
        }else{
            navigate("/user-dashboard");
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ loading, currentUser, accessToken, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
