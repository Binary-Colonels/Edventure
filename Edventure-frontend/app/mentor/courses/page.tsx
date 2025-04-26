import MentorCoursesPage from "@/components/mentor/mentor-courses"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Courses | Edventure Learning Platform",
  description: "Manage your courses and course materials.",
}

export default function MentorCourses() {
  return <MentorCoursesPage />
}

