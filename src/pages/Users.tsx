import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserCog, Trash2, Shield, ShieldOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "user";
  lastActive: string;
}

const Users = () => {
  const { user: currentUser } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get users from localStorage
  const getUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  };

  const handleAddUser = () => {
    try {
      const users = getUsers();
      
      // Validate input
      if (!newUser.username || !newUser.password || !newUser.email || !newUser.name) {
        setError("All fields are required");
        setTimeout(() => setError(""), 3000);
        return;
      }

      // Check if username exists
      if (users.some(u => u.username === newUser.username)) {
        setError("Username already exists");
        setTimeout(() => setError(""), 3000);
        return;
      }

      const userToAdd = {
        id: crypto.randomUUID(),
        ...newUser,
        role: "user",
        lastActive: new Date().toISOString(),
      };

      users.push(userToAdd);
      localStorage.setItem("users", JSON.stringify(users));
      
      setSuccess("User added successfully");
      setTimeout(() => setSuccess(""), 3000);
      setShowAddUser(false);
      setNewUser({ username: "", password: "", email: "", name: "" });
    } catch (error) {
      setError("Error adding user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteUser = (userId: string) => {
    try {
      const users = getUsers();
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error deleting user");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleToggleRole = (userId: string) => {
    try {
      const users = getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, role: u.role === "admin" ? "user" : "admin" };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setSuccess("User role updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error updating user role");
      setTimeout(() => setError(""), 3000);
    }
  };

  const users = getUsers();

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user access and permissions
          </p>
        </div>
        {currentUser?.role === "admin" && (
          <Button onClick={() => setShowAddUser(!showAddUser)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {showAddUser && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleAddUser}>Add User</Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <UserCog className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Last active: {new Date(user.lastActive).toLocaleString()}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                }`}>
                  {user.role}
                </span>
                {currentUser?.role === "admin" && currentUser.id !== user.id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRole(user.id)}
                    >
                      {user.role === "admin" ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Users;