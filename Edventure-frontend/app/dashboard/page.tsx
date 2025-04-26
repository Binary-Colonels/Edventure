import Dashboard from "@/components/dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Edventure Learning Platform",
  description: "Your Edventure learning dashboard",
}

export default function DashboardPage() {
  return <Dashboard />
}

