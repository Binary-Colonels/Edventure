import QuestPage from "@/components/story-mode/quest-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quest | Edventure Learning Platform",
  description: "Complete a story quest",
}

export default function StoryQuestPage({
  params,
}: {
  params: { worldId: string; chapterId: string; questId: string }
}) {
  return <QuestPage worldId={params.worldId} chapterId={params.chapterId} questId={params.questId} />
}

