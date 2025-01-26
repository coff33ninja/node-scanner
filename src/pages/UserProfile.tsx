import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    // Check if it's the first run
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsFirstRun(false);
    }
  }, []);

  const handleRegister = () => {
    const user = { username, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('User registered successfully!');
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.username === username && storedUser.password === password) {
      alert('Login successful!');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1>{isFirstRun ? 'Create Account' : 'Login'}</h1>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isFirstRun ? (
          <Button onClick={handleRegister}>Register</Button>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;