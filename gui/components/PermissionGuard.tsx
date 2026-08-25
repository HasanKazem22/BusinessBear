"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";

interface PermissionGuardProps {
  require: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ require, fallback, children }: PermissionGuardProps) {
  const { canAccess } = useAuth();

  if (!canAccess(require)) {
    return fallback ? <>{fallback}</> : <AccessDeniedCard />;
  }

  return <>{children}</>;
}
