import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<{ name: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminData = await getCurrentUser();
        setAdmin(adminData);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Dashboard 🛠️</h1>
      {admin && (
        <div className="mb-6">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      )}

      <div className="mt-6 p-4 border border-red-500 rounded-xl bg-red-50">
        <h2 className="text-lg font-semibold text-red-700">Admin Actions</h2>
        <ul className="text-sm text-gray-700 mt-2 space-y-1">
          <li>✔️ Manage Users</li>
          <li>✔️ Moderate Content</li>
          <li>✔️ View Reports</li>
        </ul>
      </div>

      <Button onClick={handleLogout} className="mt-6 bg-red-600 hover:bg-red-700 text-white">
        Logout
      </Button>
    </div>
  );
}