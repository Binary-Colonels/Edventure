import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Course {
  id: number
  name: string
  progress: number
}

interface ProgressCardProps {
  title: string
  percentage: number
  courses: Course[]
}

export default function ProgressCard({ title, percentage, courses }: ProgressCardProps) {
  // Function to determine color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'text-red-500';
    if (progress < 70) return 'text-amber-500';
    return 'text-green-500';
  };
  
  return (
    <Card className="dashboard-card hover:border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <span className="bg-primary/10 w-2 h-6 rounded-full mr-2"></span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-muted/30 stroke-current"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${percentage * 2.51} 251.2`}
                  strokeDashoffset="0"
                >
                  <animate 
                    attributeName="stroke-dasharray" 
                    from="0 251.2" 
                    to={`${percentage * 2.51} 251.2`} 
                    dur="1s" 
                    fill="freeze" 
                  />
                </circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">{percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{course.name}</span>
                  <span className={getProgressColor(course.progress)}>{course.progress}%</span>
                </div>
                <Progress 
                  value={course.progress} 
                  className="h-2 bg-secondary" 
                  indicatorClassName={
                    course.progress < 30 ? "bg-red-500" : 
                    course.progress < 70 ? "bg-amber-500" : 
                    "bg-green-500"
                  } 
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

