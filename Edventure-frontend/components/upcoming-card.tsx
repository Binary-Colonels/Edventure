import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Lesson {
  id: number
  title: string
  time: string
  date: string
}

interface UpcomingCardProps {
  title: string
  lessons: Lesson[]
}

export default function UpcomingCard({ title, lessons }: UpcomingCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-start gap-3">
              <div className="min-w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center font-medium">
                {lesson.date.substring(0, 1)}
              </div>
              <div>
                <h4 className="font-medium line-clamp-1">{lesson.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {lesson.time} · {lesson.date}
                </p>
              </div>
            </div>
          ))}

          {lessons.length === 0 && <div className="text-center py-4 text-muted-foreground">No upcoming items</div>}
        </div>
      </CardContent>
    </Card>
  )
}

