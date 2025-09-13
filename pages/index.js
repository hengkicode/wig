"use client";

import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { useRouter } from "next/router";
import { apiService } from "../utils/apiService";
import { saveUserData, isAuthenticated, clearLocalStorage } from "../utils/localStorage";
import { LoadingButton } from "../components/Loading";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Username dan password tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login({
        username: username.trim(),
        password: password.trim(),
      });

      const userData = response.data.user;
      
      // Save user data to localStorage
      const saved = saveUserData(userData);
      if (!saved) {
        throw new Error("Failed to save user data");
      }

      setIsLoggedIn(true);
      setError("");

      // Redirect to dashboard
      router.push("/dashboard");

      console.log("Login successful:", response.data);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    // Show loading while redirecting
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-4">
        <div className="text-lg font-semibold flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span>Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-5 border border-gray-300 rounded-lg bg-white shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">WIG Dashboard</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-gray-700 font-medium">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <LoadingButton
          type="submit"
          loading={isLoading}
          className="w-full p-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition duration-200 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Login"}
        </LoadingButton>
      </form>
    </div>
  );
}
