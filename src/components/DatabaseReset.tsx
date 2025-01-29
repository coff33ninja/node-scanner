import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS } from '@/config/api';

const DatabaseReset = () => {
  const { toast } = useToast();

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/database/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Database Reset Successful",
          description: "The database has been reset to its initial state. Please log in with the default admin credentials.",
        });
        // Redirect to login page
        window.location.href = '/login';
      } else {
        throw new Error('Failed to reset database');
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset the database. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Reset Database</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will reset the database to its initial state. All user data, devices, and settings will be lost.
            The default admin account will be restored with default credentials.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Reset Database</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DatabaseReset;