import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext.jsx"; // 1. Import the SocketProvider

// Layouts
import DashboardLayout from "./pages/DashboardLayout.jsx";

// Page & Component Imports
import LandingPage from "./pages/landingPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import SignupPage from "./pages/signupPage.jsx";
import WorkspaceList from "./components/WorkspaceList";
import WorkspacePage from "./pages/WorkspacePage.jsx";

/**
 * A special component to protect routes that require authentication.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading session...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 2. Wrap your Routes with SocketProvider, inside AuthProvider */}
        <SocketProvider>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* --- PROTECTED ROUTES --- */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<WorkspaceList />} />
              <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
            </Route>
            
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;