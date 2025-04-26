"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting to Mentor Courses | Edventure Learning Platform",
  description: "Redirecting to Mentor Courses page.",
}

export default function TeacherCoursesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mentor/courses")
  }, [router])

  return null
}

