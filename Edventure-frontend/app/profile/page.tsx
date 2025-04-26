import Profile from "@/components/profile/profile"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Edventure Learning Platform",
  description: "Your Edventure profile information",
}

export default function ProfilePage() {
  return <Profile />
} 