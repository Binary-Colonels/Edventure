import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Clock, BookOpen } from "lucide-react"

interface CourseCardProps {
  title: string
  instructor: string
  progress: number
  image: string
  lessons: number
  duration: string
}

export default function CourseCard({ title, instructor, progress, image, lessons, duration }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all dashboard-card group hover:border-primary/30">
      <div className="relative h-48 w-full">
        <Image 
          src={image || "/placeholder.svg"} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        {progress > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            In Progress
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">Instructor: {instructor}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary/70" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{duration}</span>
          </div>
        </div>
        {progress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary" indicatorClassName="bg-primary" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow active:scale-[0.98]">
          {progress > 0 ? "Continue Learning" : "Start Course"}
        </button>
      </CardFooter>
    </Card>
  )
}

