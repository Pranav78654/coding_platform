import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // This effect will run when the component mounts and whenever the user or loading state changes.
  useEffect(() => {
    // We wait until the initial authentication check is complete (`loading` is false).
    if (!loading && user) {
      // If the check is done and we have a user, it means they are logged in.
      // So, we redirect them straight to their dashboard.
      navigate("/dashboard");
    }
  }, [user, loading, navigate]); // Dependencies for the effect

  // While the AuthContext is checking for a token, we can render a blank screen
  // or a spinner. This prevents a logged-in user from briefly seeing the landing page
  // before being redirected.
  if (loading) {
    return <div className="min-h-screen bg-gray-900" />;
  }

  // If the check is done and there is NO user, we render the full landing page.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-extrabold">Codemate</h1>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-cyan-400">Features</a>
          <a href="#about" className="hover:text-cyan-400">About</a>
          <Link to="/login">
            <button className="bg-cyan-500 text-black px-4 py-2 rounded-xl">Login</button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center flex-1 text-center px-6"
      >
        <h2 className="text-5xl font-bold mb-6">
          Collaborate. <span className="text-cyan-400">Code.</span> Create.
        </h2>
        <p className="text-gray-300 max-w-2xl mb-8">
          Real-time coding, AI assistance, and seamless collaboration —
          all in one platform. Build projects, learn, and grow with Codemate.
        </p>
        <div className="space-x-4">
          {/* This button now correctly links to the signup page */}
          <Link to="/signup">
            <button className="bg-cyan-500 px-6 py-3 text-lg rounded-xl shadow-lg">
              Start Coding
            </button>
          </Link>
          <button className="border border-gray-500 px-6 py-3 text-lg rounded-xl">
            Join Room
          </button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        id="features"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16"
      >
        {[
          { title: "Real-time Collaboration", desc: "Code together like Google Docs." },
          { title: "AI Assistance", desc: "Get instant suggestions & debug help." },
          { title: "Voice & Chat", desc: "Talk while you code with WebRTC." },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 border-t border-gray-700">
        © 2025 Codemate. All rights reserved.
      </footer>
    </div>
  );
}

