"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  name: string
  registrationNumber: string
  department: string
  year: string
}

type UserRole = "buyer" | "seller" | null

type AuthContextType = {
  user: User | null
  userRole: UserRole
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

type SignUpData = {
  name: string
  email: string
  password: string
  registrationNumber: string
  department: string
  year: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// This is a mock implementation - in a real app, you would use actual Supabase client
const supabaseClient = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock implementation
      console.log("Signing in with", email, password)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return mock data
      return {
        data: {
          user: {
            id: "user-123",
            email,
          },
          session: {
            access_token: "mock-token",
          },
        },
        error: null,
      }
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Mock implementation
      console.log("Signing up with", email, password)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return mock data
      return {
        data: {
          user: {
            id: "user-123",
            email,
          },
          session: {
            access_token: "mock-token",
          },
        },
        error: null,
      }
    },
    signOut: async () => {
      // Mock implementation
      console.log("Signing out")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { error: null }
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      // In a real app, you would check the Supabase session here
      const storedUser = localStorage.getItem("loop-user")
      const storedRole = localStorage.getItem("loop-role") as UserRole

      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setUserRole(storedRole)
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // In a real app, you would fetch user profile data here
      const mockUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: "John Doe",
        registrationNumber: "2023CS001",
        department: "Computer Science",
        year: "3",
      }

      // Mock role - in a real app, this would come from the database
      const role: UserRole = "buyer"

      setUser(mockUser)
      setUserRole(role)

      // Store in localStorage for persistence (in a real app, you'd rely on Supabase session)
      localStorage.setItem("loop-user", JSON.stringify(mockUser))
      localStorage.setItem("loop-role", role)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: SignUpData) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseClient.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (error) throw error

      // In a real app, you would store additional user data in a profiles table
      const newUser: User = {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        registrationNumber: userData.registrationNumber,
        department: userData.department,
        year: userData.year,
      }

      setUser(newUser)
      setUserRole(userData.role)

      // Store in localStorage for persistence
      localStorage.setItem("loop-user", JSON.stringify(newUser))
      localStorage.setItem("loop-role", userData.role)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabaseClient.auth.signOut()

      if (error) throw error

      setUser(null)
      setUserRole(null)

      // Clear localStorage
      localStorage.removeItem("loop-user")
      localStorage.removeItem("loop-role")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        signIn,
        signUp,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
