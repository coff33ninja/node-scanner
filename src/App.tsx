import * as React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Account from "./pages/Account";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { queryClient } from "./lib/utils";

const router = createBrowserRouter([
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/account" replace />,
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <AuthWrapper>
              <RouterProvider router={router} />
            </AuthWrapper>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;