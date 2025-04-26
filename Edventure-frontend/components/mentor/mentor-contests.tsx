"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Code, FileCode2, BrainCircuit, Eye } from "lucide-react"

export default function MentorContestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for contests
  const activeContests = [
    {
      id: '1',
      title: 'Web Development Challenge',
      description: 'Build a responsive dashboard using React and Tailwind CSS',
      type: 'coding',
      startDate: 'May 15, 2023',
      endDate: 'May 22, 2023',
      participants: 128,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Intermediate',
      timeRemaining: '3 days 5 hours',
      submissions: 42,
      course: 'Frontend Web Development'
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript core concepts and best practices',
      type: 'quiz',
      startDate: 'May 18, 2023',
      endDate: 'May 19, 2023',
      participants: 256,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Beginner',
      timeRemaining: '6 hours',
      submissions: 128,
      course: 'Frontend Web Development'
    },
    {
      id: '3',
      title: 'Algorithm Problem Solving',
      description: 'Solve 5 algorithmic challenges with optimal time and space complexity',
      type: 'problem-solving',
      startDate: 'May 17, 2023',
      endDate: 'May 24, 2023',
      participants: 96,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Advanced',
      timeRemaining: '5 days 12 hours',
      submissions: 24,
      course: 'Mobile App Development'
    }
  ]

  const draftContests = [
    {
      id: '4',
      title: 'UI Design Showcase',
      description: 'Design a mobile app interface for a fitness tracking application',
      type: 'project',
      startDate: 'May 25, 2023',
      endDate: 'June 8, 2023',
      participants: 0,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Intermediate',
      course: 'UI/UX Design Fundamentals'
    },
    {
      id: '5',
      title: 'Database Design Challenge',
      description: 'Create an efficient database schema for an e-commerce platform',
      type: 'coding',
      startDate: 'June 1, 2023',
      endDate: 'June 7, 2023',
      participants: 0,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Advanced',
      course: 'Frontend Web Development'
    }
  ]

  const pastContests = [
    {
      id: '6',
      title: 'CSS Battle',
      description: 'Recreate complex designs using minimal HTML and CSS',
      type: 'coding',
      startDate: 'April 10, 2023',
      endDate: 'April 17, 2023',
      participants: 192,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Intermediate',
      completed: true,
      submissions: 156,
      course: 'Frontend Web Development'
    },
    {
      id: '7',
      title: 'Python Data Analysis',
      description: 'Analyze a dataset and create visualizations to extract insights',
      type: 'project',
      startDate: 'April 20, 2023',
      endDate: 'April 27, 2023',
      participants: 128,
      image: '/placeholder.svg?height=200&width=400',
      difficulty: 'Intermediate',
      completed: true,
      submissions: 98,
      course: 'Data Science Fundamentals'
    }
  ]

  const getContestTypeIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return <Code className="h-5 w-5" />
      case 'quiz':
        return <FileCode2 className="h-5 w-5" />
      case 'problem-solving':
        return <BrainCircuit className="h-5 w-5" />
      case 'project':
        return <Eye className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getContestTypeColor = (type: string) => {
    switch (type) {
      case 'coding':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'quiz':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'problem-solving':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'project':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contests</h1>
                <p className="text-muted-foreground mt-1">Create and manage coding challenges and competitions</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search contests..." 
                    className="pl-8 bg-background border-muted"
                  />
                </div>
                <Button className="bg-indigo-700 hover:bg-purple-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contest
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Contests</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="past">Past Contests</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
} 