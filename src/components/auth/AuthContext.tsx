"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type UserRole = "citizen" | "police" | "admin" | "parking_owner" | null

interface User {
    name: string
    role: UserRole
    points?: number
    details?: Record<string, unknown> // For storing role-specific data like vehicleNo, badgeNo, etc.
}

interface AuthContextType {
    user: User | null
    login: (name: string, role: UserRole, details?: Record<string, unknown>) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem("solapur_user")
        if (storedUser) {
            // eslint-disable-next-line
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (name: string, role: UserRole, details?: Record<string, unknown>) => {
        const newUser = { name, role, points: role === "citizen" ? 100 : undefined, details }
        setUser(newUser)
        localStorage.setItem("solapur_user", JSON.stringify(newUser))

        // Redirect based on role
        if (role === "police" || role === "admin") router.push("/admin")
        else if (role === "parking_owner") router.push("/parking/register")
        else router.push("/profile")
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("solapur_user")
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
