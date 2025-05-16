import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {  login, getCurrentUser } from "../services/authService";
import {useNavigate} from "react-router-dom";


export interface User {
    id?: string;      // Optional ID field
    email: string;    // Email is the primary identifier
    name: string;
    role: string;
    profilePic?: string;
    followers?: string[];
    following?: string[];
    userCoins?:number;
}

interface AuthContextType {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading : boolean
    accessToken: string | null;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => void;
    saveUserAfterUpdate: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user details when token changes
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (accessToken) {
                try {
                    const userData = await getCurrentUser();
                    if (userData) {
                        // Update user with complete profile including ID
                        setCurrentUser(prev => ({
                            ...prev as User,
                            ...userData,
                        }));
                        // Update localStorage with complete user data
                        localStorage.setItem("user", JSON.stringify({
                            ...currentUser,
                            ...userData,
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserDetails();
    }, [accessToken]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        if (token && user) {
            setAccessToken(token);
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    // Redirect to appropriate dashboard based on user role
    useEffect(() => {
        if (currentUser && !loading) {
            const path = window.location.pathname;
            // Only redirect if at root, login, or register
            if (path === '/' || path === '/login' || path === '/register') {
                if (currentUser.role === "ROLE_ADMIN") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/user-dashboard");
                }
            }
        }
    }, [currentUser, loading, navigate]);

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
        navigate("/");
    };

    const saveUserAfterUpdate = (updatedUser : User) => {
        setCurrentUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return (
        <AuthContext.Provider value={{ loading, currentUser, accessToken, loginUser, logoutUser , setCurrentUser, saveUserAfterUpdate}}>
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

