"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for token and verify user on initial load
    const token = localStorage.getItem("token");
    if (!token) {
      setIsReady(true);
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await fetch("/api/verify-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const userData = await res.json();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsReady(true);
      }
    };

    verifyUser();
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isReady) return null; // Prevent rendering until ready

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};