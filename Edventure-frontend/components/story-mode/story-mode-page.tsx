"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Star, Trophy } from "lucide-react"

export default function StoryModePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Story Mode</h1>
              <p className="text-muted-foreground mt-1">Immersive learning adventure</p>
            </div>

            {/* SQL Adventure - The Single Level */}
            <Card className="overflow-hidden mb-8 border-2 border-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="relative h-48 md:h-full md:col-span-1">
                  <Image
                    src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"
                    alt="SQL Jungle Adventure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-blue-800">SQL Jungle Adventure</h2>
                    <Badge className="bg-blue-600">Featured</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    You're trapped in the SQL Jungle! Master SQL concepts to defeat database monsters and escape. 
                    Learn everything from table creation to complex joins in this exciting interactive adventure.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Code className="h-3 w-3" /> 13 SQL Concepts
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Star className="h-3 w-3" /> Interactive Gameplay
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-200">
                      <Trophy className="h-3 w-3" /> 650 XP Reward
                    </Badge>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-foreground mb-4">
                      <strong>Adventure Overview:</strong><br/>
                      In the SQL Jungle Adventure, you'll embark on a journey to master database concepts through an 
                      immersive interactive story. Follow the path through the jungle, solving SQL challenges and 
                      completing quests to progress. By the end, you'll have practical experience with SQL queries, 
                      database structure, and data manipulation.
                    </p>
                  
                    <p className="text-sm text-foreground mb-4">
                      <strong>Skills You'll Learn:</strong><br/>
                      • Creating and managing database tables<br/>
                      • Writing SELECT, INSERT, UPDATE, and DELETE queries<br/>
                      • Filtering data with WHERE clauses<br/>
                      • Joining tables for complex data retrieval<br/>
                      • Aggregating data with GROUP BY<br/>
                      • Understanding database relationships
                    </p>
                  </div>
                  
                  <Link href="/story-mode/sql-adventure">
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
                      Start Adventure
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

