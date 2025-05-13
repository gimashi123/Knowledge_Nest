import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      setError("Failed to login with Google. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/dashboard");
    } else {
      setError("No authentication token received. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : (
        <p className="text-lg text-gray-700">Logging you in via Google...</p>
      )}
    </div>
  );
}
