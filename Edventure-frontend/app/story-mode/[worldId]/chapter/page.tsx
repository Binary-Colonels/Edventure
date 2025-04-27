"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Story Chapter | Edventure Learning Platform",
  description: "Redirecting to SQL Adventure",
}

export default function ChapterPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect all chapter pages to the SQL Adventure
    router.push("/story-mode/sql-adventure")
  }, [router])
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to the SQL Adventure</p>
      </div>
    </div>
  )
}

