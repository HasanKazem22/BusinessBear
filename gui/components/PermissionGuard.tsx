"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

interface PermissionGuardProps {
  require: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ require, fallback = null, children }: PermissionGuardProps) {
  const { canAccess } = useAuth();

  if (!canAccess(require)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
