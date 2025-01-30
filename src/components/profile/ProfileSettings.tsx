import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Camera } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const ProfileSettings = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const success = await updateProfile({
      name: profileName,
      email: profileEmail,
    });
    setIsLoading(false);

    toast({
      title: success ? "Profile updated" : "Update failed",
      description: success
        ? "Your profile has been updated successfully."
        : "There was an error updating your profile.",
      variant: success ? "default" : "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentUser?.avatarUrl} />
          <AvatarFallback className="text-lg">
            {currentUser?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" className="space-x-2">
            <Camera className="h-4 w-4" />
            <span>Change Picture</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="animate-slide-in"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            className="animate-slide-in"
          />
        </div>
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;