import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard 🎉</h1>
      <p className="text-gray-600 mb-6">You're logged in and secured by JWT.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
