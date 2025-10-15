import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/auth/verify", {
          credentials: "include", // This is crucial for sending the httpOnly cookie
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setUser(null);
      } finally {
        setLoading(false); // Verification attempt is complete
      }
    };

    verifyUser();
  }, []); // Empty array ensures this runs only once on mount

  const value = { user, setUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until the initial auth check is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context access
export const useAuth = () => {
  return useContext(AuthContext);
};

