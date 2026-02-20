import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage.jsx";
import Login from "./pages/loginPage.jsx";
import Signup from "./pages/signupPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
