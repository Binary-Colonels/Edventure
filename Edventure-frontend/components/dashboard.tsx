"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import CourseCard from "@/components/courses/course-card"
import ProgressCard from "@/components/dashboard/progress-card"
import UpcomingCard from "@/components/dashboard/upcoming-card"
import { Bell, Search, Coins, Award, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, <span className="text-primary font-medium">{user?.username || 'Student'}</span>!</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-3 items-center">
                <div className="flex items-center gap-3 mr-2">
                  <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-3 py-1.5 rounded-full shadow-sm">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.coins || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="pl-8 bg-background/80 backdrop-blur-sm border-input rounded-xl hover:border-primary/30 transition-all" 
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-background/80 backdrop-blur-sm rounded-xl hover:border-primary/30 transition-all"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ProgressCard
                title="Course Progress"
                percentage={65}
                courses={[
                  { id: 1, name: "UI/UX Design", progress: 75 },
                  { id: 2, name: "Web Development", progress: 50 },
                  { id: 3, name: "Mobile App Development", progress: 30 },
                ]}
              />
              <UpcomingCard
                title="Upcoming Lessons"
                lessons={[
                  { id: 1, title: "Advanced UI Design Principles", time: "10:00 AM", date: "Today" },
                  { id: 2, title: "Responsive Layout Workshop", time: "2:30 PM", date: "Tomorrow" },
                ]}
              />
              <UpcomingCard
                title="Assignments Due"
                lessons={[
                  { id: 1, title: "Design System Creation", time: "11:59 PM", date: "Today" },
                  { id: 2, title: "Portfolio Website", time: "11:59 PM", date: "May 15" },
                ]}
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Button variant="outline" className="flex items-center gap-1.5 rounded-xl hover:border-primary/30">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Discover More</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <CourseCard
                title="UI/UX Design Fundamentals"
                instructor="Sarah Johnson"
                progress={75}
                image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
                lessons={12}
                duration="6 weeks"
              />
              <CourseCard
                title="Frontend Web Development"
                instructor="Michael Chen"
                progress={50}
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
                lessons={24}
                duration="8 weeks"
              />
              <CourseCard
                title="Mobile App Development"
                instructor="Jessica Lee"
                progress={30}
                image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop"
                lessons={18}
                duration="10 weeks"
              />
              <CourseCard
                title="Data Visualization"
                instructor="Robert Smith"
                progress={0}
                image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                lessons={15}
                duration="5 weeks"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

