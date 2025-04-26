"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresAuth?: boolean
  allowedRoles?: string[]
}

export default function ProtectedRoute({ 
  children, 
  requiresAuth = true,
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, isMentor } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // If authentication is required but user is not authenticated
      if (requiresAuth && !isAuthenticated) {
        router.push("/login")
      }
      
      // If role-based access control is needed
      if (
        requiresAuth &&
        isAuthenticated &&
        allowedRoles.length > 0 &&
        user &&
        !allowedRoles.includes(user.role) &&
        // Also check for mentor
        !(allowedRoles.includes("admin") && isMentor)
      ) {
        // Redirect based on role
        if (isMentor) {
          router.push("/mentor/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [isAuthenticated, isLoading, requiresAuth, allowedRoles, user, router, isMentor])

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // If authentication is required but user is not authenticated, show nothing (will redirect)
  if (requiresAuth && !isAuthenticated) {
    return null
  }

  // If role-based access control is needed and user doesn't have permission, show nothing (will redirect)
  if (
    requiresAuth &&
    isAuthenticated &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role) &&
    // Also check for mentor
    !(allowedRoles.includes("admin") && isMentor)
  ) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
} 