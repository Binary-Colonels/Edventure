"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Pencil,
  Mail,
  Phone,
  FileText,
  BookOpen,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"

export default function MentorStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy student data
  const students = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder-avatar.png",
      courses: [
        { id: "101", name: "Frontend Web Development", progress: 78 },
        { id: "102", name: "UI/UX Design Fundamentals", progress: 45 },
      ],
      totalProgress: 65,
      enrolledDate: "2023-01-15",
      lastActive: "2 hours ago",
      assignments: {
        completed: 12,
        pending: 3,
        late: 1,
      },
      quizzes: {
        completed: 5,
        avgScore: 82,
      },
      hasFlaggedAssignments: true,
    },
    {
      id: "2",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      phone: "+1 (555) 987-6543",
      avatar: "/placeholder-avatar.png",
      courses: [
        { id: "101", name: "Frontend Web Development", progress: 92 },
      ],
      totalProgress: 92,
      enrolledDate: "2023-02-01",
      lastActive: "1 day ago",
      assignments: {
        completed: 15,
        pending: 0,
        late: 0,
      },
      quizzes: {
        completed: 6,
        avgScore: 95,
      },
      hasFlaggedAssignments: false,
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@example.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder-avatar.png",
      courses: [
        { id: "101", name: "Frontend Web Development", progress: 45 },
        { id: "103", name: "JavaScript Fundamentals", progress: 68 },
      ],
      totalProgress: 55,
      enrolledDate: "2023-01-20",
      lastActive: "3 days ago",
      assignments: {
        completed: 8,
        pending: 6,
        late: 2,
      },
      quizzes: {
        completed: 4,
        avgScore: 75,
      },
      hasFlaggedAssignments: true,
    },
    {
      id: "4",
      name: "Sarah Kim",
      email: "sarah.kim@example.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder-avatar.png",
      courses: [
        { id: "102", name: "UI/UX Design Fundamentals", progress: 88 },
      ],
      totalProgress: 88,
      enrolledDate: "2023-02-10",
      lastActive: "5 hours ago",
      assignments: {
        completed: 14,
        pending: 2,
        late: 0,
      },
      quizzes: {
        completed: 5,
        avgScore: 90,
      },
      hasFlaggedAssignments: false,
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder-avatar.png",
      courses: [
        { id: "101", name: "Frontend Web Development", progress: 35 },
        { id: "103", name: "JavaScript Fundamentals", progress: 42 },
      ],
      totalProgress: 38,
      enrolledDate: "2023-01-25",
      lastActive: "1 week ago",
      assignments: {
        completed: 6,
        pending: 8,
        late: 4,
      },
      quizzes: {
        completed: 3,
        avgScore: 65,
      },
      hasFlaggedAssignments: true,
    },
  ]

  const getProgressColor = (progress: number) => {
    if (progress < 40) return "text-red-500"
    if (progress < 70) return "text-amber-500"
    return "text-green-500"
  }

  const filteredStudents = selectedTab === "all" 
    ? students 
    : selectedTab === "attention" 
      ? students.filter(student => student.hasFlaggedAssignments || student.totalProgress < 50)
      : students.filter(student => student.courses.some(course => course.name.includes(selectedTab)))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Students</h1>
                <p className="text-muted-foreground mt-1">View and manage your student roster</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search students..." 
                    className="pl-8 bg-background border-muted"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-background">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedTab("all")}>All Students</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedTab("attention")}>Needs Attention</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Courses</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSelectedTab("Frontend Web Development")}>Frontend Web Development</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedTab("UI/UX Design")}>UI/UX Design Fundamentals</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedTab("JavaScript")}>JavaScript Fundamentals</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="bg-indigo-700 hover:bg-purple-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
            
            <div className="bg-background rounded-lg border shadow-sm">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
                        <p className="text-2xl font-bold">{students.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Active Students</h3>
                        <p className="text-2xl font-bold">{students.filter(s => s.lastActive.includes("hours") || s.lastActive.includes("day")).length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Needs Attention</h3>
                        <p className="text-2xl font-bold">{students.filter(s => s.hasFlaggedAssignments || s.totalProgress < 50).length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Student</th>
                        <th className="py-3 px-4 text-left font-medium">Progress</th>
                        <th className="py-3 px-4 text-left font-medium">Courses</th>
                        <th className="py-3 px-4 text-left font-medium">Assignments</th>
                        <th className="py-3 px-4 text-left font-medium">Last Active</th>
                        <th className="py-3 px-4 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Progress value={student.totalProgress} className="w-20 h-2" />
                              <span className={`text-sm font-medium ${getProgressColor(student.totalProgress)}`}>
                                {student.totalProgress}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {student.courses.map((course) => (
                                <p key={course.id} className="text-sm">{course.name}</p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm">
                                <span className="text-green-500 font-medium">{student.assignments.completed}</span> completed
                              </div>
                              {student.assignments.pending > 0 && (
                                <Badge variant="outline" className="ml-2 text-amber-500">
                                  {student.assignments.pending} pending
                                </Badge>
                              )}
                              {student.assignments.late > 0 && (
                                <Badge variant="outline" className="ml-2 text-red-500">
                                  {student.assignments.late} late
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{student.lastActive}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Assignments
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Flag for Review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 