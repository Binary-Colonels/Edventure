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
import { Clock, Trophy, Users, Code, BookOpen, Star } from "lucide-react"

export default function ContestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy contests data
  const contests = [
    {
      id: "java-contest",
      title: "Java Programming Challenge",
      description: "Test your Java programming skills with this coding contest. Solve algorithmic problems and compete with other participants.",
      type: "coding",
      coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
      difficultyLevel: 3,
      duration: "2 hours",
      participants: 156,
      xpReward: 500,
      startTime: "2024-03-25T10:00:00Z",
      endTime: "2024-03-25T12:00:00Z",
      status: "upcoming", // upcoming, active, ended
    },
    {
      id: "economics-quiz",
      title: "Economics Fundamentals Quiz",
      description: "Test your knowledge of basic economic concepts, market principles, and financial literacy.",
      type: "quiz",
      coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      difficultyLevel: 2,
      duration: "1 hour",
      participants: 89,
      xpReward: 300,
      startTime: "2024-03-26T15:00:00Z",
      endTime: "2024-03-26T16:00:00Z",
      status: "upcoming",
    },
    {
      id: "web-dev-hackathon",
      title: "Web Development Hackathon",
      description: "Build a full-stack web application in 24 hours. Showcase your skills and win exciting prizes!",
      type: "hackathon",
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      difficultyLevel: 4,
      duration: "24 hours",
      participants: 45,
      xpReward: 1000,
      startTime: "2024-03-28T00:00:00Z",
      endTime: "2024-03-29T00:00:00Z",
      status: "upcoming",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "ended":
        return <Badge className="bg-gray-500">Ended</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contests</h1>
              <p className="text-muted-foreground mt-1">Participate in contests to earn XP and compete with others</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contests.map((contest) => (
                <Card key={contest.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={contest.coverImage}
                      alt={contest.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{contest.title}</h2>
                        {getStatusBadge(contest.status)}
                      </div>
                      <div className="flex items-center mt-1">
                        {renderDifficultyStars(contest.difficultyLevel)}
                        <span className="ml-2 text-xs">Level {contest.difficultyLevel}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">{contest.description}</p>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{contest.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>{contest.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{contest.participants}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {contest.type === "coding" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Code className="h-3 w-3" /> Coding
                        </Badge>
                      )}
                      {contest.type === "quiz" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Quiz
                        </Badge>
                      )}
                      {contest.type === "hackathon" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Code className="h-3 w-3" /> Hackathon
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/contests/${contest.id}`} className="w-full">
                      <Button 
                        className="w-full bg-indigo-700 hover:bg-purple-900"
                        disabled={contest.status === "ended"}
                      >
                        {contest.status === "ended" ? "Contest Ended" : "Enter Contest"}
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

