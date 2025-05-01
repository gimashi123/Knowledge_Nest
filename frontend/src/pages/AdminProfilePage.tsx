import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Trash2, Shield, Users, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/axiosInstance.ts";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const {currentUser, logoutUser} = useAuth();

  const handleNameUpdate = async () => {
    try {
      await api.put("/api/user/update-name", null, {
        params: { name },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Name updated");
    } catch {
      toast.error("Failed to update name");
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    try {
      await api.post("/api/user/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Photo uploaded");
      setImage(null);
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await api.delete("/api/user/delete-photo");
      toast.success("Photo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-20 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-3xl">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">currentUser? Profile</h1>

      {currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center lg:col-span-1">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
              {currentUser?.profilePic ? (
                <img src={currentUser?.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-gray-500 text-sm">No Image</span>
              )}
            </div>

            <div className="flex gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Camera className="w-4 h-4" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
              <button
                onClick={handleDeletePhoto}
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

            {image && (
              <Button onClick={handleImageUpload} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Upload Image
              </Button>
            )}

            <div className="mt-6 w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>currentUser? Privileges</span>
              </div>
              <Button
                onClick={() => navigate("/currentUser?-dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm"><strong>Email:</strong> {currentUser?.email}</p>
              <p className="text-sm"><strong>Role:</strong> {currentUser?.role}</p>
            </div>

            <Button onClick={handleNameUpdate} className="w-full bg-black hover:bg-gray-800 text-white">
              Save Changes
            </Button>
          </div>

          {/* currentUser? Actions Section */}
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">currentUser? Quick Actions</h2>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/user-management")}
                className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Users className="w-4 h-4" />
                Manage Users
              </Button>

              <Button
                onClick={() => navigate("/content-moderation")}
                className="w-full flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <AlertTriangle className="w-4 h-4" />
                Moderate Content
              </Button>

              <Button
                onClick={() => navigate("/reports")}
                className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Shield className="w-4 h-4" />
                View Reports
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={()=> logoutUser()}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}