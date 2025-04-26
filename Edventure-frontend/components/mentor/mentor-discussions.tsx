"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle, Plus, MoreHorizontal, ThumbsUp } from "lucide-react"

export default function MentorDiscussionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for mentor discussions
  const discussions = [
    {
      id: "1",
      title: "How to structure a React component for maintainability?",
      course: "Frontend Web Development",
      lastActive: "2 hours ago",
      tags: ["React", "Best Practices", "Code Structure"],
      replies: 12,
      views: 45,
      author: {
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg?height=30&width=30",
      },
      isAnswered: true,
    },
    {
      id: "2",
      title: "What's the difference between useCallback and useMemo?",
      course: "Frontend Web Development",
      lastActive: "5 hours ago",
      tags: ["React", "Hooks", "Performance"],
      replies: 8,
      views: 32,
      author: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=30&width=30",
      },
      isAnswered: true,
    },
    {
      id: "3",
      title: "Best approach for a responsive navigation menu",
      course: "UI/UX Design Fundamentals",
      lastActive: "1 day ago",
      tags: ["UI Design", "Responsive", "Navigation"],
      replies: 15,
      views: 67,
      author: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=30&width=30",
      },
      isAnswered: false,
    },
    {
      id: "4",
      title: "Error handling in JavaScript async functions",
      course: "Frontend Web Development",
      lastActive: "2 days ago",
      tags: ["JavaScript", "Async/Await", "Error Handling"],
      replies: 6,
      views: 28,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=30&width=30",
      },
      isAnswered: false,
    },
    {
      id: "5",
      title: "CSS Grid vs Flexbox - when to use which?",
      course: "Frontend Web Development",
      lastActive: "3 days ago",
      tags: ["CSS", "Layout", "Best Practices"],
      replies: 20,
      views: 82,
      author: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=30&width=30",
      },
      isAnswered: true,
    },
  ]

  const announcements = [
    {
      id: "a1",
      title: "New assignment posted: CSS Layout Challenge",
      course: "Frontend Web Development",
      date: "Today",
      content: "Please complete the new CSS layout challenge by Friday. Instructions are available in the assignments section.",
    },
    {
      id: "a2",
      title: "Schedule change for next week's UI design workshop",
      course: "UI/UX Design Fundamentals",
      date: "Yesterday",
      content: "The workshop will be held on Thursday at 2PM instead of Wednesday at 3PM. Please update your calendars.",
    },
    {
      id: "a3",
      title: "Guest lecture announcement: Industry expert joining next class",
      course: "Frontend Web Development",
      date: "2 days ago",
      content: "We'll have a special guest from a leading tech company joining us next week to discuss real-world React applications.",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Discussions</h1>
                <p className="text-muted-foreground mt-1">Engage with students in course discussions</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search discussions..." 
                    className="pl-8 bg-background border-muted"
                  />
                </div>
                <Button className="bg-indigo-700 hover:bg-purple-900">
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="discussions" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="p-4 md:p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex gap-4">
                      <Avatar className="hidden sm:flex h-10 w-10">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium text-lg hover:text-indigo-500">
                            {discussion.title}
                          </h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span>{discussion.course}</span>
                          <span>·</span>
                          <span>Last active: {discussion.lastActive}</span>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <span>·</span>
                          <span>Student: {discussion.author.name}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="font-medium">
                              {tag}
                            </Badge>
                          ))}
                          
                          {discussion.isAnswered && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Answered
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 