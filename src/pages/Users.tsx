import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, UserPlus, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

interface UserListItem {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
}

const Users = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
  });

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers.map(({ passwordHash, ...user }: any) => user));
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: UserListItem) => u.username === newUser.username)) {
        toast({
          title: "Error",
          description: "Username already exists",
          variant: "destructive",
        });
        return;
      }

      const bcryptjs = await import('bcryptjs');
      const hashedPassword = await bcryptjs.hash(newUser.password, 10);
      
      const newUserData: UserListItem & { passwordHash: string } = {
        id: crypto.randomUUID(),
        ...newUser,
        passwordHash: hashedPassword,
        role: 'user' as const,
        lastActive: new Date().toISOString(),
      };

      users.push(newUserData);
      localStorage.setItem('users', JSON.stringify(users));

      const { passwordHash, ...userWithoutPassword } = newUserData;
      setUsers(prev => [...prev, userWithoutPassword]);
      
      setNewUser({ username: '', password: '', email: '', name: '' });
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((u: UserListItem) => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  if (!currentUser?.role || currentUser.role !== 'admin') {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add User</Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Last active: {new Date(user.lastActive).toLocaleString()}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.id === currentUser?.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Users;