import { User } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { UserCircle, Shield, Clock } from "lucide-react";

interface UserCardProps {
  user: User;
  isOnline?: boolean;
}

const UserCard = ({ user, isOnline }: UserCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.role === 'admin' ? 'Administrator' : 'Regular user'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <p className="text-sm text-muted-foreground">{user.email}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Last active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;