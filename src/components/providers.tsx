"use client"

import { AuthProvider } from "@/components/auth/AuthContext"
import { TrafficProvider } from "@/components/traffic/TrafficContext"
import { AdminProvider } from "@/components/admin/AdminContext"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <TrafficProvider>
                <AdminProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </AdminProvider>
            </TrafficProvider>
        </AuthProvider>
    )
}
