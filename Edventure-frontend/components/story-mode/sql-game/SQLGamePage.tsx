"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import GameEngine from "./GameEngine"
import JourneyMap from "./JourneyMap"

export default function SQLGamePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [gameStage, setGameStage] = useState<'intro' | 'map' | 'game'>('intro')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const showJourneyMap = () => {
    setGameStage('map')
  }

  const startGame = () => {
    setGameStage('game')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {gameStage === 'intro' ? (
              <>
                <div className="mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/story-mode")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Story Mode
                  </Button>
                </div>

                <Card className="mb-8 border-2 border-blue-300">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardTitle className="text-3xl">SQL Jungle Adventure</CardTitle>
                    <CardDescription className="text-blue-100">
                      Master SQL concepts as you escape from the jungle!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Your Mission</h3>
                        <p className="mb-3">
                          You're trapped in the SQL Jungle! The only way to escape is to master SQL concepts by defeating the database monsters that guard your path.
                        </p>
                        <p className="mb-3">
                          Each monster represents a different SQL concept that you must learn to progress. Move forward in the jungle, face each monster, and defeat them with your SQL knowledge!
                        </p>
                        <p className="mb-5">
                          With each victory, you'll gain new SQL powers and move closer to freedom. Can you escape the jungle and become a SQL master?
                        </p>

                        <div className="flex items-center mb-6">
                          <div className="relative w-20 h-20 mr-4">
                            <Image
                              src="/sql-game/eduguide/eduguide-ready-for-quest.png"
                              alt="EduGuide"
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <div className="bg-blue-100 p-3 rounded-lg border border-blue-300 relative">
                            <div className="absolute left-0 top-1/2 -translate-x-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-blue-100"></div>
                            <p className="text-blue-800 italic">"I'll guide you through this SQL jungle adventure! Let's defeat these database monsters together!"</p>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">How to Play</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                          <li>Use the arrow keys or buttons to move your character through the jungle</li>
                          <li>When you encounter a monster, you'll need to solve an SQL challenge</li>
                          <li>Type SQL queries or select the correct option to defeat monsters</li>
                          <li>Each defeated monster grants you a new SQL skill</li>
                          <li>Defeat all 13 monsters to escape the jungle and complete the game!</li>
                        </ul>

                        <Button 
                          onClick={showJourneyMap}
                          size="lg" 
                          className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                        >
                          View Adventure Map
                        </Button>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-blue-600 shadow-lg mb-4">
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-600/20 z-10"></div>
                          <div className="absolute bottom-4 right-4 z-20">
                            <Image 
                              src="/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png" 
                              alt="EduGuide Character"
                              width={120}
                              height={120}
                            />
                          </div>
                          <Image 
                            src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=1920&auto=format&fit=crop" 
                            alt="SQL Game Preview"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          Defeat SQL monsters and escape the jungle!
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SQL Concepts You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "Databases & Tables", icon: "🏗️" },
                        { name: "Data Types", icon: "🔤" },
                        { name: "Constraints", icon: "🔒" },
                        { name: "DDL Commands", icon: "🏛️" },
                        { name: "DML Commands", icon: "🔄" },
                        { name: "DCL Commands", icon: "🔐" },
                        { name: "TCL Commands", icon: "💾" },
                        { name: "Joins", icon: "🔗" },
                        { name: "Subqueries", icon: "🔍" },
                        { name: "Views", icon: "👁️" },
                        { name: "Indexes", icon: "📖" },
                        { name: "Stored Procedures", icon: "📦" },
                        { name: "SQL Mastery", icon: "🏆" },
                      ].map((concept, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-3 border rounded-lg bg-white shadow-sm"
                        >
                          <span className="text-2xl mr-3">{concept.icon}</span>
                          <span>{concept.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : gameStage === 'map' ? (
              <>
                <div className="mb-6 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameStage('intro')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Game Info
                  </Button>
                </div>

                <JourneyMap onStartGame={startGame} />
              </>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameStage('map')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Adventure Map
                  </Button>
                </div>

                <div className="mario-style-game">
                  <Card className="border-4 border-blue-900 mb-4 shadow-xl">
                    <CardContent className="p-0 overflow-hidden">
                      {/* Game container with fixed height */}
                      <div className="game-window-container relative">
                        <GameEngine />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 