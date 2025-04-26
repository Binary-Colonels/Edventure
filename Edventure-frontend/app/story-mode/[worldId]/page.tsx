import StoryWorldPage from "@/components/story-mode/story-world-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Story World | Edventure Learning Platform",
  description: "Explore a story world",
}

export default function WorldPage({ params }: { params: { worldId: string } }) {
  return <StoryWorldPage worldId={params.worldId} />
}

