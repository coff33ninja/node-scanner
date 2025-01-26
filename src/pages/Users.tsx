import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserCog } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  lastActive: string;
}

const Users = () => {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      lastActive: "5 minutes ago",
    },
  ]);

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user access and permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

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
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Last active: {user.lastActive}
                </span>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Users;