// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import type { User } from "../services/authService";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (u: User | null) => void;
  isAuthenticated: boolean;
  login: (userData: User, token: string, role?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          const profile = await getProfile();
          if (profile) {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        }
      } catch (err) {
        setError("Failed to fetch profile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = (userData: User, token: string, role?: string) => {
    localStorage.setItem("token", token);
    if (role) {
      localStorage.setItem("userRole", role);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // triggers Navbar update instantly
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    setUser(null);
  };
  

  const isAuthenticated = !!user;


  return (
    <AuthContext.Provider
      value={{ user, loading, error, setUser, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};