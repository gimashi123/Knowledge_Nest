import { useState } from "react";
import { UserSidebar } from "@/components/sidebar/UserSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Lock, User, Globe } from "lucide-react";

export default function UserSettingsPage() {
  const { currentUser } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="flex min-h-screen">
      <UserSidebar />

      <main className="flex-1 ml-[220px] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {/* Profile Settings */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Profile Settings
            </h2>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={currentUser?.name} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser?.email} />
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Password Settings
            </h2>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-amber-600" />
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme interface</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-purple-600" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow other users to view your profile</p>
                </div>
                <Switch 
                  checked={publicProfile} 
                  onCheckedChange={setPublicProfile}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 