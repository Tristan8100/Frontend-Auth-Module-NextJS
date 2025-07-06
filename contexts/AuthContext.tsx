"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from '@/lib/api'; // Your existing Axios instance
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
    console.log("Checking user authenticationnnnn...");
    const token = localStorage.getItem("token");
    if (!token) {
      setIsReady(true);
      return;
    }

    const verifyUser = async () => {
    try {
      const res = await api.get('/api/verify-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user_info); // Axios puts response JSON under .data
    } catch (error) {
      console.error("Error verifying user:", error);
      console.log(token);
      expiredToken(error);
      setUser(null);
    } finally {
      setIsReady(true);
    }
  };

    verifyUser();
  }, []);

  const expiredToken = (error: any) => {
    if (error.response?.status === 401) {
        console.warn("Token invalid or expired, logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login"; // or use router.push if you're in a component
      }
  }

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
    console.log(token);
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