"use client"

import { useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, Trophy } from "lucide-react"

export default function EconomicsQuizPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""))
  const [timeRemaining, setTimeRemaining] = useState(3600) // 1 hour in seconds

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy quiz data
  const quiz = {
    title: "Economics Fundamentals Quiz",
    totalQuestions: 10,
    timeLimit: "1 hour",
    points: 300,
    questions: [
      {
        id: 1,
        question: "What is the law of supply and demand?",
        options: [
          "As price increases, supply decreases and demand increases",
          "As price increases, supply increases and demand decreases",
          "As price decreases, supply increases and demand decreases",
          "As price decreases, supply decreases and demand increases",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is inflation?",
        options: [
          "A decrease in the general price level of goods and services",
          "An increase in the general price level of goods and services",
          "A decrease in the unemployment rate",
          "An increase in the GDP",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is GDP (Gross Domestic Product)?",
        options: [
          "The total value of goods and services produced in a country in a year",
          "The total value of imports in a country in a year",
          "The total value of exports in a country in a year",
          "The total value of government spending in a year",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "What is a monopoly?",
        options: [
          "A market with many sellers",
          "A market with one seller",
          "A market with two sellers",
          "A market with no sellers",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is fiscal policy?",
        options: [
          "Government's policy regarding money supply",
          "Government's policy regarding taxes and spending",
          "Government's policy regarding interest rates",
          "Government's policy regarding trade",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is opportunity cost?",
        options: [
          "The cost of producing a good",
          "The value of the next best alternative foregone",
          "The cost of raw materials",
          "The cost of labor",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "What is a recession?",
        options: [
          "A period of economic growth",
          "A period of economic decline",
          "A period of stable prices",
          "A period of high inflation",
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: "What is the role of the Federal Reserve?",
        options: [
          "To control government spending",
          "To control the money supply and interest rates",
          "To control international trade",
          "To control unemployment",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What is comparative advantage?",
        options: [
          "The ability to produce more of a good than others",
          "The ability to produce a good at a lower opportunity cost than others",
          "The ability to produce all goods better than others",
          "The ability to produce goods at a lower cost than others",
        ],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "What is the multiplier effect?",
        options: [
          "The effect of taxes on government spending",
          "The effect of initial spending on total economic activity",
          "The effect of exports on imports",
          "The effect of savings on investment",
        ],
        correctAnswer: 1,
      },
    ],
  }

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].options[quiz.questions[index].correctAnswer] ? 1 : 0)
    }, 0)

    // TODO: Submit quiz and show results
    console.log("Quiz submitted! Score:", score)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground mt-1">Test your knowledge of basic economic concepts</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  <span className="font-medium">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}</span>
                </div>
                <Badge className="bg-indigo-700">{quiz.points} XP</Badge>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{currentQuestion + 1} of {quiz.totalQuestions}</span>
              </div>
              <Progress value={(currentQuestion + 1) / quiz.totalQuestions * 100} className="h-2" />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Question {currentQuestion + 1}
                    </h2>
                    <p className="text-muted-foreground">
                      {quiz.questions[currentQuestion].question}
                    </p>
                  </div>

                  <RadioGroup
                    value={answers[currentQuestion]}
                    onValueChange={handleAnswer}
                    className="space-y-4"
                  >
                    {quiz.questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <label
                          htmlFor={`option-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    {currentQuestion === quiz.totalQuestions - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        className="bg-indigo-700 hover:bg-purple-900"
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>Next</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={answers[index] ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 