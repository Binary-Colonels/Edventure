"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, Bot, MessageSquare } from "lucide-react"
import ChatRoom from "@/components/discussions/chat-room"
import TutorBot from "@/components/discussions/tutor-bot"

export default function DiscussionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"direct" | "groups" | "tutorbot">("direct")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for chats
  const directChats = [
    {
      id: "direct1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you share the design files?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "direct2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The assignment is due tomorrow",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "direct3",
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
      unread: 0,
    },
  ]

  const groupChats = [
    {
      id: "group1",
      name: "UI/UX Design Class",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Prof: Don't forget about the quiz tomorrow",
      time: "2:45 PM",
      unread: 5,
      members: 24,
    },
    {
      id: "group2",
      name: "Web Dev Project Team",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Michael: I've pushed the changes to GitHub",
      time: "Yesterday",
      unread: 0,
      members: 6,
    },
    {
      id: "group3",
      name: "Mobile App Development",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Prof: Class will be online today",
      time: "May 10",
      unread: 0,
      members: 18,
    },
  ]

  const handleChatSelect = (chatId: string, tab: "direct" | "groups") => {
    setSelectedChat(chatId)
    setActiveTab(tab)
  }

  const handleTutorBotSelect = () => {
    setSelectedChat(null)
    setActiveTab("tutorbot")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden bg-muted/30">
          <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-80 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">Discussions</h1>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="pl-8 bg-background border-muted"
                  />
                </div>
              </div>

              <Tabs defaultValue="direct" className="flex-1 overflow-hidden">
                <div className="px-4 pt-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="direct" className="flex-1">
                      Direct
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="flex-1">
                      Groups
                    </TabsTrigger>
                    <TabsTrigger value="tutorbot" className="flex-1">
                      TutorBot
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="direct" className="m-0 p-0">
                    <div className="divide-y divide-border">
                      {directChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            selectedChat === chat.id && activeTab === "direct" ? "bg-muted/50" : ""
                          }`}
                          onClick={() => handleChatSelect(chat.id, "direct")}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback>
                                {chat.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {chat.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                              <div className="bg-indigo-700 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="groups" className="m-0 p-0">
                    <div className="divide-y divide-border">
                      {groupChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            selectedChat === chat.id && activeTab === "groups" ? "bg-muted/50" : ""
                          }`}
                          onClick={() => handleChatSelect(chat.id, "groups")}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback>
                                {chat.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {chat.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{chat.members} members</span>
                              </div>
                            </div>
                            {chat.unread > 0 && (
                              <div className="bg-indigo-700 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tutorbot" className="m-0 p-0">
                    <div
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        activeTab === "tutorbot" ? "bg-muted/50" : ""
                      }`}
                      onClick={handleTutorBotSelect}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="bg-blue-100">
                          <AvatarFallback className="text-blue-600">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium truncate">TutorBot</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">24/7</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">AI-powered learning assistant</p>
                          <div className="flex items-center mt-1 text-xs text-blue-500">
                            <Bot className="h-3 w-3 mr-1" />
                            <span>Gemini-powered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedChat && (activeTab === "direct" || activeTab === "groups") ? (
                <ChatRoom
                  chatId={selectedChat}
                  chat={[...directChats, ...groupChats].find((c) => c.id === selectedChat)!}
                />
              ) : activeTab === "tutorbot" ? (
                <TutorBot />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="bg-muted/50 rounded-full p-6 inline-flex mb-4">
                      <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Your Discussions</h2>
                    <p className="text-muted-foreground max-w-sm">
                      Select a conversation or start a new one to begin messaging
                    </p>
                    <Button className="mt-4 bg-indigo-700 hover:bg-purple-900">
                      <Plus className="h-4 w-4 mr-2" />
                      New Discussion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

