import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkBackendHealth } from '@/utils/backendHealth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/api';

export const BackendStatus = ({ showControls = false }) => {
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkBackendHealth();
      if (!healthy && isHealthy) {
        toast({
          variant: "destructive",
          title: "Backend Connection Lost",
          description: "The application is running in offline mode."
        });
      }
      setIsHealthy(healthy);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isHealthy]);

  const toggleBackend = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/admin/toggle-backend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsHealthy(!isHealthy);
        toast({
          title: isHealthy ? "Backend Disabled" : "Backend Enabled",
          description: isHealthy 
            ? "The application is now in offline mode." 
            : "Backend connection restored.",
        });
      }
    } catch (error) {
      console.error('Failed to toggle backend:', error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Could not toggle backend status.",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {isHealthy ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm">
          {isHealthy ? 'Connected' : 'Offline Mode'}
        </span>
      </div>
      {showControls && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleBackend}
          className="text-xs"
        >
          {isHealthy ? 'Disable Backend' : 'Enable Backend'}
        </Button>
      )}
    </div>
  );
};