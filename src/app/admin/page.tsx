"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, Car, Users, Zap } from "lucide-react"
import RoleGuard from "@/components/auth/RoleGuard"
import { useAuth } from "@/components/auth/AuthContext"

export default function AdminDashboard() {
    const { user } = useAuth()
    return (
        <RoleGuard roles={["admin", "police"]}>
            <div className="container px-4 pt-28 pb-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
                            <Zap className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24/24</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Violations Today</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">142</div>
                            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Parking Occupancy</CardTitle>
                            <Car className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">78%</div>
                            <p className="text-xs text-muted-foreground">High demand in Market area</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Officers</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">On patrol</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Grid */}
                <h2 className="text-xl font-semibold mb-4">Management Modules</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/signals">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" /> Signal Management
                                </CardTitle>
                                <CardDescription>Analyze traffic flow and control signals.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/admin/violations">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Review Violations
                                </CardTitle>
                                <CardDescription>Verify user reports and issue fines.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    {/* Admins & Police can see Parking Approvals */}
                    {(user?.role === "admin" || user?.role === "police") && (
                        <Link href="/admin/parking">
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5" /> Parking Approvals
                                    </CardTitle>
                                    <CardDescription>Verify new parking spot registrations.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    )}
                </div>
            </div>
        </RoleGuard>
    )
}
