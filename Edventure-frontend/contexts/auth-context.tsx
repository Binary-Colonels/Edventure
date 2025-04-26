"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: string
  qualification: string
  institute_company: string
  coins: number
  rank: number
  interests?: Array<{
    id: number
    name: string
    description: string
  }>
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  fetchUserProfile: () => Promise<void>
  isMentor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Determine if user is a mentor (role can be admin or qualification mentor)
  const isMentor = user?.role === "admin" || user?.qualification === "mentor"

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("userData")
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      fetchUserProfile() // Refresh user data
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await fetch("http://127.0.0.1:5000/users/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userData", JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  const fetchUserProfile = async (): Promise<void> => {
    if (!token) return
    
    try {
      const response = await fetch("http://127.0.0.1:5000/users/get_profile", {
        headers: {
          Authorization: token,
        },
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("userData", JSON.stringify(data.user))
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    fetchUserProfile,
    isMentor
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 