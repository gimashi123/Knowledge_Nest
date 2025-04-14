import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Camera, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string; profilePic?: string } | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("Logged out");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setName(userData.name);
      } catch (err) {
        handleLogout();
      }
    };
    fetchUser();
  }, []);

  const handleNameUpdate = async () => {
    try {
      await axios.put("http://localhost:8081/api/user/update-name", null, {
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
      await axios.post("http://localhost:8081/api/user/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
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
      await axios.delete("http://localhost:8081/api/user/delete-photo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Photo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-20 bg-gradient-to-br from-white to-purple-50 shadow-xl rounded-3xl text-center">
      <h1 className="text-3xl font-bold text-black-700 mb-6">Profile Page</h1>

      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
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
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-left">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Info</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm"><strong>Email:</strong> {user.email}</p>
              <p className="text-sm"><strong>Role:</strong> {user.role}</p>
            </div>

            <Button onClick={handleNameUpdate} className="w-full bg-black hover:bg-black-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <Button onClick={handleLogout} className="mt-8 bg-red-600 hover:bg-red-700 text-white">
        Logout
      </Button>
    </div>
  );
}