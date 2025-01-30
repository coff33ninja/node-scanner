import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Layout from "@/components/Layout";
import ProfileSettings from "@/components/profile/ProfileSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";
import { UserCircle } from "lucide-react";

const Account = () => {
  const { currentUser, isFirstRun } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !isFirstRun) {
      navigate("/");
    }
  }, [currentUser, isFirstRun, navigate]);

  if (currentUser) {
    return (
      <Layout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <UserCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="p-6">
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                  <ProfileSettings />
                </TabsContent>
                <TabsContent value="security" className="space-y-4">
                  <SecuritySettings />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src="/lovable-uploads/5b365417-f2a4-4acf-9b1c-9fdcb92cc02e.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          <span className="ml-2">UpSnap</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Manage your network devices with ease and security.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isFirstRun ? "Welcome to UpSnap" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isFirstRun
                ? "Create an admin account to get started"
                : "Enter your credentials to access your account"}
            </p>
          </div>
          {isFirstRun ? (
            <RegisterForm />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;