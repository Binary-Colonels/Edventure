import MentorContestsPage from "@/components/mentor/mentor-contests"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Contests | Edventure Learning Platform",
  description: "Create and manage coding challenges and competitions.",
}

export default function MentorContests() {
  return <MentorContestsPage />
}

