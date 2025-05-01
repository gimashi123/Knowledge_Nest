import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Trash2, User, Mail, Award, Settings, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {useAuth} from "@/contexts/auth-context.tsx";
import api from "@/utils/axiosInstance.ts";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const {currentUser, logoutUser} = useAuth();


  const handleNameUpdate = async () => {
    try {
      await api.put("api/user/update-name", null, {
        params: { name },
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    try {
      await api.post("/api/user/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      toast.success("Profile picture updated");
      setImage(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await api.delete("/api/user/delete-photo");
      toast.success("Profile picture removed");
      // Refresh user data to remove image
    } catch {
      toast.error("Failed to remove picture");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 mt-10 md:mt-20 bg-gradient-to-br from-white to-black-50 shadow-lg rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center gap-2 text-black-600 hover:text-black-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-black-700">Your Profile</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center lg:col-span-1">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-black-100 to-black-100 mb-4 overflow-hidden border-2 border-black-200">
              {currentUser?.profilePic ? (
                <img src={currentUser?.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User className="w-16 h-16 text-black-400" />
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <label className="cursor-pointer inline-flex items-center gap-1 text-sm text-black-600 hover:text-black-800 transition-colors">
                <Camera className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
              {currentUser?.profilePic && (
                <button
                  onClick={handleDeletePhoto}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            {image && (
              <Button
                onClick={handleImageUpload}
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white w-full"
              >
                Confirm Upload
              </Button>
            )}

            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Member since 2023</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-purple-500" />
                <span>{currentUser?.role} account</span>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              Profile Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className=" text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Display Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1  items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="flex items-center h-10 px-3 text-sm border rounded-md bg-gray-50">
                  {currentUser?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1  items-center gap-2">
                  <Award className="w-4 h-4" />
                  Account Type
                </label>
                <div className="flex items-center h-10 px-3 text-sm border rounded-md bg-gray-50 capitalize">
                  {currentUser?.role.toLowerCase()}
                </div>
              </div>

              <Button
                onClick={handleNameUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* User Stats Section */}
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Stats</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-700 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </h3>
                <p className="text-sm text-gray-600 mt-1">5 badges earned</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-700 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Activity
                </h3>
                <p className="text-sm text-gray-600 mt-1">Last active: Today</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-700 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Preferences
                </h3>
                <p className="text-sm text-gray-600 mt-1">Notifications enabled</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={() => logoutUser()}
                className="w-full bg-red-100 hover:bg-red-200 text-red-600"
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