import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="flex items-start space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </Card>
  );
};

export default UserSkeleton;