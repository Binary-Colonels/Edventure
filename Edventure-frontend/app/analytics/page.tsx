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
  activeContests: 8,
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
  contestStats: [
    {
      id: 1,
      name: "Java Coding Contest",
      participants: 450,
      averageScore: 82,
      completionRate: 75,
      topScore: 100,
    },
    {
      id: 2,
      name: "Economics Quiz",
      participants: 380,
      averageScore: 88,
      completionRate: 85,
      topScore: 100,
    },
    {
      id: 3,
      name: "Web Dev Hackathon",
      participants: 280,
      averageScore: 78,
      completionRate: 65,
      topScore: 95,
    },
  ],
  recentAchievements: [
    {
      id: 1,
      student: "Alex Johnson",
      achievement: "Perfect Score",
      contest: "Java Coding Contest",
      date: "2024-03-15",
    },
    {
      id: 2,
      student: "Sarah Chen",
      achievement: "Speed Demon",
      contest: "Economics Quiz",
      date: "2024-03-14",
    },
    {
      id: 3,
      student: "Michael Brown",
      achievement: "Perfect Score",
      contest: "Web Dev Hackathon",
      date: "2024-03-13",
    },
  ],
  contestLeaderboards: {
    "Java Coding Contest": [
      {
        id: 1,
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        score: 100,
        timeTaken: "45:30",
        rank: 1,
        submissionCount: 3,
      },
      {
        id: 2,
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        score: 95,
        timeTaken: "52:15",
        rank: 2,
        submissionCount: 4,
      },
      {
        id: 3,
        name: "Michael Brown",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        score: 90,
        timeTaken: "58:45",
        rank: 3,
        submissionCount: 5,
      },
    ],
    "Economics Quiz": [
      {
        id: 1,
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        score: 100,
        timeTaken: "12:30",
        rank: 1,
        submissionCount: 1,
      },
      {
        id: 2,
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        score: 95,
        timeTaken: "15:45",
        rank: 2,
        submissionCount: 1,
      },
      {
        id: 3,
        name: "Michael Brown",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        score: 90,
        timeTaken: "18:20",
        rank: 3,
        submissionCount: 1,
      },
    ],
    "Web Dev Hackathon": [
      {
        id: 1,
        name: "Michael Brown",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        score: 95,
        timeTaken: "6:30:00",
        rank: 1,
        submissionCount: 2,
      },
      {
        id: 2,
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        score: 90,
        timeTaken: "7:15:00",
        rank: 2,
        submissionCount: 3,
      },
      {
        id: 3,
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        score: 85,
        timeTaken: "7:45:00",
        rank: 3,
        submissionCount: 4,
      },
    ],
  },
}

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedContest, setSelectedContest] = useState("Java Coding Contest")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredLeaderboard = analyticsData.contestLeaderboards[selectedContest].filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    <div className="p-3 bg-green-100 rounded-full">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Contests</p>
                      <h3 className="text-2xl font-bold">{analyticsData.activeContests}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Trophy className="h-6 w-6 text-purple-900" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP Earned</p>
                      <h3 className="text-2xl font-bold">{analyticsData.totalXP}</h3>
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
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <h3 className="text-2xl font-bold">{analyticsData.averageScore}%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leaderboard">Global Leaderboard</TabsTrigger>
                <TabsTrigger value="contest-leaderboard">Contest Leaderboard</TabsTrigger>
                <TabsTrigger value="contests">Contest Stats</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-yellow-500" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPerformers.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Image
                                src={student.avatar}
                                alt={student.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              {student.rank <= 3 && (
                                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                  <Star className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{student.xp} XP</span>
                                <span>•</span>
                                <span>{student.contests} contests</span>
                                <span>•</span>
                                <span>{student.streak} day streak</span>
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

                {/* Contest Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Recent Contest Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.contestStats.map((contest) => (
                        <div key={contest.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{contest.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {contest.participants} participants
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Completion Rate</span>
                              <span>{contest.completionRate}%</span>
                            </div>
                            <Progress value={contest.completionRate} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Average Score:</span>
                              <span className="ml-2 font-medium">{contest.averageScore}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Top Score:</span>
                              <span className="ml-2 font-medium">{contest.topScore}%</span>
                            </div>
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

              <TabsContent value="contest-leaderboard">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Contest Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <Select value={selectedContest} onValueChange={setSelectedContest}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Contest" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(analyticsData.contestLeaderboards).map((contest) => (
                              <SelectItem key={contest} value={contest}>
                                {contest}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {filteredLeaderboard.map((student) => (
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
                                {student.rank <= 3 && (
                                  <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                    <Star className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{student.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{student.score}%</span>
                                  <span>•</span>
                                  <span>Time: {student.timeTaken}</span>
                                  <span>•</span>
                                  <span>{student.submissionCount} submissions</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              Rank #{student.rank}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contests">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Contest Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analyticsData.contestStats.map((contest) => (
                        <Card key={contest.id}>
                          <CardHeader>
                            <CardTitle>{contest.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Participants</span>
                                  <span>{contest.participants}</span>
                                </div>
                                <Progress value={(contest.participants / analyticsData.totalStudents) * 100} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Completion Rate</span>
                                  <span>{contest.completionRate}%</span>
                                </div>
                                <Progress value={contest.completionRate} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Average Score</span>
                                  <span>{contest.averageScore}%</span>
                                </div>
                                <Progress value={contest.averageScore} className="h-2" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Top Score</span>
                                  <span>{contest.topScore}%</span>
                                </div>
                                <Progress value={contest.topScore} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                        <div key={achievement.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <Award className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.student}</h4>
                              <p className="text-sm text-muted-foreground">
                                Earned {achievement.achievement} in {achievement.contest}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
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