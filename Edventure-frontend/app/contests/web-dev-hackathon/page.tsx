"use client"

import { useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Code, FileCode2, Play, Save, Send, ChevronLeft, ChevronRight, GitBranch, Server, Database, Layout } from "lucide-react"

export default function WebDevHackathonPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("description")
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(`// Your code here
function solution() {
    // Implement your solution
}`)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy hackathon challenges data
  const challenges = [
    {
      id: 1,
      title: "Responsive Dashboard",
      difficulty: "Medium",
      points: 200,
      timeLimit: "4 hours",
      memoryLimit: "512 MB",
      description: `Create a modern, responsive dashboard that displays real-time data and analytics.

Requirements:
1. Use React or Next.js for the frontend
2. Implement a clean, modern UI design
3. Include at least 3 different types of charts/graphs
4. Make it fully responsive for all screen sizes
5. Add dark/light mode toggle
6. Include a navigation sidebar
7. Show loading states and error handling

Bonus Points:
• Add animations and transitions
• Implement real-time data updates
• Add user authentication
• Include data export functionality

Example Layout:
- Header with user profile and theme toggle
- Sidebar with navigation links
- Main content area with:
  • Overview cards
  • Line chart for trends
  • Bar chart for comparisons
  • Pie chart for distribution
  • Data table with sorting/filtering`,
      testCases: [
        {
          input: "Screen size: Desktop",
          output: "Full dashboard layout with all components visible",
          explanation: "Dashboard should display all elements in a grid layout",
        },
        {
          input: "Screen size: Mobile",
          output: "Collapsible sidebar, stacked cards, responsive charts",
          explanation: "Layout should adapt to smaller screens",
        },
        {
          input: "Theme: Dark Mode",
          output: "Dark color scheme with proper contrast",
          explanation: "All components should be visible in dark mode",
        },
      ],
      techStack: ["React", "Next.js", "Tailwind CSS", "Chart.js", "TypeScript"],
    },
    {
      id: 2,
      title: "E-commerce Backend",
      difficulty: "Hard",
      points: 300,
      timeLimit: "6 hours",
      memoryLimit: "1 GB",
      description: `Build a robust e-commerce backend API with the following features:

Requirements:
1. User authentication and authorization
2. Product catalog management
3. Shopping cart functionality
4. Order processing system
5. Payment integration
6. Inventory management
7. Search and filtering
8. API documentation

Bonus Points:
• Implement caching
• Add rate limiting
• Include analytics tracking
• Set up automated testing

API Endpoints:
- /api/auth/* (login, register, reset password)
- /api/products/* (CRUD operations)
- /api/cart/* (cart management)
- /api/orders/* (order processing)
- /api/payments/* (payment handling)
- /api/search/* (product search)`,
      testCases: [
        {
          input: "POST /api/auth/register",
          output: "User account created with JWT token",
          explanation: "Should create user and return authentication token",
        },
        {
          input: "GET /api/products?category=electronics",
          output: "List of filtered products",
          explanation: "Should return products matching the category",
        },
        {
          input: "POST /api/orders",
          output: "Order created with confirmation",
          explanation: "Should process order and update inventory",
        },
      ],
      techStack: ["Node.js", "Express", "MongoDB", "JWT", "Redis"],
    },
    {
      id: 3,
      title: "Real-time Chat Application",
      difficulty: "Medium",
      points: 250,
      timeLimit: "5 hours",
      memoryLimit: "512 MB",
      description: `Develop a real-time chat application with the following features:

Requirements:
1. Real-time messaging using WebSocket
2. User presence indicators
3. Message history
4. File sharing
5. Group chat support
6. Message read receipts
7. Online/offline status

Bonus Points:
• Add video/audio calls
• Implement message encryption
• Add emoji reactions
• Include message search

Features to Implement:
- User authentication
- Chat room creation
- Message persistence
- File upload/download
- User status updates
- Message delivery status`,
      testCases: [
        {
          input: "Send message to online user",
          output: "Instant message delivery with read receipt",
          explanation: "Message should appear immediately with read status",
        },
        {
          input: "Upload file in chat",
          output: "File uploaded with progress indicator",
          explanation: "Should show upload progress and completion",
        },
        {
          input: "Create group chat",
          output: "Group chat room with member list",
          explanation: "Should create room and add members",
        },
      ],
      techStack: ["Socket.io", "React", "Node.js", "MongoDB", "AWS S3"],
    },
    {
      id: 4,
      title: "AI-Powered Task Manager",
      difficulty: "Hard",
      points: 350,
      timeLimit: "8 hours",
      memoryLimit: "1 GB",
      description: `Create an intelligent task management system with AI features:

Requirements:
1. Task creation and management
2. AI-powered task prioritization
3. Smart scheduling
4. Team collaboration
5. Progress tracking
6. Analytics dashboard
7. Integration with calendar

Bonus Points:
• Add natural language processing for task creation
• Implement AI-powered task suggestions
• Add project templates
• Include time tracking

AI Features:
- Task priority prediction
- Smart task categorization
- Workload optimization
- Deadline suggestions
- Team member recommendations`,
      testCases: [
        {
          input: "Create task with natural language",
          output: "Structured task with AI-suggested priority",
          explanation: "Should parse natural language and set appropriate priority",
        },
        {
          input: "View team workload",
          output: "AI-optimized task distribution",
          explanation: "Should show balanced workload across team members",
        },
        {
          input: "Generate project timeline",
          output: "AI-suggested project schedule",
          explanation: "Should create optimal timeline based on task dependencies",
        },
      ],
      techStack: ["Python", "React", "TensorFlow", "FastAPI", "PostgreSQL"],
    },
  ]

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setCode(`// Your code here
function solution() {
    // Implement your solution
}`)
    }
  }

  const handlePreviousChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1)
      setCode(`// Your code here
function solution() {
    // Implement your solution
}`)
    }
  }

  const challenge = challenges[currentChallenge]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Challenge Section */}
            <div className="w-1/2 border-r overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{challenge.title}</h1>
                    <div className="flex items-center gap-2">
                      <Badge className={challenge.difficulty === "Easy" ? "bg-green-500" : challenge.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge className="bg-indigo-700">{challenge.points} XP</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousChallenge}
                      disabled={currentChallenge === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextChallenge}
                      disabled={currentChallenge === challenges.length - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{challenge.timeLimit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCode2 className="h-4 w-4" />
                    <span>{challenge.memoryLimit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    <span>Challenge {currentChallenge + 1} of {challenges.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {challenge.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tech === "React" && <Layout className="h-3 w-3" />}
                      {tech === "Node.js" && <Server className="h-3 w-3" />}
                      {tech === "MongoDB" && <Database className="h-3 w-3" />}
                      {tech.includes("Git") && <GitBranch className="h-3 w-3" />}
                      {tech}
                    </Badge>
                  ))}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{challenge.description}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Test Cases</h3>
                      {challenge.testCases.map((testCase, index) => (
                        <Card key={index} className="mb-4">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Input: </span>
                                <code className="bg-muted px-1 py-0.5 rounded">{testCase.input}</code>
                              </div>
                              <div>
                                <span className="font-medium">Output: </span>
                                <code className="bg-muted px-1 py-0.5 rounded">{testCase.output}</code>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {testCase.explanation}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="submissions">
                    <div className="text-center text-muted-foreground py-8">
                      No submissions yet. Submit your solution to see your submission history.
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion">
                    <div className="text-center text-muted-foreground py-8">
                      Discussion is disabled during the hackathon.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span className="font-medium">Solution.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                  <Button size="sm" className="bg-indigo-700 hover:bg-purple-900">
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  placeholder="Write your solution here..."
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 