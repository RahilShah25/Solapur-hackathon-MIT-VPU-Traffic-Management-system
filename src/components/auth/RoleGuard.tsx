"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface RoleGuardProps {
    children: React.ReactNode
    roles?: ("citizen" | "police" | "admin" | "parking_owner")[]
}

export default function RoleGuard({ children, roles = [] }: RoleGuardProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = React.useState(false)

    React.useEffect(() => {
        if (isLoading) return

        // If not logged in, redirect to login
        if (!user) {
            router.push("/login")
            return
        }

        // If specific roles are required, check them
        // If specific roles are required, check them
        if (roles.length > 0 && user.role && !roles.includes(user.role)) {
            // Redirect to unauthorized or home
            // alert("Unauthorized access. Redirecting to home.") // Removing alert for smoother UX
            router.push("/")
            // console.log("Unauthorized access blocked for role:", user.role)
            return
        }

        setIsAuthorized(true)
    }, [user, roles, router, isLoading])

    if (isLoading || !isAuthorized) {
        return (
            <div className="container p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[300px] w-full" />
                <p className="text-center text-muted-foreground">Verifying access rights...</p>
            </div>
        )
    }

    return <>{children}</>
}
