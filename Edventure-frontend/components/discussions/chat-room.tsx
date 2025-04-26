"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, MoreVertical, Info, Phone, Video } from "lucide-react"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  isMe: boolean
}

interface ChatRoomProps {
  chatId: string
  chat: {
    id: string
    name: string
    avatar: string
    members?: number
  }
}

export default function ChatRoom({ chatId, chat }: ChatRoomProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Dummy messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        id: "user1",
        name: chat.name,
        avatar: chat.avatar,
      },
      content: "Hi there! How are you doing with the assignment?",
      timestamp: "10:30 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: {
        id: "me",
        name: "Me",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "I'm working on it now. Should be done by tomorrow.",
      timestamp: "10:32 AM",
      isMe: true,
    },
    {
      id: "3",
      sender: {
        id: "user1",
        name: chat.name,
        avatar: chat.avatar,
      },
      content: "Great! Let me know if you need any help.",
      timestamp: "10:33 AM",
      isMe: false,
    },
    {
      id: "4",
      sender: {
        id: "me",
        name: "Me",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Actually, I'm having trouble with the last part. Could you explain how to approach it?",
      timestamp: "10:35 AM",
      isMe: true,
    },
    {
      id: "5",
      sender: {
        id: "user1",
        name: chat.name,
        avatar: chat.avatar,
      },
      content: "The key is to break it down into smaller steps. First, you need to analyze the requirements...",
      timestamp: "10:40 AM",
      isMe: false,
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: {
          id: "me",
          name: "Me",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      }

      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>
              {chat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">{chat.members ? `${chat.members} members` : "Online"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                {!msg.isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                    <AvatarFallback>
                      {msg.sender.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className={`rounded-lg p-3 ${msg.isMe ? "bg-indigo-700 text-white" : "bg-muted"}`}>
                    <p>{msg.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${msg.isMe ? "text-right" : ""}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()} className="bg-indigo-700 hover:bg-purple-900">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

