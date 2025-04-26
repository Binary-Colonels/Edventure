"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting to Mentor Dashboard | Edventure Learning Platform",
  description: "Redirecting to Mentor Dashboard page.",
}

export default function TeacherDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mentor/dashboard")
  }, [router])

  return null
}

