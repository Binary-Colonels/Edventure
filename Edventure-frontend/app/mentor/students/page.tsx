import MentorStudentsPage from "@/components/mentor/mentor-students"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Students | Edventure Learning Platform",
  description: "View and manage your student roster.",
}

export default function MentorStudents() {
  return <MentorStudentsPage />
}

