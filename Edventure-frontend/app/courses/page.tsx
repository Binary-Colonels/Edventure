import CoursesPage from "@/components/courses/courses-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Courses | Edventure Learning Platform",
  description: "View and manage your courses",
}

export default function Courses() {
  return <CoursesPage />
}

