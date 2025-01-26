import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileStatus, setProfileStatus] = useState<string>('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string>('');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = async () => {
    try {
      const success = await updateProfile({
        name: profileName,
        email: profileEmail
      });

      if (success) {
        setProfileStatus('Profile updated successfully!');
      } else {
        setProfileStatus('Error updating profile.');
      }
      
      setTimeout(() => setProfileStatus(''), 3000);
    } catch (error) {
      setProfileStatus('Error updating profile.');
      setTimeout(() => setProfileStatus(''), 3000);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        setPasswordStatus('Both passwords are required');
        return;
      }

      const success = await changePassword(currentPassword, newPassword);
      
      if (success) {
        setCurrentPassword('');
        setNewPassword('');
        setPasswordStatus('Password changed successfully!');
      } else {
        setPasswordStatus('Current password is incorrect');
      }
      
      setTimeout(() => setPasswordStatus(''), 3000);
    } catch (error) {
      setPasswordStatus('Error changing password.');
      setTimeout(() => setPasswordStatus(''), 3000);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid gap-6">
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
            <Button onClick={handleSaveProfile}>Update Profile</Button>
            {profileStatus && (
              <p className={`text-sm ${profileStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {profileStatus}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Key className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Password</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleChangePassword}>Change Password</Button>
            {passwordStatus && (
              <p className={`text-sm ${passwordStatus.includes('Error') || passwordStatus.includes('incorrect') ? 'text-red-500' : 'text-green-500'}`}>
                {passwordStatus}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
            <div className="pt-4 border-t">
              <Button 
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Account;