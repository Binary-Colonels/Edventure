import MentorDashboard from "@/components/mentor/mentor-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Dashboard | Edventure Learning Platform",
  description: "View your mentor dashboard with student statistics, courses, and more.",
}

export default function MentorDashboardPage() {
  return <MentorDashboard />
}

