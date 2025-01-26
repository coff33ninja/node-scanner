import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Users as UsersIcon } from "lucide-react";
import Layout from "@/components/Layout";
import UserCard from "@/components/users/UserCard";
import UserSkeleton from "@/components/users/UserSkeleton";
import { databaseService } from "@/services/DatabaseService";
import { useAuth } from "@/contexts/AuthContext";

const Users = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: databaseService.getAllUsers,
  });

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot delete own account",
        description: "You cannot delete your own account while logged in.",
        variant: "destructive",
      });
      return;
    }

    const success = await databaseService.deleteUser(userId);
    
    toast({
      title: success ? "User deleted" : "Delete failed",
      description: success
        ? "User has been deleted successfully."
        : "There was an error deleting the user.",
      variant: success ? "default" : "destructive",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Users</h1>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <UserSkeleton key={i} />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isOnline={user.lastActive > new Date(Date.now() - 5 * 60 * 1000).toISOString()}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;