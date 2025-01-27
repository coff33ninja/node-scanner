import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import Layout from '../components/Layout';

const Users = () => {
  const navigate = useNavigate();
  const { register, login, isFirstRun } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    try {
      if (!formData.username || !formData.password || !formData.email || !formData.name) {
        setError('All fields are required');
        return;
      }

      const success = await register(formData);
      if (success) {
        setSuccess('Registration successful!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Username already exists');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        return;
      }

      const success = await login(formData.username, formData.password);
      if (success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isFirstRun ? 'Create Admin Account' : 'Login'}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {isFirstRun && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <Button
              className="w-full"
              onClick={isFirstRun ? handleRegister : handleLogin}
            >
              {isFirstRun ? 'Create Account' : 'Login'}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;