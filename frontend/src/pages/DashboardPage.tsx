import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {currentUser, logoutUser} = useAuth();
  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard 🎉</h1>
      {currentUser && (
        <div className="mb-6">
          <p><strong>Name:</strong> {currentUser?.name}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
        </div>
      )}

      <Button onClick={() => navigate("/profile")} className="mt-2 mr-2">
        View Profile
      </Button>

      <div className="mt-6 p-4 border border-green-500 rounded-xl bg-green-50">
        <h2 className="text-lg font-semibold text-green-700">User Features</h2>
        <ul className="text-sm text-gray-700 mt-2 space-y-1">
          <li>✔️ View your progress</li>
          <li>✔️ Complete challenges</li>
          <li>✔️ Track achievements</li>
        </ul>
      </div>

      <Button onClick={()=>logoutUser()} className="mt-6">
        Logout
      </Button>
    </div>
  );
}