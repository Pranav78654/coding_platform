import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import the provider
import LandingPage from "./pages/landingPage.jsx";
import Login from "./pages/loginPage.jsx";
import Signup from "./pages/signupPage.jsx";

function App() {
  return (
    // Wrap the entire set of routes with AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

