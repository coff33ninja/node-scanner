import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Users from "./pages/Users";
import { useAuth } from "./contexts/auth/AuthContext";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/account" replace />;
  }
  return <>{children}</>;
};

// Initialize QueryClient outside of component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Routes>
                <Route path="/account" element={<Account />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/account" replace />} />
              </Routes>
            </AuthProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;