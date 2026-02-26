"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  dob?: string;
  phone_number?: string;

}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

//load user khi app khởi động, check token có hợp lệ không, nếu có thì load thông tin user vào context
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

//login
  const login = async (token: string) => {
    localStorage.setItem("access_token", token);

    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem("access_token");
      setUser(null);
      throw error;
    }
  };

//logout
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};