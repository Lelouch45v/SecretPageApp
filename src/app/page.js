"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import supabase from "./utils/supabaseClient";
import Link from "next/link"; 

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false); 
  const router = useRouter(); 

  // Check user session
  const checkUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("Error getting user:", error.message);
    } else {
      setUser(data);
    }
  };

  // Handle login
  const handleLogin = async () => {
    setLoading(true); // Set loading to true when login starts
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(user);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };

  // Handle registration
  const handleRegister = async () => {
    setLoading(true); 
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setUser(user);
      localStorage.setItem("registeredEmail", email);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); 
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  
  useEffect(() => {
    checkUser();
    const storedEmail = localStorage.getItem("registeredEmail");
    if (storedEmail) {
      setEmail(storedEmail); 
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <p className="text-xl font-semibold mb-4 text-black">
              Welcome, {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-md mb-4 hover:bg-red-600"
            >
              Logout
            </button>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/secret-page-1" className="text-blue-500 hover:underline">
                    Secret Page 1
                  </Link>
                </li>
                <li>
                  <Link href="/secret-page-2" className="text-blue-500 hover:underline">
                    Secret Page 2
                  </Link>
                </li>
                <li>
                  <Link href="/secret-page-3" className="text-blue-500 hover:underline">
                    Secret Page 3
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-black">
              {isRegistering ? "Register" : "Login"}
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button
                onClick={isRegistering ? handleRegister : handleLogin}
                className="w-full bg-blue-500 text-white p-2 rounded-md mb-4 hover:bg-blue-600"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-500 hover:underline"
              >
                {isRegistering ? "Login" : "Register"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
