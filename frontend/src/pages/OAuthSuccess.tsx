import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context.tsx";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCurrentUser } = useAuth();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get("email");

        if (email) {
            fetch("http://localhost:8081/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Response from backend:", data);

                    if (!data?.result) {
                        throw new Error("Missing data in response");
                    }

                    const { accessToken, user } = data.result;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("user", JSON.stringify(user));

                    setCurrentUser(user);

                    if (user.role === "ROLE_ADMIN") {
                        navigate("/admin-dashboard");
                    } else {
                        navigate("/user-dashboard");
                    }
                })
                .catch((err) => {
                    console.error("Google login failed", err);
                    navigate("/login");
                });

        } else {
            navigate("/login");
        }
    }, [location, navigate, setCurrentUser]);

    return <p>Logging you in...</p>;
}