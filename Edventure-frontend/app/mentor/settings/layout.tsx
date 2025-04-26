"use client"

import ProtectedRoute from "@/components/protected-route"

export default function MentorSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  )
} 