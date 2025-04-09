import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "../services/authService";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        handleLogout();
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard 🎉</h1>
      {user && (
        <div className="mb-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
