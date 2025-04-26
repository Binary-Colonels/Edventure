"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting to Mentor Contests | Edventure Learning Platform",
  description: "Redirecting to Mentor Contests page.",
}

export default function TeacherContestsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mentor/contests")
  }, [router])

  return null
}

