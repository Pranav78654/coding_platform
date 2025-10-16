import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === "/signup" ? "signup" : "login";

  return (
    <div className="flex justify-around items-center border-b border-neutral-700/80 mb-6">
      <Tab
        text="Login"
        selected={activeTab === "login"}
        setSelected={() => navigate("/login")}
      />
      <Tab
        text="Sign Up"
        selected={activeTab === "signup"}
        setSelected={() => navigate("/signup")}
      />
    </div>
  );
}

const Tab = ({ text, selected, setSelected }) => {
  return (
    <button
      onClick={setSelected}
      className={`relative w-full py-2.5 text-sm font-medium transition-colors ${
        selected ? "text-white" : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.div
          layoutId="auth-tab-slider"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute inset-0 bg-cyan-500/10 rounded-t-md border-b-2 border-cyan-500"
        />
      )}
    </button>
  );
};