import * as React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthWrapper from "@/components/auth/AuthWrapper";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Account from "@/pages/Account";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import { queryClient } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

// Root layout component that handles auth state
const RootLayout: React.FC = () => {
  console.log('[RootLayout] Rendering root layout');
  return (
    <AuthWrapper>
      <Outlet />
    </AuthWrapper>
  );
};

// Protected layout for authenticated routes
const ProtectedLayout: React.FC = () => {
  console.log('[ProtectedLayout] Rendering protected layout');
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

// Router configuration with nested routes
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <div>Something went wrong!</div>,
    children: [
      {
        path: "auth",
        element: <Account />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <Index />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "users",
            element: <Users />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/auth" replace />,
      },
    ],
  },
]);

function App() {
  console.log('[App] Initializing App component');

  React.useEffect(() => {
    console.log('[App] App component mounted');
    return () => {
      console.log('[App] App component will unmount');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;