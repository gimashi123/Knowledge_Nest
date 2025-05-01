import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const {currentUser, logoutUser} = useAuth()



  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Dashboard 🛠️</h1>
      {currentUser && (
        <div className="mb-6">
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => navigate("/admin-profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Admin Profile
        </Button>
      </div>

      <div className="mt-6 p-4 border border-red-500 rounded-xl bg-red-50">
        <h2 className="text-lg font-semibold text-red-700">Admin Actions</h2>
        <ul className="text-sm text-gray-700 mt-2 space-y-1">
          <li>✔️ Manage Users</li>
          <li>✔️ Moderate Content</li>
          <li>✔️ View Reports</li>
        </ul>
      </div>

      <Button onClick={()=>logoutUser()} className="mt-6 bg-red-600 hover:bg-red-700 text-white">
        Logout
      </Button>
    </div>
  );
}