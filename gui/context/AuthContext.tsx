"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "../lib/utils/cookies";
import { parseJwt } from "../lib/utils/jwt";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";

export interface User {
  id?: number;
  username: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  city?: string;
  address?: string;
  avatarUrl?: string;
  avatar?: string;
  roles: string[];
  exp?: number;
}

export interface AuthResponsePayload {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
  rolePermission: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  rolePermission: Record<string, any> | null;
  isAuthenticated: boolean;
  roles: string[];
  login: (authResponse: AuthResponsePayload | string) => void;
  logout: () => void;
  canAccess: (path: string) => boolean;
  hasPermission: (permission: string) => boolean;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateRolePermissions: (newPermissions: Record<string, any>) => void;
  updateUser: (partialUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [rolePermission, setRolePermission] = useState<Record<string, any> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("auth_token") || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
    const savedPerms = typeof window !== "undefined" ? localStorage.getItem("role_permission") : null;
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("user_info") : null;

    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            setUser({
              username: decoded.sub,
              roles: decoded.authorities ? decoded.authorities : [],
              exp: decoded.exp,
            });
          }
        } else {
          setUser({
            username: decoded.sub,
            roles: decoded.authorities ? decoded.authorities : [],
            exp: decoded.exp,
          });
        }

        if (savedPerms) {
          try {
            setRolePermission(JSON.parse(savedPerms));
          } catch (e) {
            console.error("Failed to parse stored role_permission JSON", e);
          }
        }
      } else {
        logout();
      }
    } else {
      // Guest mode
      apiFetch("/auth/guest-permissions")
        .then(data => {
          setRolePermission(data);
        })
        .catch(err => {
          console.error("Failed to load guest permissions", err);
        });
    }
  }, []);

  const login = (payload: AuthResponsePayload | any) => {
    const token = typeof payload === "string" ? payload : payload?.accessToken || payload?.token;
    const refreshToken = typeof payload === "object" ? payload?.refreshToken : null;
    if (token) {
      setCookie("auth_token", token);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
      }
    }

    const userData = typeof payload === "object" ? (payload.user || {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      roles: payload.roles || (payload.username ? ["ADMIN"] : []),
    }) : null;

    if (userData) {
      setUser(userData);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_info", JSON.stringify(userData));
      }
    }

    const perms = typeof payload === "object" ? payload.rolePermission : null;
    if (perms) {
      setRolePermission(perms);
      if (typeof window !== "undefined") {
        localStorage.setItem("role_permission", JSON.stringify(perms));
      }
    }

    router.push("/");
  };

  const logout = () => {
    deleteCookie("auth_token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("role_permission");
    }
    setUser(null);
    setRolePermission(null);
    router.push("/login");
  };

  const updateRolePermissions = (newPermissions: Record<string, any>) => {
    setRolePermission(newPermissions);
    if (typeof window !== "undefined") {
      localStorage.setItem("role_permission", JSON.stringify(newPermissions));
    }
  };

  /**
   * Safely checks nested boolean path in rolePermission tree using dot notation.
   * Example: canAccess("home.sections.hero.isCreate") -> true / false
   */
  const canAccess = (path: string): boolean => {
    if (!rolePermission) return false;
    const value: any = path
      .split(".")
      .reduce((acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : null), rolePermission);
    return value === true;
  };

  const roles = user?.roles || [];

  const hasRole = (role: string) => {
    return roles.includes(role);
  };

  const can = (permission: string) => {
    if (hasRole("ADMIN")) return true;
    return canAccess(permission);
  };

  const hasPermission = (permission: string) => can(permission);

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialUser };
      if (typeof window !== "undefined") {
        localStorage.setItem("user_info", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        rolePermission,
        isAuthenticated: !!user,
        roles,
        login,
        logout,
        canAccess,
        hasPermission,
        can,
        hasRole,
        updateRolePermissions,
        updateUser,
      }}
    >
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
