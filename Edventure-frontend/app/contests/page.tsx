import ContestsPage from "@/components/contests/contests-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contests | Edventure Learning Platform",
  description: "Participate in coding contests and quizzes to earn XP",
}

export default function Contests() {
  return <ContestsPage />
} 