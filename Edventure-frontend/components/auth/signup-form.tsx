"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

const studentFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    interests: z.array(z.number()).min(1, { message: "Please select at least one interest" }),
    qualification: z.string().min(1, { message: "Please select your education level" }),
    institute_company: z.string().min(1, { message: "Please enter your institution" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const mentorFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    specialization: z.string().min(1, { message: "Please enter your specialization" }),
    experience: z.string().min(1, { message: "Please select your experience level" }),
    institute_company: z.string().min(1, { message: "Please enter your institution" }),
    qualification: z.literal("mentor"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Updated to match the backend schema
const educationLevelOptions = [
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "post_graduate", label: "Post Graduate" },
  { value: "working_professional", label: "Working Professional" },
  { value: "mentor", label: "Mentor" },
]

const experienceLevelOptions = [
  { value: "1-3", label: "1-3 years" },
  { value: "4-6", label: "4-6 years" },
  { value: "7-10", label: "7-10 years" },
  { value: "10+", label: "10+ years" },
]

interface Interest {
  id: number
  name: string
  description: string
}

export default function SignupForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<"student" | "mentor">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [interests, setInterests] = useState<Interest[]>([])

  useEffect(() => {
    // Fetch all areas of interest from backend
    const fetchInterests = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/areas_of_interest/get_all_aoi")
        const data = await response.json()
        
        if (data.success && data.interests) {
          setInterests(data.interests)
        }
      } catch (err) {
        console.error("Error fetching interests:", err)
      }
    }

    fetchInterests()
  }, [])

  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      interests: [],
      qualification: "",
      institute_company: "",
    },
  })

  const mentorForm = useForm<z.infer<typeof mentorFormSchema>>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      experience: "",
      institute_company: "",
      qualification: "mentor",
    },
  })

  async function onStudentSubmit(values: z.infer<typeof studentFormSchema>) {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("http://127.0.0.1:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          password: values.password,
          role: "student",
          qualification: values.qualification,
          institute_company: values.institute_company,
          interests: values.interests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.success) {
        // Navigate to login page after successful registration
        router.push("/login")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  async function onMentorSubmit(values: z.infer<typeof mentorFormSchema>) {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("http://127.0.0.1:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          password: values.password,
          role: "admin", // Use admin role for mentors
          qualification: "mentor",
          institute_company: values.institute_company,
          interests: [], // Mentors don't have interests in this schema
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.success) {
        // Navigate to login page after successful registration
        router.push("/login")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <span className="text-3xl font-bold text-indigo-500">Edventure</span>
        </div>
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          defaultValue="student"
          className="w-full"
          onValueChange={(value) => setUserType(value as "student" | "mentor")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="mentor">Mentor</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="student">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                <FormField
                  control={studentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {educationLevelOptions.filter(option => option.value !== "mentor").map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="institute_company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University or Organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormMessage />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {interests.map((interest) => (
                          <FormField
                            key={interest.id}
                            control={studentForm.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem key={interest.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(interest.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, interest.id])
                                          : field.onChange(field.value?.filter((value) => value !== interest.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{interest.name}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-700 hover:bg-purple-900"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Student Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="mentor">
            <Form {...mentorForm}>
              <form onSubmit={mentorForm.handleSubmit(onMentorSubmit)} className="space-y-4">
                <FormField
                  control={mentorForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development, Data Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mentorForm.control}
                  name="institute_company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University or Organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-700 hover:bg-purple-900"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Mentor Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

