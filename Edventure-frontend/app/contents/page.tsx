import ContestsPage from "@/components/contests/contests-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contests | Edventure Learning Platform",
  description: "Participate in coding challenges and competitions",
}

export default function Contests() {
  return <ContestsPage />
}

