"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { FileText, ThumbsUp, ThumbsDown, Trash2, Upload, BookOpenCheck } from "lucide-react"
import axios from "axios"

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  console.log('Token from localStorage:', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Authorization header set to:', config.headers.Authorization)
  }
  return config
})

interface Note {
  id: number
  user_id: number
  username: string
  title: string
  description: string | null
  upvote_count: number
  downvote_count: number
  created_at: string
  has_quiz?: number
}

interface Question {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface Quiz {
  questions: Question[]
}

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isQuizGenerating, setIsQuizGenerating] = useState(false)
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [currentNoteTitle, setCurrentNoteTitle] = useState("")
  const { toast } = useToast()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://127.0.0.1:5000/notes/all")
      if (response.data.success) {
        setNotes(response.data.notes)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      toast({
        title: "Error",
        description: "Please select a PDF file",
        variant: "destructive"
      })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      console.log("Starting upload process...")
      console.log("File:", selectedFile.name, "Size:", selectedFile.size, "Type:", selectedFile.type)
      
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("pdf_file", selectedFile)
      
      console.log("Form data created, sending request...")
      
      const response = await axios.post("http://127.0.0.1:5000/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      
      console.log("Response received:", response.status, response.data)

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Note uploaded successfully! You earned ${response.data.points_earned} points.`
        })
        setIsUploadDialogOpen(false)
        setTitle("")
        setDescription("")
        setSelectedFile(null)
        fetchNotes()
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Upload failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error uploading note:", error)
      console.error("Error details:", error.response?.data || error.message)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload note",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (noteId: number, voteType: "up" | "down") => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/notes/${noteId}/vote`, {
        vote_type: voteType
      })

      if (response.data.success) {
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (noteId: number) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/notes/${noteId}`)
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Note deleted successfully"
        })
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      })
    }
  }

  const handleDownload = async (noteId: number, title: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/notes/download/${noteId}`, {
        responseType: "blob"
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download note",
        variant: "destructive"
      })
    }
  }

  // Generate quiz from note
  const handleGenerateQuiz = async (noteId: number, noteTitle: string) => {
    try {
      setIsQuizGenerating(true)
      setCurrentNoteTitle(noteTitle)
      
      const response = await axios.get(`http://127.0.0.1:5000/notes/generate_quiz/${noteId}`)
      
      if (response.data.success) {
        setCurrentQuiz(response.data.quiz)
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
        setIsQuizDialogOpen(true)
        
        // Update notes to reflect that this note now has a quiz
        const updatedNotes = notes.map(note => 
          note.id === noteId ? { ...note, has_quiz: 1 } : note
        )
        setNotes(updatedNotes)
        
        toast({
          title: "Success",
          description: "Quiz generated successfully!"
        })
      }
    } catch (error) {
      console.error("Quiz generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate quiz",
        variant: "destructive"
      })
    } finally {
      setIsQuizGenerating(false)
    }
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleNextQuestion = () => {
    if (!currentQuiz) return
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
    } else {
      // Quiz completed
      toast({
        title: "Quiz Completed",
        description: "Congratulations on completing the quiz!"
      })
      setIsQuizDialogOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notes</h1>
                <p className="text-muted-foreground mt-1">Share and discover study notes</p>
              </div>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" /> Upload Note
              </Button>
            </div>

            {isLoading && notes.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notes available</h3>
                <p className="text-muted-foreground">Upload your first note to start sharing</p>
                <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Note
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{note.title}</span>
                        {note.has_quiz === 1 && <BookOpenCheck className="h-5 w-5 text-green-500" aria-label="Has Quiz" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {note.description || "No description provided"}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>By {note.username}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVote(note.id, "up")}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{note.upvote_count}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVote(note.id, "down")}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          <span>{note.downvote_count}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-x-1">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleGenerateQuiz(note.id, note.title)}
                          disabled={isQuizGenerating}
                        >
                          {isQuizGenerating ? "Generating..." : (note.has_quiz === 1 ? "Take Quiz" : "Generate Quiz")}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(note.id, note.title)}
                        >
                          Download
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF Note</DialogTitle>
            <DialogDescription>
              Share your study notes with other students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title for your note"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                PDF File *
              </label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz: {currentNoteTitle}</DialogTitle>
            <DialogDescription>
              Question {currentQuestionIndex + 1} of {currentQuiz?.questions.length}
            </DialogDescription>
          </DialogHeader>
          {currentQuiz && currentQuiz.questions.length > 0 && (
            <div className="space-y-4">
              <div className="text-lg font-medium">
                {currentQuiz.questions[currentQuestionIndex].question}
              </div>
              <div className="space-y-2">
                {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-md border ${
                      selectedOption === option
                        ? selectedOption === currentQuiz.questions[currentQuestionIndex].correctAnswer
                          ? "bg-green-100 border-green-300"
                          : "bg-red-100 border-red-300"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={selectedOption !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {selectedOption && (
                <div className={`p-3 rounded-md ${
                  selectedOption === currentQuiz.questions[currentQuestionIndex].correctAnswer
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className="font-medium mb-1">
                    {selectedOption === currentQuiz.questions[currentQuestionIndex].correctAnswer
                      ? "✓ Correct!"
                      : `✗ Incorrect. The correct answer is: ${currentQuiz.questions[currentQuestionIndex].correctAnswer}`}
                  </div>
                  <div className="text-sm">
                    {currentQuiz.questions[currentQuestionIndex].explanation}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsQuizDialogOpen(false)}
            >
              Close
            </Button>
            {selectedOption && (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 