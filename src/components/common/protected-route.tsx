import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { planAccessMap } from "../../services/accessMap";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
  skipPlanCheck?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, skipPlanCheck = false }: Props) {
  const { isAuthenticated, role, plan } = useAuth();
  const location = useLocation();
  const normalizedRole = role?.toLowerCase();
  const currentPath = location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole || "")
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (normalizedRole === "superadmin") {
    return <>{children}</>;
  }

  if (!skipPlanCheck && isAccessDenied(plan, currentPath)) {
    return <Navigate to="/no-access" replace />;
  }

  return <>{children}</>;
}

// ✅ Moved isAccessDenied from NoAccessModal here
function isAccessDenied(plan: string, path: string): boolean {
  const accessRule = planAccessMap[plan];
  if (!accessRule) return true;

  const matchPath = (pattern: string, path: string): boolean => {
    if (pattern.endsWith("/*")) {
      const base = pattern.replace("/*", "");
      return path.startsWith(base);
    }
    return pattern === path;
  };

  if (Array.isArray(accessRule)) {
    return !accessRule.some((allowedPath) => matchPath(allowedPath, path));
  }

  if (accessRule.allow.includes("*")) {
    if (accessRule.deny) {
      return accessRule.deny.some((deniedPath) => matchPath(deniedPath, path));
    }
    return false;
  }

  return !accessRule.allow.some((allowedPath) => matchPath(allowedPath, path));
}
