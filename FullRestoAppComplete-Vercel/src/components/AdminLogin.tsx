import { useState } from "react";

export function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      alert("Login gagal. Username atau password salah.");
    }
  };

  return (
    <div className="mb-6 p-4 border rounded bg-white shadow max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Login Admin</h3>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
        className="block w-full mb-2 p-2 border rounded" />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-2 p-2 border rounded" />
      <button onClick={handleLogin} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
        Login
      </button>
    </div>
  );
}
