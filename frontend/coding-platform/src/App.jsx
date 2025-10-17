import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext.jsx";
import { AlertProvider, useAlert } from "./context/AlertContext.jsx";
import { PromptProvider, usePrompt } from "./context/PromptContext.jsx";
import { ConfirmProvider, useConfirm } from "./context/ConfirmContext.jsx"; // 1. Import Confirm context

import AlertModal from "./components/AlertModal.jsx";
import PromptModal from "./components/PromptModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx"; // 2. Import Confirm modal

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

/**
 * A small helper component to render the global alert modal.
 */
function GlobalAlert() {
  const { isOpen, title, message, hideAlert } = useAlert();
  return <AlertModal isOpen={isOpen} onClose={hideAlert} title={title} message={message} />;
}

/**
 * A small helper component to render the global prompt modal.
 */
function GlobalPrompt() {
    const { isOpen, title, label, onSubmit, hidePrompt } = usePrompt();
    return <PromptModal isOpen={isOpen} onClose={hidePrompt} onSubmit={onSubmit} title={title} label={label} />;
}

/**
 * 3. A small helper component to render the global confirm modal.
 */
function GlobalConfirm() {
    const { isOpen, title, message, onConfirm, hideConfirm } = useConfirm();
    return <ConfirmModal isOpen={isOpen} onClose={hideConfirm} onConfirm={onConfirm} title={title} message={message} />;
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AlertProvider>
            <PromptProvider>
              <ConfirmProvider> {/* 4. Wrap your application with the ConfirmProvider */}
                <GlobalAlert />
                <GlobalPrompt />
                <GlobalConfirm /> {/* 5. Render the global modal */}
                
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
              </ConfirmProvider>
            </PromptProvider>
          </AlertProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

