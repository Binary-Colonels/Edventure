import StoryChapterPage from "@/components/story-mode/story-chapter-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Story Chapter | Edventure Learning Platform",
  description: "Explore a story chapter",
}

export default function Page({
  params,
}: {
  params: { worldId: string; chapterId: string }
}) {
  return <StoryChapterPage worldId={params.worldId} chapterId={params.chapterId} />
}

