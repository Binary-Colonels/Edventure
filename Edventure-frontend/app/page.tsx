"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Coins, GraduationCap, MessageSquare, Trophy, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isMentor, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect based on role
        if (isMentor) {
          router.push("/mentor/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Not authenticated, redirect to onboarding
        router.push("/onboarding")
      }
    }
  }, [isAuthenticated, isLoading, router, isMentor])

  // Show loading while checking auth status
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to <span className="text-primary">IntelliLearn</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mt-6">
              Revolutionizing education through gamification, personalized learning paths, and community engagement.
            </p>
            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
              alt="Learning Experience"
              fill
              className="object-cover rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose IntelliLearn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                alt="AI Learning"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Learning</h3>
            </div>
            <p className="text-muted-foreground">
              Personalized learning paths and intelligent tutoring powered by Gemini AI.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"
                alt="Gamification"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Gamification</h3>
            </div>
            <p className="text-muted-foreground">
              Earn EDUCOINS, level up, and unlock achievements as you learn.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop"
                alt="Story Mode"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Story Mode</h3>
            </div>
            <p className="text-muted-foreground">
              Engage with narrative-driven learning experiences and quest-based progression.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Community Learning"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Community Learning</h3>
            </div>
            <p className="text-muted-foreground">
              Connect with peers, participate in discussions, and learn together.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
                alt="Contests"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Contests & Challenges</h3>
            </div>
            <p className="text-muted-foreground">
              Test your skills in coding challenges and compete with others.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
                alt="Comprehensive Courses"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Comprehensive Courses</h3>
            </div>
            <p className="text-muted-foreground">
              Access high-quality content with interactive lessons and assignments.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/5 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already experiencing the future of education.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

