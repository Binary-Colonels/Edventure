"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { Menu, Bell, LogOut, Settings, User, HelpCircle } from "lucide-react"

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navigateToProfile = () => {
    router.push(user?.role === "mentor" ? "/mentor/profile" : "/profile")
  }

  // Get initials from username for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  const handleSignOut = () => {
    // Clear auth token and user data from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    
    // Redirect to onboarding page
    router.push("/onboarding")
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 h-16 flex items-center px-4 md:px-6 shadow-sm">
      <div className="flex-1 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          className="relative rounded-full overflow-hidden p-0 hover:bg-primary/10" 
          onClick={navigateToProfile}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-white">{user?.username ? getInitials(user.username) : "U"}</AvatarFallback>
          </Avatar>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl shadow-lg border-primary/10" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username || "Guest"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                <p className="text-xs leading-none text-primary mt-1 capitalize">{user?.role || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={navigateToProfile} className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(user?.role === "mentor" ? "/mentor/settings" : "/settings")} className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" /> Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <HelpCircle className="h-4 w-4" /> Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="hover:bg-primary/10 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-indigo-700 hover:text-purple-900 hover:bg-purple-900/10"
        >
          <LogOut className="h-5 w-5 text-indigo-700 hover:text-purple-900" />
        </Button>

      </div>
    </header>
  )
}

