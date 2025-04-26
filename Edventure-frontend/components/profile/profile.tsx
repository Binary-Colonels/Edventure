"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Coins, BookOpen, Clock, GraduationCap, Trophy, Star, Target, Zap, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

// Type definitions
interface UserBadge {
  id: number | string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  dateEarned?: string;
}

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, fetchUserProfile } = useAuth()

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Get initials from username for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  // Format qualification for display
  const formatQualification = (qualification: string) => {
    return qualification
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Mock badges data - in a real app, this would come from the API
  const userBadges = [
    { id: 1, name: "Fast Learner", description: "Completed 5 courses in record time", icon: <Clock className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
    { id: 2, name: "Knowledge Master", description: "Scored 90%+ in 3 consecutive quizzes", icon: <BookOpen className="h-5 w-5" />, color: "bg-green-100 text-green-700" },
    { id: 3, name: "Rising Star", description: "Earned 1000 EDUCOINS", icon: <Trophy className="h-5 w-5" />, color: "bg-amber-100 text-amber-700" },
    { id: 4, name: "SQL Champion", description: "Completed all SQL challenges", icon: <Zap className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
    { id: 5, name: "Persistent Learner", description: "Logged in for 7 consecutive days", icon: <Target className="h-5 w-5" />, color: "bg-red-100 text-red-700" },
    { id: 6, name: "Top Performer", description: "Ranked in the top 10% of all students", icon: <Star className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-700" },
  ]

  // Activity history data
  const activityHistory = [
    { id: 1, type: "Course Completion", name: "Introduction to SQL", reward: 50, date: "2023-03-15" },
    { id: 2, type: "Quiz Success", name: "Python Fundamentals Quiz", reward: 25, date: "2023-03-10" },
    { id: 3, type: "Challenge Completed", name: "SQL Challenge Level 5", reward: 100, date: "2023-03-05" },
    { id: 4, type: "Daily Login", name: "7-Day Streak", reward: 10, date: "2023-03-01" },
    { id: 5, type: "Forum Contribution", name: "Helped 3 students", reward: 15, date: "2023-02-25" },
  ]

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
            <div className="flex items-center justify-center h-full">
              <p>Loading profile information...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Get user's coins
  const userCoins = user.coins || 1250; // Default to 1250 EDUCOINS if coins is not available
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground mt-1">View and manage your profile information</p>
            </div>

            {/* Top stats cards - LeetCode style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-blue-800">RANK</p>
                      <p className="text-2xl font-bold text-blue-900">#{user.rank || 1250}</p>
                    </div>
                    <Trophy className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-green-800">EDUCOINS</p>
                      <p className="text-2xl font-bold text-green-900">{userCoins}</p>
                    </div>
                    <Coins className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-purple-800">BADGES</p>
                      <p className="text-2xl font-bold text-purple-900">{userBadges.length}</p>
                    </div>
                    <GraduationCap className="h-10 w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Remove all the XP-related UI components */}
            
            {/* Main content tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                {/* User profile card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal and academic details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <Avatar className="h-32 w-32 mb-4">
                          <AvatarImage src="/avatars/01.png" alt={user.username} />
                          <AvatarFallback className="text-3xl">{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold">{user.username}</h2>
                        <p className="text-muted-foreground mb-2">{user.email}</p>
                        <Badge variant="outline" className="mb-4">
                          {formatQualification(user.qualification)}
                        </Badge>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">PERSONAL INFORMATION</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Username</p>
                                <p className="font-medium">{user.username}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="font-medium capitalize">{user.role}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">ACADEMIC DETAILS</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Qualification</p>
                                <p className="font-medium">{formatQualification(user.qualification)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Institution/Company</p>
                                <p className="font-medium">{user.institute_company}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">EDUCOINS Balance</p>
                                <p className="font-medium">{userCoins}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Areas of Interest</CardTitle>
                      <CardDescription>Topics you're interested in learning about</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest) => (
                          <Badge variant="secondary" key={interest.id} className="px-3 py-1">
                            {interest.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="badges" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Earned Badges</CardTitle>
                    <CardDescription>Achievement badges you've unlocked</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userBadges.map((badge) => (
                      <div key={badge.id} className="border rounded-lg p-4 flex items-start gap-3">
                        <div className={`p-2 rounded-full ${badge.color}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          {badge.dateEarned && (
                            <p className="text-xs text-muted-foreground mt-1">Earned: {badge.dateEarned}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your learning progress and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Activity</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Reward</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityHistory.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.type}</TableCell>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Coins className="h-4 w-4 text-amber-600" />
                                <span>{activity.reward}</span>
                              </div>
                            </TableCell>
                            <TableCell>{activity.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Settings panel content will go here.</p>
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