import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthTabs from "../components/AuthTabs";
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3333/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // This is crucial for sending cookies
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Login successful");
        
        // ** THE KEY CHANGE **
        // 1. We update the global user state with the user data from the API
        setUser(data.user); 
        
        // 2. We remove the insecure localStorage line completely
        // localStorage.setItem("token", data.token); // <-- DELETE THIS LINE

        // Redirect to the main dashboard after a successful login
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
        style={{ minHeight: "420px" }} // fixed height
      >
        <AuthTabs />

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded bg-gray-700 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
