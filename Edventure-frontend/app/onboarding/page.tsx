import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Coins, GraduationCap, MessageSquare, Trophy, Users, Sparkles, Target, Lightbulb, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Onboarding() {
  return (
    <>
      <Head>
        <link rel="icon" href="/assets/logo1.png" />
        <title>Edventure - Where Learning Meets Innovation</title>
      </Head>
      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <div className="relative h-[60vh] min-h-[600px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="Education Banner"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <Image
                    src="/assets/logo1.png"
                    alt="Edventure Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-8xl font-bold text-[#6366F1] flex items-center">
                  Edventure
                </h1>
              </div>
              <p className="text-3xl font-light mb-8 max-w-3xl">
                Where Learning Meets Innovation
              </p>
              <p className="text-xl text-gray-200 max-w-2xl mb-12">
                Embark on a transformative educational journey with cutting-edge AI technology and immersive learning experiences
              </p>
              <div className="flex gap-6">
                <Link href="/login">
                  <Button size="lg" className="gap-2 bg-[#6366F1] hover:bg-[#7C3AED] text-white px-8">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section with Image */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-purple-900 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">The Future of Learning</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Transform Your Learning Journey with <span className="text-indigo-500">Edventure</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-8">
                Experience education like never before with AI-powered personalization, gamified learning, and an engaging community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="gap-2 w-full sm:w-auto bg-[#6366F1] hover:bg-[#7C3AED] text-white">
                    Start Learning Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Students collaborating"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-500 mb-2">10K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-500 mb-2">500+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-500 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-500 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Edventure?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Experience a revolutionary learning platform that combines cutting-edge technology with proven educational methods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Brain className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Learning</h3>
              </div>
              <p className="text-gray-600">
                Personalized learning paths and intelligent tutoring powered by Gemini AI.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Coins className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">Gamification</h3>
              </div>
              <p className="text-gray-600">
                Earn EDUCOINS, level up, and unlock achievements as you learn.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">Story Mode</h3>
              </div>
              <p className="text-gray-600">
                Engage with narrative-driven learning experiences and quest-based progression.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">Community Learning</h3>
              </div>
              <p className="text-gray-600">
                Connect with peers, participate in discussions, and learn together.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">Contests & Challenges</h3>
              </div>
              <p className="text-gray-600">
                Test your skills in coding challenges and compete with others.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold">Comprehensive Courses</h3>
              </div>
              <p className="text-gray-600">
                Access high-quality content with interactive lessons and assignments.
              </p>
            </Card>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-full md:w-1/2 h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  alt="Student success story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Join Our Success Story</h2>
                <p className="text-gray-600 mb-6">
                  "Edventure transformed my learning experience. The AI-powered personalization and gamification made learning fun and effective. I've achieved more in 3 months than I did in a year of traditional learning."
                </p>
                <div className="font-semibold">- Sarah Johnson, Computer Science Student</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Edventure</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're on a mission to revolutionize education through technology and innovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B00]/10 mb-4">
                <Target className="h-8 w-8 text-[#6366F1]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To make quality education accessible to everyone through innovative technology and personalized learning experiences.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B00]/10 mb-4">
                <Lightbulb className="h-8 w-8 text-[#6366F1]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading platform that transforms traditional education into an engaging, personalized journey of discovery.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B00]/10 mb-4">
                <Heart className="h-8 w-8 text-[#6366F1]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-gray-600">
                Innovation, accessibility, and student success are at the heart of everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-[#FF6B00]/5 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already experiencing the future of education.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#6366F1] hover:bg-[#7C3AED] text-white">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 