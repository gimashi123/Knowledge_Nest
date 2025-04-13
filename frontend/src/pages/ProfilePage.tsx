import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (profilePic) {
      console.log("Uploading:", profilePic.name);
      // You can later hook this up to a backend API for actual upload
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-20 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      {user && (
        <div className="space-y-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div className="pt-4">
            <label className="block mb-1 text-sm font-medium">Upload Profile Picture</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {profilePic && <p className="text-sm mt-1 text-gray-500">Selected: {profilePic.name}</p>}
            <Button className="mt-3" onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      )}
    </div>
  );
}