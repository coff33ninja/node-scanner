import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfileSettings = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profileStatus, setProfileStatus] = useState<string>("");

  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      name: profileName,
      email: profileEmail,
    });
    setProfileStatus(
      success ? "Profile updated successfully!" : "Error updating profile."
    );
    setTimeout(() => setProfileStatus(""), 3000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Profile Information</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleUpdateProfile}>Update Profile</Button>
        {profileStatus && (
          <p
            className={`text-sm ${
              profileStatus.includes("Error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {profileStatus}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfileSettings;