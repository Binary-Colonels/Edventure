"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import CourseCard from "@/components/courses/course-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Clock, BookOpen, Play, Trophy, CheckCircle, Circle } from "lucide-react"

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

interface Course {
  id: number
  title: string
  description: string
  difficulty_level: number
  thumbnail_url: string
  duration_hours: number
  prerequisites: string
  creator_id: number
  total_coins: number
  created_at: string
  updated_at: string
  lesson_count: number
  quest_count: number
  interest_tags: number[]
}

interface Enrollment {
  course_id: number
  course_title: string
  enrollment_date: string
  last_accessed_date: string
  progress_percentage: number
  is_completed: boolean
  completion_date: string | null
  completed_lessons: number
  completed_quests: number
}

interface EnrolledCourse extends Course {
  progress_percentage: number
  completed_lessons: number
  completed_quests: number
  enrollment_date: string
  is_completed: boolean
  completion_date: string | null
  last_accessed_date: string
}

interface UserData {
  id: number
  username: string
  email: string
  role: string
  exp: number
  coins: number
  institute_company: string
  qualification: string
  rank: number | null
}

interface Lesson {
  id: number
  title: string
  content_html: string
  pdf_notes_url: string
  video_url: string
  order_number: number
  exp_reward: number
  coins_reward: number
  created_at: string
  updated_at: string
  quest_count: number
  is_completed?: boolean
}

interface Quest {
  id: number
  title: string
  description: string
  time_duration_minutes: number
  exp_reward: number
  question_count: number
  created_at: string
  updated_at: string
  is_completed?: boolean
}

interface Question {
  id: number
  question_text: string
  option_1: string
  option_2: string
  option_3: string
  option_4: string
}

// Function to get random scenic image from Unsplash
const getRandomUnsplashImage = (index: number) => {
  const scenicImages = [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", // mountains and lake
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", // forest
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80", // sunrise/sunset
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", // forest path
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80", // mountain lake
    "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=800&q=80", // mountains and clouds
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80", // mountain range
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80", // forest stream
  ]
  return scenicImages[index % scenicImages.length]
}

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isViewLessonOpen, setIsViewLessonOpen] = useState(false)
  const [isViewQuestOpen, setIsViewQuestOpen] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchUserEnrollments = async () => {
    try {
      setIsLoading(true)
      const userDataString = localStorage.getItem('userData')
      if (!userDataString) {
        toast({
          title: "Error",
          description: "User data not found. Please log in again.",
          variant: "destructive"
        })
        return
      }

      const userData: UserData = JSON.parse(userDataString)
      
      // Get enrollment data using user ID from userData
      const enrollmentsResponse = await axios.get(`http://127.0.0.1:5000/enrollments/user_enrollments/${userData.id}`)
      
      if (enrollmentsResponse.data.success) {
        const enrollments: Enrollment[] = enrollmentsResponse.data.enrollments

        // Then, get detailed course information for each enrolled course
        const enrolledCoursesDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const courseResponse = await axios.get(`http://127.0.0.1:5000/courses/course_details/${enrollment.course_id}`)
            if (courseResponse.data.success) {
              const course: Course = courseResponse.data.course
              return {
                ...course,
                progress_percentage: enrollment.progress_percentage,
                completed_lessons: enrollment.completed_lessons,
                completed_quests: enrollment.completed_quests,
                enrollment_date: enrollment.enrollment_date,
                is_completed: enrollment.is_completed,
                completion_date: enrollment.completion_date,
                last_accessed_date: enrollment.last_accessed_date
              }
            }
            return null
          })
        )

        // Filter out any failed requests
        const validEnrolledCourses = enrolledCoursesDetails.filter((course): course is EnrolledCourse => course !== null)
        setEnrolledCourses(validEnrolledCourses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enrolled courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://127.0.0.1:5000/courses/all_courses")
      if (response.data.success) {
        // Filter out courses that the user is already enrolled in
        const enrolledIds = new Set(enrolledCourses.map(course => course.id))
        const available = response.data.courses.filter((course: Course) => !enrolledIds.has(course.id))
        setAvailableCourses(available)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLessons = async (courseId: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://127.0.0.1:5000/lessons/course_lessons/${courseId}`)
      if (response.data.success) {
        // Get user's completed lessons
        const userDataString = localStorage.getItem('userData')
        if (!userDataString) {
          toast({
            title: "Error",
            description: "User data not found. Please log in again.",
            variant: "destructive"
          })
          return
        }

        const userData: UserData = JSON.parse(userDataString)
        const completedResponse = await axios.get(`http://127.0.0.1:5000/lessons/user_completed_lessons/${userData.id}`)
        
        if (completedResponse.data.success) {
          const completedLessonIds = new Set(completedResponse.data.completed_lessons.map((l: any) => l.id))
          const lessonsWithStatus = response.data.lessons.map((lesson: Lesson) => ({
            ...lesson,
            is_completed: completedLessonIds.has(lesson.id)
          }))
          setLessons(lessonsWithStatus)
        } else {
          setLessons(response.data.lessons)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuests = async (lessonId: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://127.0.0.1:5000/quests/lesson_quests/${lessonId}`)
      if (response.data.success) {
        // Get user's completed quests
        const userDataString = localStorage.getItem('userData')
        if (!userDataString) {
          toast({
            title: "Error",
            description: "User data not found. Please log in again.",
            variant: "destructive"
          })
          return
        }

        const userData: UserData = JSON.parse(userDataString)
        const completedResponse = await axios.get(`http://127.0.0.1:5000/quests/completed/${userData.id}`)
        
        if (completedResponse.data.success) {
          const completedQuestIds = new Set(completedResponse.data.completed_quests.map((q: any) => q.id))
          const questsWithStatus = response.data.quests.map((quest: Quest) => ({
            ...quest,
            is_completed: completedQuestIds.has(quest.id)
          }))
          setQuests(questsWithStatus)
        } else {
          setQuests(response.data.quests)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quests",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuestQuestions = async (questId: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://127.0.0.1:5000/questions/quest_questions/${questId}`)
      if (response.data.success) {
        setQuestions(response.data.questions)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, selectedOption: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }))
  }

  const handleSubmitAnswers = async () => {
    if (!selectedQuest) return

    try {
      setIsSubmitting(true)
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        question_id: parseInt(questionId),
        selected_option: selectedOption
      }))

      const response = await axios.post('http://127.0.0.1:5000/questions/submit_quest', {
        quest_id: selectedQuest.id,
        answers,
        time_taken_seconds: selectedQuest.time_duration_minutes * 60 // Convert minutes to seconds
      })

      if (response.data.success) {
        const { correct_answers, total_questions, percentage, passed, exp_gained } = response.data
        
        if (passed) {
          toast({
            title: "Quest Completed!",
            description: `You got ${correct_answers} out of ${total_questions} questions correct (${percentage.toFixed(1)}%) and earned ${exp_gained} XP!`,
          })

          // Refresh the course data to update progress
          fetchUserEnrollments()
        } else {
          toast({
            title: "Quest Failed",
            description: `You got ${correct_answers} out of ${total_questions} questions correct (${percentage.toFixed(1)}%). Need 70% to pass. Try again!`,
            variant: "destructive"
          })
        }

        setIsViewQuestOpen(false)
        setSelectedQuest(null)
        setQuestions([])
        setSelectedAnswers({})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answers",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLessonComplete = async () => {
    if (!selectedLesson) return

    try {
      setIsSubmitting(true)
      const response = await axios.post(`http://127.0.0.1:5000/lessons/mark_completed_lesson/${selectedLesson.id}`)

      if (response.data.success) {
        const { exp_gained, coins_gained, course_progress } = response.data
        
        toast({
          title: "Lesson Completed!",
          description: `You earned ${exp_gained} XP and ${coins_gained} coins!`,
        })

        // Refresh the course data to update progress
        fetchUserEnrollments()
        
        setIsViewLessonOpen(false)
        setSelectedLesson(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete lesson",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchUserEnrollments()
  }, [])

  useEffect(() => {
    fetchAvailableCourses()
  }, [enrolledCourses])

  const filterCourses = <T extends Course>(courses: T[]) => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || course.interest_tags.includes(parseInt(categoryFilter))
      return matchesSearch && matchesCategory
    })
  }

  const inProgressCourses = enrolledCourses.filter(course => !course.is_completed)
  const completedCourses = enrolledCourses.filter(course => course.is_completed)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Courses</h1>
                <p className="text-muted-foreground mt-1">Manage and explore your learning journey</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search courses..." 
                    className="pl-8 bg-background border-muted"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  defaultValue="all"
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="1">Web Development</SelectItem>
                    <SelectItem value="2">Mobile Development</SelectItem>
                    <SelectItem value="3">UI/UX Design</SelectItem>
                    <SelectItem value="4">Data Science</SelectItem>
                    <SelectItem value="5">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Courses ({inProgressCourses.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
                <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCourses(inProgressCourses).map((course, index) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={course.thumbnail_url || getRandomUnsplashImage(index)} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration_hours}h</span>
                            <span className="text-white/60">•</span>
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lesson_count} lessons</span>
                            <span className="text-white/60">•</span>
                            <Trophy className="h-4 w-4" />
                            <span>{course.quest_count} quests</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-sm text-muted-foreground">Course Progress</div>
                              <div className="text-sm font-medium">{course.progress_percentage.toFixed(1)}%</div>
                            </div>
                            <Progress value={course.progress_percentage} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Lessons Completed</div>
                              <div className="font-medium">{course.completed_lessons} / {course.lesson_count}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Quests Completed</div>
                              <div className="font-medium">{course.completed_quests} / {course.quest_count}</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Level {course.difficulty_level}</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            className="flex-1" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Lessons
                          </Button>
                          <Button 
                            className="flex-1 bg-indigo-700 hover:bg-purple-900"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  {filterCourses(inProgressCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No active courses found. Start learning by enrolling in a course!
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCourses(completedCourses).map((course, index) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={course.thumbnail_url || getRandomUnsplashImage(index)} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500">Completed</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration_hours}h</span>
                            <span className="text-white/60">•</span>
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lesson_count} lessons</span>
                            <span className="text-white/60">•</span>
                            <Trophy className="h-4 w-4" />
                            <span>{course.quest_count} quests</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div className="text-sm">
                              <span className="font-medium">Completed on </span>
                              <span className="text-muted-foreground">
                                {new Date(course.completion_date!).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            className="flex-1" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Lessons
                          </Button>
                          <Button 
                            className="flex-1"
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            View Achievements
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  {filterCourses(completedCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No completed courses yet. Keep learning!
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCourses(availableCourses).map((course, index) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <img 
                          src={course.thumbnail_url || getRandomUnsplashImage(index + inProgressCourses.length + completedCourses.length)} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="font-semibold text-lg line-clamp-1">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration_hours} hours</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lesson_count} lessons</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-2">
                        <div className="flex gap-2 w-full">
                          <Button 
                            className="flex-1" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Lessons
                          </Button>
                          <Button 
                            className="flex-1 bg-indigo-700 hover:bg-purple-900"
                            onClick={() => {
                              setSelectedCourse(course)
                              fetchLessons(course.id)
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            View Quests
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  {filterCourses(availableCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No available courses found. Check back later for new courses!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* View Lessons Dialog */}
          <Dialog open={!!selectedCourse && !isViewQuestOpen} onOpenChange={(open) => {
            if (!open) {
              setSelectedCourse(null)
              setSelectedLesson(null)
            }
          }}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedCourse?.title} - Lessons</DialogTitle>
                <DialogDescription>
                  View and learn from the course lessons
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <Card 
                    key={lesson.id} 
                    className={`hover:bg-muted/50 transition-colors cursor-pointer ${lesson.is_completed ? 'bg-muted/20' : ''}`}
                    onClick={() => {
                      setSelectedLesson(lesson)
                      setIsViewLessonOpen(true)
                      fetchQuests(lesson.id)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {lesson.is_completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div>
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">Lesson {lesson.order_number}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{lesson.coins_reward} Coins</Badge>
                          {lesson.quest_count > 0 && (
                            <Badge variant="secondary">{lesson.quest_count} Quests</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* View Lesson Content Dialog */}
          <Dialog open={isViewLessonOpen} onOpenChange={(open) => {
            if (!open) {
              setIsViewLessonOpen(false)
              setSelectedLesson(null)
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedLesson?.title}</DialogTitle>
                <DialogDescription>
                  Lesson Content and Quests
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Lesson Content</TabsTrigger>
                  <TabsTrigger value="quests">Quests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedLesson?.content_html || '' }} />
                    </div>
                    {selectedLesson?.video_url && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Video</h4>
                        <div className="aspect-video">
                          <iframe 
                            src={selectedLesson.video_url}
                            className="w-full h-full" 
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      </div>
                    )}
                    {selectedLesson?.pdf_notes_url && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">PDF Notes</h4>
                        <object
                          data={selectedLesson.pdf_notes_url}
                          type="application/pdf"
                          className="w-full h-[500px]"
                        >
                          <p>Unable to display PDF. <a href={selectedLesson.pdf_notes_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download PDF</a></p>
                        </object>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex gap-2">
                        <Badge variant="outline">{selectedLesson?.coins_reward} Coins</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsViewLessonOpen(false)
                          setSelectedLesson(null)
                        }}>Close</Button>
                        <Button 
                          className="bg-indigo-700 hover:bg-purple-900"
                          onClick={handleLessonComplete}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Completing..." : "Complete Lesson"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quests">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium">Complete all quests to finish this lesson!</p>
                    </div>
                    {quests.map((quest) => (
                      <Card 
                        key={quest.id} 
                        className={`hover:bg-muted/50 transition-colors cursor-pointer ${quest.is_completed ? 'bg-muted/20' : ''}`}
                        onClick={() => {
                          if (!quest.is_completed) {
                            setSelectedQuest(quest)
                            setIsViewQuestOpen(true)
                            fetchQuestQuestions(quest.id)
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {quest.is_completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div>
                                <h4 className="font-semibold">{quest.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{quest.coins_reward} Coins</Badge>
                              <Badge>{quest.question_count} Questions</Badge>
                              <Badge variant="secondary">{quest.time_duration_minutes} mins</Badge>
                              {quest.is_completed && (
                                <Badge className="bg-green-500">Completed</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {quests.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        No quests available for this lesson yet.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* View Quest Dialog */}
          <Dialog open={isViewQuestOpen} onOpenChange={(open) => {
            if (!open) {
              setIsViewQuestOpen(false)
              setSelectedQuest(null)
              setQuestions([])
              setSelectedAnswers({})
            }
          }}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedQuest?.title}</DialogTitle>
                <DialogDescription>
                  Complete this quest to earn {selectedQuest?.coins_reward} Coins
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Quest Details:</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Time Limit: {selectedQuest?.time_duration_minutes} minutes</li>
                    <li>Total Questions: {selectedQuest?.question_count}</li>
                    <li>Passing Score: 70%</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <p className="font-medium">Question {index + 1}: {question.question_text}</p>
                      <div className="space-y-2">
                        {[question.option_1, question.option_2, question.option_3, question.option_4].map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
                            <input 
                              type="radio" 
                              name={`question-${question.id}`} 
                              value={optionIndex + 1}
                              checked={selectedAnswers[question.id] === optionIndex + 1}
                              onChange={() => handleAnswerSelect(question.id, optionIndex + 1)}
                              className="text-indigo-500 focus:ring-indigo-500"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsViewQuestOpen(false)
                  setSelectedQuest(null)
                  setQuestions([])
                  setSelectedAnswers({})
                }}>Cancel</Button>
                <Button 
                  className="bg-indigo-700 hover:bg-purple-900"
                  onClick={handleSubmitAnswers}
                  disabled={isSubmitting || Object.keys(selectedAnswers).length !== questions.length}
                >
                  {isSubmitting ? "Submitting..." : "Submit Answers"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}

