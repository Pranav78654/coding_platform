import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import AuthTabs from "../components/AuthTabs";
import { Mail, Lock, LoaderCircle, AlertCircle, CheckCircle2, Code2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3333/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Login successful! Redirecting...");
        setUser(data.user); 
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("A server error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e1e] text-white font-sans p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-neutral-400 hover:text-white transition-colors">
          <Code2 size={22} />
          <span>Codemate</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#252526] border border-neutral-700/80 p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <AuthTabs />

        <form onSubmit={handleSubmit} className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Welcome Back
          </h2>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2 border border-red-500/20"
              >
                <AlertCircle size={16}/>
                {error}
              </motion.p>
            )}
            {success && (
               <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2 border border-green-500/20"
               >
                 <CheckCircle2 size={16}/>
                 {success}
               </motion.p>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"/>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  required
                />
            </div>

            <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"/>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2.5 rounded-lg transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <LoaderCircle size={20} className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}