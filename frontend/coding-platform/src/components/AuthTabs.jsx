import { useNavigate, useLocation } from "react-router-dom";

export default function AuthTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === "/signup" ? "signup" : "login";

  return (
    <div className="flex justify-around relative border-b border-gray-700 mb-6">
      {/* Login Tab */}
      <button
        onClick={() => navigate("/login")}
        className={`pb-2 px-6 font-medium transition-colors ${
          activeTab === "login"
            ? "text-cyan-400 border-b-2 border-cyan-400"
            : "text-gray-400 hover:text-cyan-300"
        }`}
      >
        Login
      </button>

      {/* Signup Tab */}
      <button
        onClick={() => navigate("/signup")}
        className={`pb-2 px-6 font-medium transition-colors ${
          activeTab === "signup"
            ? "text-cyan-400 border-b-2 border-cyan-400"
            : "text-gray-400 hover:text-cyan-300"
        }`}
      >
        Signup
      </button>
    </div>
  );
}
