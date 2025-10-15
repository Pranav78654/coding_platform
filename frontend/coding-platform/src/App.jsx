import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import DashboardLayout from "./pages/DashboardLayout.jsx";

// Page & Component Imports
import LandingPage from "./pages/landingPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import SignupPage from "./pages/signupPage.jsx";
import WorkspaceList from "./components/WorkspaceList";
import WorkspacePage from "./pages/WorkspacePage.jsx"; // Make sure this is imported

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
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- PROTECTED ROUTES --- */}
          {/* Create a general protected layout route */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* All routes nested here will share the same layout and protection */}
            <Route path="/dashboard" element={<WorkspaceList />} />
            {/* You can add more protected routes here later, like: */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;