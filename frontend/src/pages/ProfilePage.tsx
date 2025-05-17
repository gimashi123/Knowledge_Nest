import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera, Trash2, User, Award,
  Settings, ArrowLeft, Loader2,
  Mail, Shield, Link
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
import {FollowerFollowing, getFollowersAndFollowingsForUser, getUserCoinsByUser} from "@/services/social-features.ts";
import { UserService } from "@/services/UserService.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [followData, setFollowData] = useState<FollowerFollowing>({ followers: [], followings: [] });
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, logoutUser, saveUserAfterUpdate } = useAuth();
  const [userCoins, setUserCoins] = useState(0);

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
    if (currentUser) {
      fetchFollowData().then();
      setName(currentUser.name || "");

    }
  }, [currentUser]);

  const handleFollowClick = async (targetUserId: string) => {
    try {
      if (!currentUser) return;
      await UserService.followUser(currentUser.id as string, targetUserId);
      saveUserAfterUpdate({
        ...currentUser,
        following: [...(currentUser.following as any), targetUserId]
      });
      fetchFollowData().then();
      toast.success("Followed successfully");
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast.error("Failed to follow user");
    }
  };

  const handleUnfollowClick = async (targetUserId: string) => {
    try {
      await UserService.unfollowUser(currentUser?.id as string, targetUserId);
      saveUserAfterUpdate({
        ...currentUser as any,
        following: currentUser?.following?.filter(id => id !== targetUserId) || []
      });
      fetchFollowData().then();
      toast.success("Unfollowed successfully");
    } catch (error) {
      console.error("Failed to toggle unfollow:", error);
      toast.error("Failed to unfollow user");
    }
  };

  const handleProfileUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: name.trim(),
        bio: bio.trim(),
        website: website.trim(),
      };

      const res = await api.put("/api/user/update-profile", payload);

      if (res.status === 200) {
        const response = await api.get("/api/user/me");
        setCurrentUser(response.data);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Server rejected the update");
        console.error("Unexpected response:", res);
      }
    } catch (error: any) {
      console.error("Profile update error:", error?.response || error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    try {
      setIsLoading(true);
      await api.post("/api/user/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const response = await api.get("/api/user/me");
      setCurrentUser(response.data);
      toast.success("Profile picture updated");
      setImage(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoins = async () => {
    if(!currentUser)return;
    const coins = await getUserCoinsByUser(currentUser?.id as string) || 0
    setUserCoins(coins);
  }

  useEffect(() => {
    fetchCoins().then()
  }, []);

  const handleDeletePhoto = async () => {
    try {
      await api.delete("/api/user/delete-photo");
      const response = await api.get("/api/user/me");
      setCurrentUser(response.data);
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Failed to remove picture");
    }
  };

  return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 bg-neutral-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="hover:bg-neutral-100 gap-2 text-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">Profile Settings</h1>
          <div className="w-9"></div>
        </div>

        {currentUser && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="border border-neutral-200 shadow-sm">
                  <CardHeader className="bg-neutral-50 border-b border-neutral-200">
                    <CardTitle className="flex items-center gap-2 mt-5  text-neutral-800">
                      <User className="w-5 h-5 text-neutral-600" /> Profile Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                          <AvatarImage
                              src={currentUser.profilePic ? `${currentUser.profilePic}?${Date.now()}` : '/default-user.jpg'}
                              alt="Profile"
                          />
                          <AvatarFallback className="bg-neutral-100">
                            <User className="w-16 h-16 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex gap-3 mb-4">
                        <label className="cursor-pointer inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                          <Camera className="w-4 h-4" /> Upload
                          <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setImage(e.target.files?.[0] || null)}
                          />
                        </label>
                        {currentUser.profilePic && (
                            <button
                                onClick={handleDeletePhoto}
                                className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
                        )}
                      </div>

                      {image && (
                          <Button
                              onClick={handleImageUpload}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              disabled={isLoading}
                          >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Confirm Upload
                          </Button>
                      )}
                    </div>

                    <Separator className="my-6 bg-neutral-200" />

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                          onClick={() => setIsFollowersOpen(true)}
                          variant="outline"

                          className=" w-full  items-center h-10 py-3 border-blue-800 hover:bg-blue-50"
                      >
                        <span className="text-lg font-semibold text-neutral-800">{followData.followers.length}</span>
                        <span className="text-sm text-neutral-500">Followers</span>
                      </Button>
                      <Button
                          onClick={() => setIsFollowingOpen(true)}
                          variant="outline"
                          className="w-full items-center h-10 py-3 border-blue-800 hover:bg-blue-50"
                      >
                        <span className="text-lg font-semibold text-neutral-800">{followData.followings.length}</span>
                        <span className="text-sm text-neutral-500">Following</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 shadow-sm">
                  <CardHeader className="bg-neutral-50 border-b border-neutral-200">
                    <CardTitle className="flex items-center gap-2 text-neutral-800">
                      <Shield className="w-5 h-5 text-neutral-600" /> Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Email</p>
                        <p className="flex items-center gap-2 mt-1 text-neutral-800">
                          <Mail className="w-4 h-4 text-neutral-500" /> {currentUser.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Role</p>
                        <Badge variant="outline" className="mt-1 capitalize bg-neutral-100 text-neutral-800 border-neutral-300">
                          {currentUser.role}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-6 bg-neutral-200" />

                    <Button
                        onClick={logoutUser}
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Profile Info */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="border border-neutral-200 shadow-sm">
                  <CardHeader className="bg-neutral-50 border-b border-neutral-200">
                    <CardTitle className="flex items-center gap-2 mt-5 text-neutral-800">
                      <Settings className="w-5 h-5 text-neutral-600" /> Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700">Display Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700">Bio</label>
                        <Input
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell others about yourself"
                            className="border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-700">Website</label>
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-neutral-500" />
                          <Input
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              placeholder="https://example.com"
                              className="border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                          onClick={handleProfileUpdate}
                          disabled={isSaving}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional sections can be added here */}
                <Card className="border border-neutral-200 shadow-sm">
                  <CardHeader className="bg-neutral-50 border-b border-neutral-200">
                    <CardTitle className="flex items-center gap-2 text-neutral-800">
                      <Award className="w-5 h-5 text-neutral-600" /> Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-neutral-600">Your Coins:</span>
                      <span className="font-bold text-neutral-800">{userCoins || 0}</span>
                    </div>
                    <div className="text-center text-neutral-500 py-4">

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        )}

        {/* Followers Dialog */}
        <Dialog open={isFollowersOpen} onOpenChange={setIsFollowersOpen}>
          <DialogContent className="sm:max-w-[425px] border border-neutral-200">
            <DialogHeader className="border-b border-neutral-200 pb-4">
              <DialogTitle className="text-neutral-800">Followers ({followData.followers.length})</DialogTitle>
            </DialogHeader>
            {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
            ) : followData.followers.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No followers yet</div>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {followData.followers.map((follower) => (
                      <div key={follower.userId} className="flex items-center justify-between gap-4 p-2 hover:bg-neutral-50 rounded">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={follower.profilePic || undefined} />
                            <AvatarFallback className="bg-neutral-100">
                              <User className="w-5 h-5 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-neutral-800">{follower.name}</p>
                            <p className="text-sm text-neutral-500">{follower.email}</p>
                          </div>
                        </div>
                        {currentUser?.following?.includes(follower.userId) ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                                onClick={() => handleUnfollowClick(follower.userId)}
                            >
                              Following
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleFollowClick(follower.userId)}
                            >
                              Follow
                            </Button>
                        )}
                      </div>
                  ))}
                </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Following Dialog */}
        <Dialog open={isFollowingOpen} onOpenChange={setIsFollowingOpen}>
          <DialogContent className="sm:max-w-[425px] border border-neutral-200">
            <DialogHeader className="border-b border-neutral-200 pb-4">
              <DialogTitle className="text-neutral-800">Following ({followData.followings.length})</DialogTitle>
            </DialogHeader>
            {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
            ) : followData.followings.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">Not following anyone</div>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {followData.followings.map((followed) => (
                      <div key={followed.userId} className="flex items-center justify-between gap-4 p-2 hover:bg-neutral-50 rounded">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={followed.profilePic || undefined} />
                            <AvatarFallback className="bg-neutral-100">
                              <User className="w-5 h-5 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-neutral-800">{followed.name}</p>
                            <p className="text-sm text-neutral-500">{followed.email}</p>
                          </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleUnfollowClick(followed.userId)}
                        >
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
//currentUser.userCoins