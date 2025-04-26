import { Metadata } from "next"
import SQLGamePage from "@/components/story-mode/sql-game/SQLGamePage"

export const metadata: Metadata = {
  title: "SQL Jungle Adventure | Edventure Learning Platform",
  description: "Learn SQL concepts by escaping a jungle through interactive gameplay",
}

export default function SQLAdventurePage() {
  return <SQLGamePage />
} 