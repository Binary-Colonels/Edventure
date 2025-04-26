import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Clock, BookOpen, Play } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface CourseCardProps {
  id: number
  title: string
  description: string
  progress: number
  image: string
}

export default function CourseCard({ 
  id,
  title, 
  description,
  progress, 
  image
}: CourseCardProps) {
  const { toast } = useToast()

  const handleEnrollment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/enrollments/enroll_to_course', {
        course_id: id
      })

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Successfully enrolled in the course",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to enroll in the course",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover" 
          priority
        />
        {progress > 0 && progress < 100 && (
          <div className="absolute top-2 right-2 bg-indigo-700 text-white text-xs font-medium px-2 py-1 rounded-full">
            In Progress
          </div>
        )}
        {progress === 100 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Completed
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-semibold text-lg line-clamp-1">{title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button 
          className="w-full py-2 bg-indigo-700 hover:bg-purple-900 text-white rounded-md text-sm font-medium transition-colors"
          onClick={handleEnrollment}
        >
          {progress === 0 ? "Start Course" : progress === 100 ? "Review Course" : "Continue Learning"}
        </Button>
      </CardFooter>
    </Card>
  )
}


