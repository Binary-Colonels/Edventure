"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, FileText, Calendar, Clock, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function MentorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for mentor dashboard
  const courseStats = [
    {
      title: "Active Courses",
      value: 5,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Students",
      value: 128,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending Assignments",
      value: 24,
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Upcoming Sessions",
      value: 8,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "assignment",
      title: 'New submissions for "CSS Layout Challenge"',
      course: "Frontend Web Development",
      time: "2 hours ago",
      count: 12,
    },
    {
      id: "2",
      type: "discussion",
      title: 'New question in "JavaScript Promises" discussion',
      course: "Frontend Web Development",
      time: "5 hours ago",
      count: 3,
    },
    {
      id: "3",
      type: "course",
      title: 'Course materials updated for "UI Design Principles"',
      course: "UI/UX Design Fundamentals",
      time: "Yesterday",
      count: null,
    },
    {
      id: "4",
      type: "student",
      title: "New students enrolled in your courses",
      course: "Multiple courses",
      time: "Yesterday",
      count: 5,
    },
  ]

  const upcomingClasses = [
    {
      id: "1",
      title: "Advanced CSS Techniques",
      course: "Frontend Web Development",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      students: 24,
      location: "Virtual Classroom 1",
    },
    {
      id: "2",
      title: "User Research Methods",
      course: "UI/UX Design Fundamentals",
      date: "Tomorrow",
      time: "10:00 AM - 11:30 AM",
      students: 18,
      location: "Virtual Classroom 2",
    },
    {
      id: "3",
      title: "JavaScript Frameworks Overview",
      course: "Frontend Web Development",
      date: "May 20, 2023",
      time: "2:00 PM - 4:00 PM",
      students: 24,
      location: "Virtual Classroom 1",
    },
  ]

  const pendingTasks = [
    {
      id: "1",
      title: "Grade CSS Layout Challenge submissions",
      course: "Frontend Web Development",
      dueDate: "Today",
      priority: "High",
      count: 12,
    },
    {
      id: "2",
      title: "Prepare materials for JavaScript Frameworks class",
      course: "Frontend Web Development",
      dueDate: "Tomorrow",
      priority: "Medium",
      count: null,
    },
    {
      id: "3",
      title: "Review quiz questions for UI Design Principles",
      course: "UI/UX Design Fundamentals",
      dueDate: "May 21, 2023",
      priority: "Medium",
      count: null,
    },
    {
      id: "4",
      title: "Respond to student questions in discussion forum",
      course: "Multiple courses",
      dueDate: "Today",
      priority: "Low",
      count: 5,
    },
  ]

  const studentPerformance = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 78,
      assignments: 8,
      completed: 6,
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 92,
      assignments: 10,
      completed: 10,
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 45,
      assignments: 8,
      completed: 4,
      lastActive: "3 hours ago",
    },
    {
      id: "4",
      name: "Sarah Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 65,
      assignments: 10,
      completed: 7,
      lastActive: "5 hours ago",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "discussion":
        return <HelpCircle className="h-5 w-5 text-purple-500" />
      case "course":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "student":
        return <Users className="h-5 w-5 text-indigo-500" />
      default:
        return <FileText className="h-5 w-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mentor Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Professor Johnson!</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <Button className="bg-indigo-700 hover:bg-purple-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {courseStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                            <p>{activity.course}</p>
                            <span className="hidden sm:inline">•</span>
                            <p>{activity.time}</p>
                          </div>
                        </div>
                        {activity.count && (
                          <Badge variant="secondary">{activity.count}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Upcoming Classes</CardTitle>
                  <CardDescription>Your scheduled teaching sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingClasses.map((session) => (
                      <div key={session.id} className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded-md">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{session.title}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                            <p>{session.course}</p>
                            <span className="hidden sm:inline">•</span>
                            <p>{session.date}, {session.time}</p>
                          </div>
                          <div className="mt-1 text-sm flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{session.students} students</span>
                          </div>
                        </div>
                        <Link href="#">
                          <Button variant="outline" size="sm">Join</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Tasks</CardTitle>
                  <CardDescription>Pending actions requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        {task.priority === "High" ? (
                          <AlertCircle className="mt-1 h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="mt-1 h-5 w-5 text-amber-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                            <p>{task.course}</p>
                            <span className="hidden sm:inline">•</span>
                            <p>Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.count && (
                            <Badge variant="outline">{task.count}</Badge>
                          )}
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Student Performance</CardTitle>
                      <CardDescription>Students requiring attention</CardDescription>
                    </div>
                    <Link href="/mentor/students">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentPerformance.map((student) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{student.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                            <p className="truncate">{student.course}</p>
                            <span className="hidden sm:inline">•</span>
                            <p>Last active: {student.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">{student.progress}%</p>
                            <p className="text-xs text-muted-foreground">{student.completed}/{student.assignments} complete</p>
                          </div>
                          <Progress value={student.progress} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 