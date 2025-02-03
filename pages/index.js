"use client";

import { useState } from "react";
import axios from "axios";
import Tindakan from "./tindakan";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveToLocalStorage = (key, value) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + 3 * 60 * 60 * 1000, // 3 hours in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://202.58.199.194:8080/api-appit/public/wig/login", {
        username,
        password,
      });

      let data = response.data.user;
      saveToLocalStorage("id", data.id);
      saveToLocalStorage("username", data.username);
      saveToLocalStorage("nama_divisi", data.nama_divisi);
      saveToLocalStorage("divisi", data.divisi);

      setIsLoggedIn(true);
      console.log(response.data);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  if (isLoggedIn) {
    return <Tindakan />;
  }

  return (
    <div className={`flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-4`}>
      <form onSubmit={handleLogin} className="w-full max-w-sm p-5 border border-gray-300 rounded-lg bg-white shadow-md">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full p-3 bg-gray-800 text-white rounded">Login</button>
      </form>
    </div>
  );
}