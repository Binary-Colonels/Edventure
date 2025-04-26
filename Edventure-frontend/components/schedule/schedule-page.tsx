"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Video, BookOpen, FileText } from "lucide-react"

export default function SchedulePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy schedule data
  const todayEvents = [
    {
      id: 1,
      title: "Advanced UI Design Principles",
      time: "10:00 AM - 11:30 AM",
      type: "lecture",
      course: "UI/UX Design Fundamentals",
    },
    {
      id: 2,
      title: "Group Project Meeting",
      time: "1:00 PM - 2:00 PM",
      type: "meeting",
      course: "Frontend Web Development",
    },
    {
      id: 3,
      title: "Design System Assignment Due",
      time: "11:59 PM",
      type: "assignment",
      course: "UI/UX Design Fundamentals",
    },
  ]

  const upcomingEvents = [
    {
      id: 4,
      title: "Responsive Layout Workshop",
      time: "2:30 PM - 4:00 PM",
      type: "workshop",
      course: "Frontend Web Development",
      date: "Tomorrow",
    },
    {
      id: 5,
      title: "Mobile App Prototyping",
      time: "11:00 AM - 12:30 PM",
      type: "lecture",
      course: "Mobile App Development",
      date: "May 15",
    },
    {
      id: 6,
      title: "Portfolio Website Due",
      time: "11:59 PM",
      type: "assignment",
      course: "Frontend Web Development",
      date: "May 15",
    },
    {
      id: 7,
      title: "User Testing Session",
      time: "3:00 PM - 5:00 PM",
      type: "workshop",
      course: "UI/UX Design Fundamentals",
      date: "May 17",
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "lecture":
        return <Video className="h-4 w-4" />
      case "workshop":
        return <BookOpen className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      case "meeting":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-purple-100 text-purple-800"
      case "assignment":
        return "bg-red-100 text-red-800"
      case "meeting":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Schedule</h1>
              <p className="text-muted-foreground mt-1">Manage your classes and assignments</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="today" className="w-full">
                  <TabsList>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="all">All Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="today" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {todayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}
                              >
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <Badge variant="outline">{event.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{event.time}</p>
                                <p className="text-sm text-muted-foreground">{event.course}</p>
                              </div>
                            </div>
                          ))}

                          {todayEvents.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground">No events scheduled for today</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}
                              >
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <Badge variant="outline">{event.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.time} · {event.date}
                                </p>
                                <p className="text-sm text-muted-foreground">{event.course}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="all" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[...todayEvents, ...upcomingEvents].map((event) => (
                            <div
                              key={event.id}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}
                              >
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <Badge variant="outline">{event.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.time} · {(event as any).date || "Today"}
                                </p>
                                <p className="text-sm text-muted-foreground">{event.course}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

