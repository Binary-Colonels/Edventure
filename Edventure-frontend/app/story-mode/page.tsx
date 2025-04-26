import StoryModePage from "@/components/story-mode/story-mode-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Story Mode | Edventure Learning Platform",
  description: "Immersive story-based learning experience",
}

export default function StoryMode() {
  return <StoryModePage />
}

