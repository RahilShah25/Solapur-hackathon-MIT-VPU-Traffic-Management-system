"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShieldAlert, Map, Car, LayoutDashboard, Home, Receipt, Zap, LogOut, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/layout/Logo"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthContext"
import { Badge } from "@/components/ui/badge"

const navItems = [
    { name: "Home", href: "/", icon: Home, roles: ["all"] },
    { name: "Traffic Map", href: "/traffic-map", icon: Map, roles: ["all"] },
    { name: "Report Violation", href: "/report", icon: ShieldAlert, roles: ["citizen", "police", "admin"] },
    { name: "Parking", href: "/parking", icon: Car, roles: ["all"] },
    { name: "My Fines", href: "/fines", icon: Receipt, roles: ["citizen"] },
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin", "police"] },
    { name: "SOS / Emergency", href: "/sos", icon: Phone, roles: ["police", "citizen"] },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "police": return "bg-blue-600 hover:bg-blue-700"
            case "admin": return "bg-red-600 hover:bg-red-700"
            case "parking_owner": return "bg-orange-500 hover:bg-orange-600"
            default: return "bg-green-600 hover:bg-green-700"
        }
    }

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6 py-4",
            scrolled ? "pt-2" : "pt-4"
        )}>
            <div className={cn(
                "mx-auto max-w-7xl rounded-2xl border border-white/20 shadow-lg backdrop-blur-xl transition-all duration-300",
                scrolled ? "bg-background/80 supports-[backdrop-filter]:bg-background/60" : "bg-background/50",
                "px-4 py-2"
            )}>
                <div className="flex items-center justify-between h-12">
                    {/* Logo Area */}
                    {/* Logo Area */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-white/10">
                        {navItems.filter(item => {
                            if (item.roles.includes("all")) return true
                            if (!user) return false
                            return item.roles.includes(user.role as string)
                        }).map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-background rounded-full shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={cn(
                                        "relative z-10 flex items-center gap-2",
                                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}>
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                                <Link href="/profile" className="text-right hidden lg:block hover:opacity-80 transition-opacity">
                                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{user.role}</p>
                                </Link>
                                <Link href="/profile">
                                    <Badge className={cn("capitalize px-2 py-1 shadow-md cursor-pointer hover:opacity-80", getRoleBadgeColor(user.role as string))}>
                                        {user.role === "police" ? "Officer" : user.role}
                                    </Badge>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden lg:inline">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="default" size="sm" className="rounded-full px-6 shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-foreground/70"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 left-4 right-4 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border shadow-2xl md:hidden z-50"
                    >
                        <div className="flex flex-col space-y-2">
                            {navItems.filter(item => {
                                if (item.roles.includes("all")) return true
                                if (!user) return false
                                return item.roles.includes(user.role as string)
                            }).map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all",
                                        pathname === item.href ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        pathname === item.href ? "bg-primary/20" : "bg-muted"
                                    )}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    {item.name}
                                </Link>
                            ))}
                            <div className="h-px bg-border my-2" />
                            {user ? (
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{user.name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={logout} className="text-destructive gap-2">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full rounded-xl">Login</Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
