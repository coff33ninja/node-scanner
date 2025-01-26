import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
  });
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if any users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length > 0) {
      setIsFirstRun(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = () => {
    try {
      if (!formData.username || !formData.password || !formData.email || !formData.name) {
        setError('All fields are required');
        return;
      }

      const users: UserData[] = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some(u => u.username === formData.username)) {
        setError('Username already exists');
        return;
      }

      const newUser: UserData = {
        id: crypto.randomUUID(),
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        role: users.length === 0 ? 'admin' : 'user', // First user is admin
        lastActive: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    try {
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        return;
      }

      const users: UserData[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === formData.username);

      if (!user || user.password !== formData.password) {
        setError('Invalid username or password');
        return;
      }

      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, lastActive: new Date().toISOString() };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify(user));

      setSuccess('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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

export default UserProfile;