"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Star, Trophy, Users, Code } from "lucide-react"

export default function StoryModePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy story worlds data
  const storyWorlds = [
    {
      id: "1",
      title: "The Digital Frontier",
      description: "Explore the world of web development through an epic journey of discovery and creation.",
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      difficultyLevel: 2,
      progress: 45,
      chapters: 8,
      completedChapters: 3,
      xpEarned: 1250,
      students: 342,
    },
    {
      id: "2",
      title: "Design Odyssey",
      description: "Embark on a creative adventure to master UI/UX design principles and techniques.",
      coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      difficultyLevel: 3,
      progress: 20,
      chapters: 10,
      completedChapters: 2,
      xpEarned: 850,
      students: 278,
    },
    {
      id: "3",
      title: "Mobile Legends",
      description: "Journey through the realm of mobile app development and create powerful applications.",
      coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      difficultyLevel: 4,
      progress: 0,
      chapters: 12,
      completedChapters: 0,
      xpEarned: 0,
      students: 156,
    },
    {
      id: "4",
      title: "Data Wizardry",
      description: "Master the arcane arts of data visualization and analysis in this magical adventure.",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      difficultyLevel: 3,
      progress: 0,
      chapters: 9,
      completedChapters: 0,
      xpEarned: 0,
      students: 203,
    },
  ]

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Story Mode</h1>
              <p className="text-muted-foreground mt-1">Immersive learning adventures</p>
            </div>

            {/* Featured SQL Adventure */}
            <Card className="overflow-hidden mb-8 border-2 border-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="relative h-48 md:h-full md:col-span-1">
                  <Image
                    src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"
                    alt="SQL Jungle Adventure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-blue-800">SQL Jungle Adventure</h2>
                    <Badge className="bg-blue-600">New</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    You're trapped in the SQL Jungle! Master SQL concepts to defeat database monsters and escape. 
                    Learn everything from table creation to complex joins in this exciting interactive adventure.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Code className="h-3 w-3" /> 13 SQL Concepts
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Star className="h-3 w-3" /> Interactive Gameplay
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Trophy className="h-3 w-3" /> 650 XP Reward
                    </Badge>
                  </div>
                  
                  <Link href="/story-mode/sql-adventure">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Start Adventure
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Continue Your Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storyWorlds.map((world) => (
                <Card key={world.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={world.coverImage || "/placeholder.svg"}
                      alt={world.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h2 className="text-xl font-bold">{world.title}</h2>
                      <div className="flex items-center mt-1">
                        {renderDifficultyStars(world.difficultyLevel)}
                        <span className="ml-2 text-xs">Level {world.difficultyLevel}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">{world.description}</p>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {world.completedChapters}/{world.chapters} Chapters
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{world.students}</span>
                      </div>
                    </div>

                    {world.progress > 0 && (
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{world.progress}%</span>
                        </div>
                        <Progress value={world.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/story-mode/${world.id}`} className="w-full">
                      <Button className="w-full bg-indigo-700 hover:bg-purple-900">
                        {world.progress > 0 ? "Continue" : "Start"} Adventure
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

