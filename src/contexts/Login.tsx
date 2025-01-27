import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!formData.username || !formData.password || !formData.email || !formData.name) {
        setError('All fields are required');
        return;
      }

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some((user: any) => user.username === formData.username)) {
          setError('Username already exists');
          return;
        }

        // Create new user
        const newUser = {
          id: crypto.randomUUID(),
          ...formData,
          role: users.length === 0 ? 'admin' : 'user', // First user is admin
          lastActive: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        navigate('/');
      } catch (error) {
        setError('Registration failed. Please try again.');
      }
    } else {
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        return;
      }

      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => 
          u.username === formData.username && u.password === formData.password
        );

        if (user) {
          // Update last active
          const updatedUsers = users.map((u: any) => 
            u.id === user.id ? { ...u, lastActive: new Date().toISOString() } : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          localStorage.setItem('currentUser', JSON.stringify(user));
          navigate('/');
        } else {
          setError('Invalid username or password');
        }
      } catch (error) {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isRegistering ? 'Create Account' : 'Login'}
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({ username: '', password: '', email: '', name: '' });
            }}
            className="text-primary hover:underline"
          >
            {isRegistering
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;