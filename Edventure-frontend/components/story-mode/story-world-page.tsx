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
import { ArrowLeft, BookOpen, Lock, Star, Trophy } from "lucide-react"

interface StoryWorldPageProps {
  worldId: string
}

export default function StoryWorldPage({ worldId }: StoryWorldPageProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chapters' | 'leaderboard'>('chapters')
  const [loading, setLoading] = useState(true)
  const [world, setWorld] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // Simulating API call with setTimeout
    const fetchData = () => {
      setTimeout(() => {
        // Dummy world data
        const worldData = {
          id: worldId,
          title: "The Digital Frontier",
          description:
            "Explore the world of web development through an epic journey of discovery and creation. Master HTML, CSS, and JavaScript as you build your own digital kingdom.",
          coverImage: "/placeholder.svg?height=400&width=800",
          difficultyLevel: 2,
          progress: 45,
          chapters: 8,
          completedChapters: 3,
          students: 342,
        }

        // Dummy chapters data
        const chaptersData = [
          {
            id: "1",
            title: "The HTML Foundation",
            description: "Begin your journey by learning the building blocks of the web.",
            orderNumber: 1,
            unlocked: true,
            completed: true,
            progress: 100,
            xpReward: 250,
            quests: 5,
            completedQuests: 5,
          },
          {
            id: "2",
            title: "CSS Styling Magic",
            description: "Master the art of styling your digital creations.",
            orderNumber: 2,
            unlocked: true,
            completed: true,
            progress: 100,
            xpReward: 300,
            quests: 6,
            completedQuests: 6,
          },
          {
            id: "3",
            title: "JavaScript Basics",
            description: "Learn the language that brings your web pages to life.",
            orderNumber: 3,
            unlocked: true,
            completed: true,
            progress: 100,
            xpReward: 350,
            quests: 7,
            completedQuests: 7,
          },
          {
            id: "4",
            title: "Interactive Web Elements",
            description: "Create dynamic and interactive components for your web pages.",
            orderNumber: 4,
            unlocked: true,
            completed: false,
            progress: 60,
            xpReward: 400,
            quests: 8,
            completedQuests: 5,
          },
          {
            id: "5",
            title: "Responsive Design",
            description: "Adapt your creations to work on all devices and screen sizes.",
            orderNumber: 5,
            unlocked: false,
            completed: false,
            progress: 0,
            xpReward: 450,
            quests: 9,
            completedQuests: 0,
          },
          {
            id: "6",
            title: "Web APIs and Fetch",
            description: "Connect your applications to external data sources.",
            orderNumber: 6,
            unlocked: false,
            completed: false,
            progress: 0,
            xpReward: 500,
            quests: 10,
            completedQuests: 0,
          },
          {
            id: "7",
            title: "Modern JavaScript Frameworks",
            description: "Discover powerful tools to build complex web applications.",
            orderNumber: 7,
            unlocked: false,
            completed: false,
            progress: 0,
            xpReward: 550,
            quests: 11,
            completedQuests: 0,
          },
          {
            id: "8",
            title: "Deployment and Beyond",
            description: "Share your creations with the world and continue your journey.",
            orderNumber: 8,
            unlocked: false,
            completed: false,
            progress: 0,
            xpReward: 600,
            quests: 12,
            completedQuests: 0,
          },
        ]

        setWorld(worldData)
        setChapters(chaptersData)
        setLoading(false)
      }, 500)
    }

    fetchData()
  }, [worldId])

  const renderDifficultyStars = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < level ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
        />
      ))
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
          <div className="relative h-64 md:h-80">
            <Image src={world.coverImage || "/placeholder.svg"} alt={world.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
            <div className="absolute top-0 left-0 p-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push("/story-mode")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Story Worlds
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{world.title}</h1>
              <div className="flex items-center mt-2">
                {renderDifficultyStars(world.difficultyLevel)}
                <span className="ml-2 text-sm">Level {world.difficultyLevel}</span>
              </div>
              <p className="mt-2 max-w-2xl text-white/80">{world.description}</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Your Progress</h2>
              <div className="mt-2 flex items-center">
                <div className="flex-1 mr-4">
                  <Progress value={world.progress} className="h-2" />
                </div>
                <span className="text-sm font-medium">{world.progress}% Complete</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {world.completedChapters} of {world.chapters} chapters completed
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Chapters</h2>
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <Card key={chapter.id} className={`border ${!chapter.unlocked ? "opacity-70" : ""}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center">
                              {chapter.title}
                              {!chapter.unlocked && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                              {chapter.completed && <Badge className="ml-2 bg-green-500">Completed</Badge>}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
                          </div>
                          <Badge variant="outline" className="flex items-center">
                            <Trophy className="h-3 w-3 mr-1" />
                            {chapter.xpReward} XP
                          </Badge>
                        </div>

                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>
                            {chapter.completedQuests}/{chapter.quests} Quests
                          </span>
                        </div>

                        {chapter.progress > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{chapter.progress}%</span>
                            </div>
                            <Progress value={chapter.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 md:p-6 flex items-center justify-center border-t md:border-t-0 md:border-l">
                        {chapter.unlocked ? (
                          <Link href={`/story-mode/${worldId}/chapter/${chapter.id}`}>
                            <Button className="bg-indigo-700 hover:bg-purple-900">
                              {chapter.progress > 0 && chapter.progress < 100
                                ? "Continue"
                                : chapter.completed
                                  ? "Replay"
                                  : "Start"}
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="bg-muted text-muted-foreground">
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>
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

