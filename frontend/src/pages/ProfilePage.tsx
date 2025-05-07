import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera, Trash2, User, Award,
  Settings, ArrowLeft, Users, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context.tsx";
import api from "@/utils/axiosInstance.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {FollowerFollowing, getFollowersAndFollowingsForUser, UserResponse} from "@/services/social-features.ts";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [followData, setFollowData] = useState<FollowerFollowing>({followers: [], followings: []});
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();

  const fetchFollowData = async () => {
    setIsLoading(true);
    try {
      if (!currentUser?.id) return;
      const data = await getFollowersAndFollowingsForUser(currentUser.id);
      setFollowData(data);
    } catch (error) {
      console.error("Failed to fetch follow data:", error);
      toast.error("Failed to load follow data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchFollowData();
      setName(currentUser.name || "");
    }
  }, [currentUser]);

  const handleFollowAction = async (userId: string, isCurrentlyFollowing: boolean) => {
    try {
      const endpoint = isCurrentlyFollowing ? "/api/social/unfollow" : "/api/social/follow";
      await api.post(endpoint, {
        followerId: currentUser?.id,
        followingId: userId
      });

      setFollowData(prev => ({
        followers: isCurrentlyFollowing ? prev.followers : [...prev.followers, currentUser],
        followings: isCurrentlyFollowing
            ? prev.followings.filter(user => user.userId !== userId)
            : [...prev.followings, { userId, name: '', email: '', profilePic: '' }]
      }));

      toast.success(`Successfully ${isCurrentlyFollowing ? 'unfollowed' : 'followed'}`);
    } catch (error) {
      console.error(`Action failed:`, error);
      toast.error(`Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'}`);
    }
  };

  const handleNameUpdate = async () => {
    try {
      await api.put("/api/user/update-name", { name });
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
      await api.post("/api/user/upload-photo", formData);
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
    } catch {
      toast.error("Failed to remove picture");
    }
  };

  return (
      <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(-1)} variant="ghost" className="hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <div className="w-9"></div>
        </div>

        {currentUser && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden">
                      {currentUser.profilePic ? (
                          <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                      )}
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      <label className="cursor-pointer flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                        <Camera className="w-4 h-4" /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                      </label>
                      {currentUser.profilePic && (
                          <button onClick={handleDeletePhoto} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                      )}
                    </div>
                    {image && (
                        <Button onClick={handleImageUpload} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                          Confirm Upload
                        </Button>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <Button onClick={() => setIsFollowersOpen(true)} className="w-full cursor-pointer flex justify-between items-center" variant="outline">
                      <span>Followers</span>
                      <span className="bg-gray-200 px-2 rounded-full text-sm">{followData.followers.length}</span>
                    </Button>
                    <Button onClick={() => setIsFollowingOpen(true)} className="w-full cursor-pointer flex justify-between items-center" variant="outline">
                      <span>Following</span>
                      <span className="bg-gray-200 px-2 rounded-full text-sm">{followData.followings.length}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Profile Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="flex items-center h-10 px-3 rounded-md border bg-gray-50 text-sm text-gray-700">
                        {currentUser.email}
                      </div>
                    </div>
                    <Button onClick={handleNameUpdate} className="w-50 bg-blue-400 cursor-pointer hover:bg-blue-700">
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-5 h-5" /> <span className="font-medium">Role</span>
                      </div>
                      <p className="mt-1 capitalize">{currentUser.role}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5" /> <span className="font-medium">Member Since</span>
                      </div>
                      <p className="mt-1">2023</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={logoutUser} className="w-50 ml-50 bg-red-100 cursor-pointer hover:bg-red-200 text-red-600">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Followers Dialog */}
        <Dialog open={isFollowersOpen} onOpenChange={setIsFollowersOpen}>
          <DialogContent className="bg-white p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Followers ({followData.followers.length})</DialogTitle>
            </DialogHeader>
            {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : followData.followers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No followers yet</div>
            ) : (
                <div className="space-y-2">
                  {followData.followers.map((follower: UserResponse) => (
                      <div key={follower.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {follower.profilePic ? (
                                <img alt="profile-pic" src={follower.profilePic} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{follower.name}</p>
                            <p className="text-sm text-gray-500">{follower.email}</p>
                          </div>
                        </div>
                        <div>
                        <Button variant="outline" size="sm" onClick={() => handleFollowAction(follower.userId, false)}>
                          Follow
                        </Button>
                          <Button className={'m-1 bg-white text-red-500 font-semibold border-black hover:bg-blue-200'}>Remove</Button>
                        </div>

                      </div>

                  ))}

                </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Following Dialog */}
        <Dialog open={isFollowingOpen} onOpenChange={setIsFollowingOpen}>
          <DialogContent className="bg-white p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Following ({followData.followings.length})</DialogTitle>
            </DialogHeader>
            {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : followData.followings.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Not following anyone</div>
            ) : (
                <div className="space-y-2">
                  {followData.followings.map((followed: UserResponse) => (
                      <div key={followed.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {followed.profilePic ? (
                                <img alt="prof-pic" src={followed.profilePic} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{followed.name}</p>
                            <p className="text-sm text-gray-500">{followed.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleFollowAction(followed.userId, true)}>
                          Unfollow
                        </Button>
                      </div>
                  ))}
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
