"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Circle, Lock, Trophy } from "lucide-react"

interface StoryChapterPageProps {
  worldId: string
  chapterId: string
}

export default function StoryChapterPage({ worldId, chapterId }: StoryChapterPageProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [chapter, setChapter] = useState<any>(null)
  const [quests, setQuests] = useState<any[]>([])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // Simulating API call with setTimeout
    const fetchData = () => {
      setTimeout(() => {
        // Dummy chapter data
        const chapterData = {
          id: chapterId,
          worldId: worldId,
          title: "Interactive Web Elements",
          description:
            "Create dynamic and interactive components for your web pages. Learn how to handle user input, create animations, and build responsive interfaces.",
          orderNumber: 4,
          unlocked: true,
          completed: false,
          progress: 60,
          quests: 8,
          completedQuests: 5,
          coverImage: "/placeholder.svg?height=400&width=800",
        }

        // Dummy quests data
        const questsData = [
          {
            id: "1",
            title: "The DOM Explorer",
            description: "Learn about the Document Object Model and how to manipulate it.",
            type: "lesson",
            completed: true,
            orderNumber: 1,
            unlocked: true,
          },
          {
            id: "2",
            title: "Event Listeners",
            description: "Discover how to respond to user interactions on your web page.",
            type: "lesson",
            completed: true,
            orderNumber: 2,
            unlocked: true,
          },
          {
            id: "3",
            title: "Form Validation Challenge",
            description: "Apply your knowledge to create a form with client-side validation.",
            type: "challenge",
            completed: true,
            orderNumber: 3,
            unlocked: true,
          },
          {
            id: "4",
            title: "Creating Dynamic Content",
            description: "Learn to generate HTML content dynamically using JavaScript.",
            type: "lesson",
            completed: true,
            orderNumber: 4,
            unlocked: true,
          },
          {
            id: "5",
            title: "Interactive Gallery",
            description: "Build an interactive image gallery with filtering and sorting.",
            type: "project",
            completed: true,
            orderNumber: 5,
            unlocked: true,
          },
          {
            id: "6",
            title: "CSS Animations",
            description: "Add life to your web pages with CSS animations and transitions.",
            type: "lesson",
            completed: false,
            orderNumber: 6,
            unlocked: true,
          },
          {
            id: "7",
            title: "Interactive Quiz Builder",
            description: "Create a dynamic quiz application with scoring and feedback.",
            type: "project",
            completed: false,
            orderNumber: 7,
            unlocked: false,
          },
          {
            id: "8",
            title: "Chapter Assessment",
            description: "Test your knowledge of interactive web elements.",
            type: "assessment",
            completed: false,
            orderNumber: 8,
            unlocked: false,
          },
        ]

        setChapter(chapterData)
        setQuests(questsData)
        setLoading(false)
      }, 500)
    }

    fetchData()
  }, [worldId, chapterId])

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-800"
      case "challenge":
        return "bg-purple-100 text-purple-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "assessment":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />

          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="relative h-48 md:h-64">
            <Image src={chapter.coverImage || "/placeholder.svg"} alt={chapter.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
            <div className="absolute top-0 left-0 p-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push(`/story-mode/${worldId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chapter List
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-2xl font-bold">{chapter.title}</h1>
              <p className="mt-1 max-w-2xl text-white/80">{chapter.description}</p>
              <div className="mt-2 flex items-center">
                <Badge className="bg-indigo-700">{chapter.progress}%</Badge>
                <div className="ml-4 flex items-center text-sm">
                  <span>
                    {chapter.completedQuests}/{chapter.quests} Quests
                  </span>
                  <div className="ml-4 flex-1 w-32">
                    <Progress value={chapter.progress} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Quests</h2>
            <div className="space-y-4">
              {quests.map((quest) => (
                <Card key={quest.id} className={`border ${!quest.unlocked ? "opacity-70" : ""}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {quest.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : quest.unlocked ? (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}

                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{quest.title}</h3>
                          <Badge className={`ml-2 ${getQuestTypeColor(quest.type)}`}>{quest.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {quest.unlocked ? (
                        <Link href={`/story-mode/${worldId}/chapter/${chapterId}/quest/${quest.id}`}>
                          <Button className="bg-indigo-700 hover:bg-purple-900">
                            {quest.completed ? "Replay" : "Start"}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="bg-muted text-muted-foreground">
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

