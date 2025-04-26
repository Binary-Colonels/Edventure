"use client"

import ProtectedRoute from "@/components/protected-route"

export default function MentorProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  )
} 