"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, Sparkles, BookOpen, Lightbulb, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchGeminiResponse } from "@/lib/geminiAPI"

interface Message {
  id: string
  content: string
  timestamp: string
  isMe: boolean
  isLoading?: boolean
  suggestions?: string[]
}

export default function TutorBot() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hi there! I'm TutorBot, your AI learning assistant powered by Gemini. I can help you with your courses, answer questions, provide explanations, and offer learning suggestions. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: false,
      suggestions: [
        "Explain CSS animations",
        "Help with JavaScript promises",
        "What's the difference between var, let, and const?",
        "How do I create a responsive layout?",
      ],
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thinking...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: false,
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setMessage("")

    try {
      const geminiReply = await fetchGeminiResponse(message)

      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter((msg) => !msg.isLoading)

        return [
          ...newMessages,
          {
            id: Date.now().toString(),
            content: geminiReply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: false,
            suggestions: [], // You can add logic to extract or generate suggestions
          },
        ]
      })
    } catch (err) {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter((msg) => !msg.isLoading)

        return [
          ...newMessages,
          {
            id: Date.now().toString(),
            content: "⚠️ Error getting response from Gemini. Please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: false,
          },
        ]
      })
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
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
          <Avatar className="bg-blue-100">
            <AvatarFallback className="text-blue-600">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">TutorBot</h2>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Sparkles className="h-3 w-3" /> Gemini
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">AI-powered learning assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Course Context</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                {!msg.isMe && (
                  <Avatar className="h-8 w-8 bg-blue-100">
                    <AvatarFallback className="text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-2">
                  <div
                    className={`rounded-lg p-3 ${
                      msg.isMe ? "bg-indigo-700 text-white" : "bg-white dark:bg-gray-800 shadow-sm"
                    }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {msg.content.split("\n").map((line, i) => (
                          <p key={i} className="mb-2">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {!msg.isMe && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white dark:bg-gray-800 shadow-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  <p className={`text-xs text-muted-foreground ${msg.isMe ? "text-right" : ""}`}>{msg.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Ask TutorBot anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            <span>TutorBot can help with course content, explain concepts, and provide learning resources</span>
          </p>
        </div>
      </div>
    </div>
  )
}
