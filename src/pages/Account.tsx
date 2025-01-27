import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, Shield, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Account = () => {
  const { currentUser, updateProfile, changePassword, logout, register, login, isFirstRun } = useAuth();
  const navigate = useNavigate();
  
  // Login/Register state
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Profile state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileStatus, setProfileStatus] = useState<string>('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleAuthSubmit = async () => {
    try {
      if (isRegistering || isFirstRun) {
        if (!loginData.username || !loginData.password || !loginData.email || !loginData.name) {
          setAuthError('All fields are required');
          return;
        }
        const success = await register(loginData);
        if (success) {
          setAuthSuccess('Registration successful!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setAuthError('Username already exists');
        }
      } else {
        if (!loginData.username || !loginData.password) {
          setAuthError('Username and password are required');
          return;
        }
        const success = await login(loginData.username, loginData.password);
        if (success) {
          setAuthSuccess('Login successful!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setAuthError('Invalid username or password');
        }
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {isRegistering ? 'Create Account' : 'Login'}
            </h1>
            <Button
              variant="outline"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError('');
                setLoginData({ username: '', password: '', email: '', name: '' });
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </Button>
          </div>

          {authError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              {authSuccess}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={loginData.name}
                    onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              {isRegistering ? 'Create Account' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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
            <Button onClick={async () => {
              const success = await updateProfile({
                name: profileName,
                email: profileEmail
              });
              setProfileStatus(success ? 'Profile updated successfully!' : 'Error updating profile.');
              setTimeout(() => setProfileStatus(''), 3000);
            }}>
              Update Profile
            </Button>
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
            <Button onClick={async () => {
              const success = await changePassword(currentPassword, newPassword);
              if (success) {
                setCurrentPassword('');
                setNewPassword('');
                setPasswordStatus('Password changed successfully!');
              } else {
                setPasswordStatus('Current password is incorrect');
              }
              setTimeout(() => setPasswordStatus(''), 3000);
            }}>
              Change Password
            </Button>
            {passwordStatus && (
              <p className={`text-sm ${passwordStatus.includes('incorrect') ? 'text-red-500' : 'text-green-500'}`}>
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
            <div className="pt-4 border-t">
              <Button 
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate('/account');
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