"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Car, Clock, AlertCircle, LogOut, Ticket, CircleSlash, CheckCircle2, ScanIcon, Bell, Megaphone, RefreshCw, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ParkingDashboardPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [parkedVehicles, setParkedVehicles] = React.useState<any[]>([])
    const [stats, setStats] = React.useState({ total: 0, parked: 0, available: 0 })
    const [isFullOverride, setIsFullOverride] = React.useState(false)

    // Verify access
    React.useEffect(() => {
        if (!user || (user.role !== "parking_owner" && user.role !== "admin")) {
            // router.push("/profile")
        }
    }, [user, router])

    // Load Data
    React.useEffect(() => {
        loadData()

        // Load Override Status
        const status = localStorage.getItem("parking_lot_override_full") === "true"
        setIsFullOverride(status)

        // Poll for updates
        const interval = setInterval(loadData, 5000)
        return () => clearInterval(interval)
    }, [])

    const loadData = () => {
        const storedTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")
        const active = storedTickets.filter((t: any) => t.status === "Parked")
        active.sort((a: any, b: any) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())

        setParkedVehicles(active)

        // Mock Capacity
        const capacity = 50
        setStats({
            total: capacity,
            parked: active.length,
            available: Math.max(0, capacity - active.length)
        })
    }

    const handleForceExit = (ticketId: string) => {
        const storedTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")
        const index = storedTickets.findIndex((t: any) => t.ticketId === ticketId)

        if (index >= 0) {
            storedTickets[index].status = "Completed"
            storedTickets[index].checkOutTime = new Date().toISOString()
            localStorage.setItem("solapur_parking_tickets", JSON.stringify(storedTickets))

            // Notify Logic
            if (isFullOverride) {
                // If it was full, and we just freed a spot, assume we might want to open it
                // For now, just refresh
            }
            // toast.success("Vehicle Checked Out")
            loadData()
        }
    }

    const toggleLotStatus = (checked: boolean) => {
        setIsFullOverride(checked)
        localStorage.setItem("parking_lot_override_full", String(checked))

        if (!checked) {
            // If switching TO "OPEN" (checked = false means NOT FULL)
            // Trigger notification
            setTimeout(() => {
                toast.info("📢 NOTICE SENT", { description: "All waiting users have been notified that parking is now available!" })
            }, 500)
        }
    }

    const [isRefreshing, setIsRefreshing] = React.useState(false)
    const [rate, setRate] = React.useState("40")

    const handleRefresh = () => {
        setIsRefreshing(true)
        loadData()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/parking-bg.jpg)' }} />
            <div className="absolute inset-0 bg-background/90 pointer-events-none" />

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Parking Manager</h1>
                            <p className="text-muted-foreground">Manage occupancy, tickets, and revenue.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-medium">Daily Revenue</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-500">₹{stats.parked * parseInt(rate)}</span>
                        </div>

                        <Button variant="outline" size="icon" onClick={handleRefresh}>
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${isFullOverride ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}>
                            <span className="text-sm font-bold">{isFullOverride ? "FULL" : "OPEN"}</span>
                            <Switch
                                checked={isFullOverride}
                                onCheckedChange={toggleLotStatus}
                                className="scale-75 data-[state=checked]:bg-red-600"
                            />
                        </div>

                        {/* Settings Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Lot Settings</DialogTitle>
                                    <DialogDescription>Configure your parking lot parameters.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Hourly Rate (₹)</Label>
                                        <Input value={rate} onChange={(e) => setRate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Capacity</Label>
                                        <Input value={stats.total} disabled className="bg-muted" />
                                        <p className="text-xs text-muted-foreground">Contact support to increase capacity.</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => document.getElementById('close-dialog')?.click()}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button onClick={() => router.push("/parking/scan")}>
                            <ScanIcon className="h-4 w-4 mr-2" />
                            Scan
                        </Button>
                    </div>
                </div>

                {/* Notification Banner */}
                {!isFullOverride && stats.available < 5 && (
                    <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-4 text-yellow-600 dark:text-yellow-500">
                        <Megaphone className="h-5 w-5" />
                        <div>
                            <p className="font-semibold">Approaching Capacity</p>
                            <p className="text-sm">Only {stats.available} slots remaining. Consider marking as FULL.</p>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 underline-offset-4">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/20 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
                            <Car className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.parked} / {stats.total}</div>
                            <p className="text-xs text-muted-foreground">Vehicles currently parked</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/20 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                            <CircleSlash className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stats.available === 0 ? "text-red-500" : "text-green-600"}`}>
                                {stats.available}
                            </div>
                            <p className="text-xs text-muted-foreground">Open spaces ready for booking</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue Estimate</CardTitle>
                            <div className="text-purple-500 font-bold text-xs">₹{rate}/hr</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{stats.parked * parseInt(rate)}</div>
                            <p className="text-xs text-muted-foreground">Generated today</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-200/20 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">Active</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Online</div>
                            <p className="text-xs text-muted-foreground">Notification system running</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Parked Vehicles</h2>
                    </div>

                    {parkedVehicles.length === 0 ? (
                        <Card className="border-dashed py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Car className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Parking Lot is Empty</p>
                            <p className="max-w-xs mx-auto mt-2 text-sm">No vehicles are currently checked into the system. Use the scanner to assign slots.</p>
                            <Button variant="outline" className="mt-6" onClick={() => router.push("/parking/scan")}>
                                Open Scanner
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parkedVehicles.map((ticket) => (
                                <Card key={ticket.ticketId} className="group transition-all hover:shadow-md border-l-4 border-l-purple-500">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge variant="secondary" className="font-mono text-[10px] tracking-wider mb-2">{ticket.ticketId}</Badge>
                                                <CardTitle className="text-xl font-mono tracking-tight">{ticket.vehicleNo}</CardTitle>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground uppercase font-semibold">Slot</span>
                                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{ticket.allocatedSlot || "-"}</span>
                                            </div>
                                        </div>
                                        <CardDescription className="text-xs flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px]">{ticket.vehicleType || "Car"}</Badge>
                                            <span>•</span>
                                            <span className="truncate max-w-[120px]">{ticket.userName || "Guest User"}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-3 space-y-3">
                                        <div className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>Entry</span>
                                            </div>
                                            <span className="font-medium">{new Date(ticket.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full opacity-90 hover:opacity-100"
                                            onClick={() => handleForceExit(ticket.ticketId)}
                                        >
                                            <LogOut className="h-3 w-3 mr-2" /> Force Checkout
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
