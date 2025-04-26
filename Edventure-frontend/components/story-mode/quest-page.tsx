"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react"

interface QuestPageProps {
  worldId: string
  chapterId: string
  questId: string
}

export default function QuestPage({ worldId, chapterId, questId }: QuestPageProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [quest, setQuest] = useState<any>(null)
  const [choices, setChoices] = useState<any[]>([])
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [questCompleted, setQuestCompleted] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // Simulating API call with setTimeout
    const fetchData = () => {
      setTimeout(() => {
        // Dummy quest data
        const questData = {
          id: questId,
          chapterId: chapterId,
          worldId: worldId,
          title: "CSS Animations",
          description: "Add life to your web pages with CSS animations and transitions.",
          type: "lesson",
          content:
            "In this quest, you will learn how to create engaging animations using CSS. Animations can make your web pages more interactive and provide visual feedback to users.",
          orderNumber: 6,
          unlocked: true,
          completed: false,
        }

        // Dummy choices data
        const choicesData = [
          {
            id: "1",
            text: "Learn about CSS transitions",
            consequenceDescription: "You will master the basics of smooth property changes.",
            nextQuestId: "7",
          },
          {
            id: "2",
            text: "Explore CSS keyframe animations",
            consequenceDescription: "You will learn how to create complex multi-step animations.",
            nextQuestId: "7",
          },
          {
            id: "3",
            text: "Study animation performance optimization",
            consequenceDescription:
              "You will understand how to create efficient animations that don't slow down the browser.",
            nextQuestId: "7",
          },
        ]

        setQuest(questData)
        setChoices(choicesData)
        setLoading(false)
      }, 500)
    }

    fetchData()
  }, [worldId, chapterId, questId])

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId)
  }

  const handleCompleteQuest = () => {
    // In a real app, this would call an API to update progress
    setQuestCompleted(true)

    // Simulate delay before redirecting
    setTimeout(() => {
      const nextQuestId = choices.find((c) => c.id === selectedChoice)?.nextQuestId
      router.push(`/story-mode/${worldId}/chapter/${chapterId}/quest/${nextQuestId}`)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />

          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/story-mode/${worldId}/chapter/${chapterId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chapter
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{quest.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{quest.description}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{quest.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{quest.content}</p>

                  <h3>What are CSS Animations?</h3>
                  <p>
                    CSS animations allow you to create transitions between different states of an element. They consist
                    of two components:
                  </p>
                  <ul>
                    <li>Styles that define the animation</li>
                    <li>Keyframes that define the states of the animation</li>
                  </ul>

                  <h3>Basic Example</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    {`.box {
  width: 100px;
  height: 100px;
  background-color: red;
  animation-name: colorChange;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}

@keyframes colorChange {
  0% { background-color: red; }
  25% { background-color: yellow; }
  50% { background-color: blue; }
  100% { background-color: green; }
}`}
                  </pre>

                  <h3>Animation Properties</h3>
                  <p>CSS provides several properties to control animations:</p>
                  <ul>
                    <li>
                      <strong>animation-name</strong>: Specifies the name of the @keyframes rule
                    </li>
                    <li>
                      <strong>animation-duration</strong>: Defines how long the animation takes to complete one cycle
                    </li>
                    <li>
                      <strong>animation-timing-function</strong>: Specifies the speed curve of the animation
                    </li>
                    <li>
                      <strong>animation-delay</strong>: Defines when the animation will start
                    </li>
                    <li>
                      <strong>animation-iteration-count</strong>: Specifies how many times the animation should run
                    </li>
                    <li>
                      <strong>animation-direction</strong>: Defines whether the animation should play forward, backward,
                      or alternate
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {!questCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Path</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedChoice === choice.id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                            : "border-border hover:border-indigo-200 hover:bg-muted/50"
                        }`}
                        onClick={() => handleChoiceSelect(choice.id)}
                      >
                        <h3 className="font-medium">{choice.text}</h3>
                        {selectedChoice === choice.id && (
                          <p className="text-sm text-muted-foreground mt-2">{choice.consequenceDescription}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    className="bg-indigo-700 hover:bg-purple-900"
                    disabled={!selectedChoice}
                    onClick={handleCompleteQuest}
                  >
                    Complete Quest
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Quest Completed!</h2>
                  <div className="animate-pulse">
                    <p className="text-sm">Redirecting to next quest...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

