"use client"

import { useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Target, TrendingUp, Medal, Star, Calendar, Award, Search } from "lucide-react"

// Dummy data for analytics
const analyticsData = {
  totalStudents: 1250,
  totalXP: 25000,
  averageScore: 85,
  topPerformers: [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      xp: 2500,
      contests: 12,
      rank: 1,
      streak: 15,
      achievements: ["Perfect Score", "Speed Demon", "Consistency King"],
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      xp: 2350,
      contests: 11,
      rank: 2,
      streak: 12,
      achievements: ["Perfect Score", "Speed Demon"],
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      xp: 2200,
      contests: 10,
      rank: 3,
      streak: 8,
      achievements: ["Perfect Score"],
    },
  ],
  recentAchievements: [
    {
      id: 1,
      student: "Alex Johnson",
      achievement: "Perfect Score",
      date: "2024-03-15",
    },
    {
      id: 2,
      student: "Sarah Chen",
      achievement: "Speed Demon",
      date: "2024-03-14",
    },
    {
      id: 3,
      student: "Michael Brown",
      achievement: "Perfect Score",
      date: "2024-03-13",
    },
  ],
}

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <h3 className="text-2xl font-bold">{analyticsData.totalStudents}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                      <h3 className="text-2xl font-bold">{analyticsData.totalXP}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Star className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <h3 className="text-2xl font-bold">{analyticsData.averageScore}%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {/* Top Performers */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPerformers.map((student, index) => (
                        <div key={student.id} className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                              {index + 1}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                <Star className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <Image
                              src={student.avatar}
                              alt={student.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{student.xp} XP</span>
                              <span>•</span>
                              <span>{student.streak} day streak</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {student.achievements.slice(0, 2).map((achievement, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                            {student.achievements.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.achievements.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Global Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPerformers.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                              {student.rank}
                            </div>
                            <div className="relative">
                              <Image
                                src={student.avatar}
                                alt={student.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{student.xp} XP</span>
                                <span>•</span>
                                <span>{student.contests} contests</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.achievements.map((achievement, index) => (
                              <Badge key={index} variant="secondary">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.recentAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <Trophy className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.student}</h4>
                              <p className="text-sm text-muted-foreground">
                                Earned {achievement.achievement}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{achievement.date}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
} 