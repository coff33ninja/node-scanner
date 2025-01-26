import Layout from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Users = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in with:", { username, password });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">Please enter your credentials</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </Layout>
  );
};

export default Users;