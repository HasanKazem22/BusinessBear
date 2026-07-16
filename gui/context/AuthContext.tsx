"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "../lib/utils/cookies";
import { parseJwt } from "../lib/utils/jwt";
import { useRouter } from "next/navigation";

export interface User {
  username: string;
  authorities: string[];
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from cookie on mount
    const token = getCookie("auth_token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          username: decoded.sub,
          authorities: decoded.authorities || [],
          exp: decoded.exp,
        });
      } else {
        // Token expired
        deleteCookie("auth_token");
      }
    }
  }, []);

  const login = (token: string) => {
    setCookie("auth_token", token);
    const decoded = parseJwt(token);
    if (decoded) {
      setUser({
        username: decoded.sub,
        authorities: decoded.authorities || [],
        exp: decoded.exp,
      });
      
      // Basic redirect logic based on admin authority
      if (decoded.authorities?.includes("ROLE_ADMIN")) {
        router.push("/admin/home");
      } else {
        router.push("/");
      }
    }
  };

  const logout = () => {
    deleteCookie("auth_token");
    setUser(null);
    router.push("/login");
  };

  const hasPermission = (permission: string) => {
    return user?.authorities?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
