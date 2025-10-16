import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Code2, Zap, Users, Mic, LoaderCircle, LogIn, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Show a full-screen loader during the initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <LoaderCircle size={40} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  // Feature items with icons
  const features = [
    { 
      icon: <Users size={24} className="text-cyan-400" />,
      title: "Real-time Collaboration", 
      desc: "Code together seamlessly, just like using a collaborative document editor." 
    },
    { 
      icon: <Zap size={24} className="text-cyan-400" />,
      title: "AI Assistance", 
      desc: "Get instant code suggestions, explanations, and debugging help from an integrated AI." 
    },
    { 
      icon: <Mic size={24} className="text-cyan-400" />,
      title: "Voice & Chat", 
      desc: "Communicate with your team using built-in voice and text chat without leaving the editor." 
    },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#1e1e1e]/70 backdrop-blur-lg">
        <nav className="flex justify-between items-center px-6 sm:px-10 py-4 border-b border-neutral-700/80 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-cyan-400 transition-colors">
            <Code2 size={24} />
            <span>Codemate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1">
              <LogIn size={14}/>
              Login
            </Link>
            <Link to="/signup">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                <span>Sign Up</span>
                <ArrowRight size={14}/>
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32"
        >
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            Collaborate. <span className="text-cyan-400">Code.</span> Create.
          </h2>
          <p className="text-neutral-400 max-w-2xl mb-8 text-base sm:text-lg">
            A real-time collaborative coding environment with built-in AI assistance. 
            Build projects, learn, and grow with your team, all in one platform.
          </p>
          <Link to="/signup">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-3 text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform hover:scale-105">
              Get Started for Free
            </button>
          </Link>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 sm:py-32">
            <div className="text-center mb-12">
                <h3 className="text-3xl sm:text-4xl font-bold">Everything You Need to Build Together</h3>
                <p className="text-neutral-400 mt-2 max-w-xl mx-auto">From pair programming to team-wide projects, Codemate has you covered.</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 bg-[#252526] rounded-xl border border-neutral-700/80 hover:border-cyan-400/60 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-neutral-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-neutral-500 border-t border-neutral-700/80 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6">
            <div className="flex items-center gap-2">
                <Code2 size={18} />
                <span className="font-semibold">Codemate</span>
            </div>
            <p className="text-sm mt-4 sm:mt-0">&copy; 2025 Codemate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}