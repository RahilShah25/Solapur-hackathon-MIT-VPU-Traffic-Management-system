"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Car, Wallet, AlertTriangle, FileText, Settings, Award, Maximize2, Scan as ScanIcon, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import QRCodeTicket, { MockQRCode } from "@/components/parking/QRCodeTicket"
import QRScanner from "@/components/parking/QRScanner"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [tickets, setTickets] = React.useState<any[]>([])
    const [vehicles, setVehicles] = React.useState(["MH-13-AB-1234", "MH-13-XY-9876"])
    const [selectedVehicle, setSelectedVehicle] = React.useState(vehicles[0])
    const [myFines, setMyFines] = React.useState<any[]>([])

    React.useEffect(() => {
        if (!user) {
            router.push("/login")
        }
        // Load tickets
        const storedTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")
        setTickets(storedTickets)

        // Load Fines (Violations)
        const storedViolations = JSON.parse(localStorage.getItem("solapur_traffic_violations") || "[]")
        const userFines = storedViolations.filter((v: any) => vehicles.includes(v.vehicleNo))
        setMyFines(userFines)

    }, [user, router, vehicles]) // Added vehicles dependency

    if (!user) return null

    // Calculate totals for selected vehicle
    const vehicleFines = myFines.filter(f => f.vehicleNo === selectedVehicle && f.status === 'approved')
    const totalFineAmount = vehicleFines.reduce((sum, f) => sum + (f.amount || 500), 0) // Default 500 if no amount

    // ... helper functions
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "police": return "bg-blue-600 hover:bg-blue-700"
            case "admin": return "bg-red-600 hover:bg-red-700"
            case "parking_owner": return "bg-orange-500 hover:bg-orange-600"
            default: return "bg-green-600 hover:bg-green-700"
        }
    }

    return (
        <div className="container px-4 pt-24 pb-12 max-w-5xl mx-auto">
            {/* ... Sidebar remains same */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Identity Card */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="overflow-hidden border-2 shadow-lg">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                <div className="h-32 w-32 rounded-full border-4 border-background bg-muted flex items-center justify-center shadow-xl">
                                    <User className="h-16 w-16 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-20 text-center space-y-4 pb-8">
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <div className="flex justify-center mt-2">
                                    <Badge className={`${getRoleBadgeColor(user.role as string)} px-3 py-1 text-sm capitalize`}>
                                        {user.role === "police" ? "Police Officer" : user.role?.replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                                <div className="text-center">
                                    <p className="text-muted-foreground">Member Since</p>
                                    <p className="font-semibold">Jan 2024</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Status</p>
                                    <div className="flex items-center justify-center gap-1 text-green-500 font-semibold">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={logout}>
                                Log Out
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats for Citizen */}
                    {user.role === "citizen" && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="h-5 w-5 text-yellow-500" />
                                    Rewards Program
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-3xl font-bold text-primary">{user.points || 0}</p>
                                        <p className="text-xs text-muted-foreground">Current Points</p>
                                    </div>
                                    <Button size="sm" variant="secondary">Redeem</Button>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[70%]" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">30 points to next reward level</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className={`grid w-full ${(user.role === 'citizen' || user.role === 'police') ? 'grid-cols-4' : 'grid-cols-3'}`}>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            {(user.role === 'citizen' || user.role === 'police') && <TabsTrigger value="wallet">QR Wallet</TabsTrigger>}
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Citizen View */}
                            {user.role === "citizen" && (
                                <div className="space-y-6">

                                    {/* Vehicle Selector */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <Car className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Active Vehicle Dashboard</h3>
                                                <p className="text-xs text-muted-foreground">Viewing data for: <span className="font-mono font-bold text-foreground">{selectedVehicle}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {vehicles.map(v => (
                                                <Button
                                                    key={v}
                                                    variant={selectedVehicle === v ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setSelectedVehicle(v)}
                                                    className="font-mono"
                                                >
                                                    {v}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">My Vehicles</CardTitle>
                                                <Car className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{vehicles.length}</div>
                                                <p className="text-xs text-muted-foreground">{vehicles.join(", ")}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className={vehicleFines.length > 0 ? "border-red-500/50 bg-red-50/50 dark:bg-red-900/10" : ""}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Pending Fines ({selectedVehicle})</CardTitle>
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className={`text-2xl font-bold ${vehicleFines.length > 0 ? "text-red-600" : "text-green-600"}`}>
                                                    ₹{totalFineAmount}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {vehicleFines.length} violation(s) pending payment
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Fines List if any */}
                                    {vehicleFines.length > 0 && (
                                        <Card className="border-red-200 dark:border-red-900">
                                            <CardHeader>
                                                <CardTitle className="text-red-600 text-lg flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    Outstanding Violations
                                                </CardTitle>
                                                <CardDescription>
                                                    Please clear these dues immediately to avoid legal action.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {vehicleFines.map(fine => (
                                                    <div key={fine.id} className="flex justify-between items-center p-3 bg-white dark:bg-black/20 rounded-lg border">
                                                        <div>
                                                            <p className="font-semibold text-sm">{fine.type}</p>
                                                            <p className="text-xs text-muted-foreground">{fine.location} • {new Date(fine.timestamp).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-red-600">₹{fine.amount || 500}</span>
                                                            <Button size="sm" variant="destructive">Pay Now</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* UNIQUE FEATURE: Green Commute Leaderboard */}
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                                <Award className="h-5 w-5" />
                                                Solapur Green Commuter Rank
                                            </CardTitle>
                                            <CardDescription>You are in the top 5% of eco-friendly commuters this month!</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <span>Your Rank: #42</span>
                                                    <span className="text-green-600">+12 spots this week</span>
                                                </div>
                                                <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-2.5">
                                                    <div className="bg-green-600 h-2.5 rounded-full w-[85%]" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                                                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                                        <div className="font-bold text-lg">120km</div>
                                                        <div className="text-muted-foreground">Public Transit</div>
                                                    </div>
                                                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                                        <div className="font-bold text-lg">15kg</div>
                                                        <div className="text-muted-foreground">CO2 Saved</div>
                                                    </div>
                                                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                                                        <div className="font-bold text-lg">₹450</div>
                                                        <div className="text-muted-foreground">Fuel Saved</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Police View */}
                            {user.role === "police" && (
                                <div className="space-y-6">
                                    <div className="grid gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Officer Details</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Badge Number</span>
                                                    <span className="font-mono">POL-4421</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Station</span>
                                                    <span>Sadar Bazar Police Station</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Current Shift</span>
                                                    <span>08:00 - 16:00 (Alpha Squad)</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* UNIQUE FEATURE: Live Patrol Dashboard */}
                                    <Card className="border-blue-200 dark:border-blue-800">
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                                    <Shield className="h-5 w-5" />
                                                    Live Patrol Status
                                                </CardTitle>
                                                <Badge variant="outline" className="bg-blue-100 text-blue-700 animate-pulse">On Duty</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg border border-l-4 border-l-blue-500">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm">Current Assignment</p>
                                                        <p className="text-xs text-muted-foreground">VIP Convoy Route Security - Hotgi Road Sector</p>
                                                    </div>
                                                    <Button size="sm" variant="default">Acknowledge</Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Link href="/sos" className="w-full">
                                                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                                                            <AlertTriangle className="h-6 w-6" />
                                                            <span>SOS Alert</span>
                                                        </Button>
                                                    </Link>
                                                    <Link href="/admin/violations" className="w-full">
                                                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                                            <FileText className="h-6 w-6" />
                                                            <span>E-Challan</span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Parking Owner View */}
                            {user.role === "parking_owner" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
                                                <Car className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">45</div>
                                                <p className="text-xs text-muted-foreground">+5 from last month</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-green-500">₹12,450</div>
                                                <p className="text-xs text-muted-foreground">+12% vs last month</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* UNIQUE FEATURE: Dynamic Pricing Engine */}
                                    <Card className="border-orange-200 dark:border-orange-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                                <Settings className="h-5 w-5" />
                                                Smart Pricing Engine
                                            </CardTitle>
                                            <CardDescription>Adjust rates based on real-time demand.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-semibold text-sm">Demand Surge</span>
                                                        <Badge className="bg-orange-500">High</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Predicted high traffic due to local festival. Recommended rate: ₹25/hr.
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Current Rate</span>
                                                        <span className="font-bold">₹20 / hr</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full">
                                                        <div className="h-full bg-orange-500 w-[60%]" />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>₹10</span>
                                                        <span>₹50</span>
                                                    </div>
                                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2">
                                                        Apply Recommendation (₹25/hr)
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* NEW: Ticket Scanner for Owners */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <Card className="border-2 border-dashed border-primary/20 bg-muted/30">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <ScanIcon className="h-5 w-5 text-primary" />
                                                    Validate Parking Ticket
                                                </CardTitle>
                                                <CardDescription>Scan customer QR codes to verify validity.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                                                <div className="bg-muted p-4 rounded-full">
                                                    <Camera className="h-8 w-8 text-primary" />
                                                </div>
                                                <p className="text-center text-sm text-muted-foreground">
                                                    Use your device camera to scan tickets at the entry/exit gate.
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/parking/dashboard")}>
                                                        <Car className="h-4 w-4 mr-2" />
                                                        Manage Lot
                                                    </Button>
                                                    <Button size="lg" className="w-full" onClick={() => router.push("/parking/scan")}>
                                                        <ScanIcon className="h-4 w-4 mr-2" />
                                                        Scanner
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Shared Recent Activity for Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Alerts</CardTitle>
                                    <CardDescription>Important notifications regarding your account.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                        <div className="p-2 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-100">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Profile Verified</p>
                                            <p className="text-xs text-muted-foreground">Your identity has been successfully verified by the system.</p>
                                        </div>
                                    </div>
                                    {user.role === "citizen" && (
                                        <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900 dark:text-yellow-100">
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">License Expiring Soon</p>
                                                <p className="text-xs text-muted-foreground">Your driving license is set to expire in 45 days. Renew now.</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="wallet" className="space-y-6">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium">QR Wallet</h3>
                                        <p className="text-sm text-muted-foreground">Access your active and past parking tickets.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tickets.length === 0 && (
                                        <div className="col-span-full text-center py-12 text-muted-foreground">
                                            No tickets found. Book a parking spot to see it here.
                                        </div>
                                    )}

                                    {tickets.map((ticket, index) => {
                                        const isActive = new Date(ticket.endTime).getTime() > Date.now()
                                        return (
                                            <Card key={index} className={isActive ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10" : "opacity-75"}>
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className={isActive ? "text-green-700 dark:text-green-400" : ""}>
                                                                {isActive ? "Active Parking" : "Past Ticket"}
                                                            </CardTitle>
                                                            <CardDescription>{ticket.spotName}</CardDescription>
                                                        </div>
                                                        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : ""}>
                                                            {isActive ? "Active" : "Expired"}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-col items-center">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <div className={`cursor-pointer transition-transform hover:scale-105 ${!isActive ? "opacity-50 grayscale" : ""}`}>
                                                                    <div className="scale-75 -my-4 origin-top pointer-events-none">
                                                                        <QRCodeTicket data={ticket} />
                                                                    </div>
                                                                    <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1 mt-[-20px]">
                                                                        <Maximize2 className="h-3 w-3" /> Tap to Zoom
                                                                    </div>
                                                                </div>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                                                                <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-border shadow-2xl relative">
                                                                    {/* Ticket Header */}
                                                                    <div className="bg-primary p-6 text-primary-foreground text-center relative z-10">
                                                                        <h2 className="text-xl font-bold tracking-tight">Parking Pass</h2>
                                                                        <p className="text-primary-foreground/80 text-sm mt-1">{ticket.spotName}</p>

                                                                        {/* Decorative Circles for Ticket Look */}
                                                                        <div className="absolute -bottom-3 -left-3 h-6 w-6 bg-background rounded-full" />
                                                                        <div className="absolute -bottom-3 -right-3 h-6 w-6 bg-background rounded-full" />
                                                                    </div>

                                                                    {/* Dotted Line */}
                                                                    <div className="flex px-4 items-center justify-between relative z-0">
                                                                        <div className="w-full border-b-2 border-dashed border-muted-foreground/30 absolute top-0 left-0" />
                                                                    </div>

                                                                    {/* QR Code Section */}
                                                                    <div className="flex flex-col items-center justify-center p-8 pb-4 bg-white dark:bg-white/5">
                                                                        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-black/10">
                                                                            <MockQRCode value={JSON.stringify(ticket)} size={220} />
                                                                        </div>
                                                                        <p className="font-mono text-xs mt-3 text-muted-foreground">{ticket.ticketId}</p>
                                                                    </div>

                                                                    {/* Ticket Details */}
                                                                    <div className="px-6 pb-6 space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                                            <div>
                                                                                <p className="text-muted-foreground text-xs">Vehicle No</p>
                                                                                <p className="font-semibold font-mono">{ticket.vehicleNo}</p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-muted-foreground text-xs">Amount</p>
                                                                                <p className="font-semibold">₹{ticket.amount}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-muted-foreground text-xs">Entry Time</p>
                                                                                <p className="font-semibold">{new Date(ticket.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-muted-foreground text-xs">Valid Until</p>
                                                                                <p className={`font-semibold ${isActive ? "text-green-600" : "text-red-500"}`}>
                                                                                    {new Date(ticket.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="pt-4 border-t border-dashed">
                                                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                                                                <ScanIcon className="h-4 w-4" />
                                                                                <span>Scan at exit gate terminal</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Log</CardTitle>
                                    <CardDescription>History of your recent interactions.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium text-sm">Login Detected</p>
                                                    <p className="text-xs text-muted-foreground">Successfully logged in from Solapur, India</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground">2 hours ago</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Manage your preferences and security.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-sm">Two-Factor Authentication</p>
                                            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                                        </div>
                                        <Button variant="outline" size="sm">Enable</Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-sm">Email Notifications</p>
                                            <p className="text-xs text-muted-foreground">Receive updates about traffic incidents.</p>
                                        </div>
                                        <Button variant="outline" size="sm">Configure</Button>
                                    </div>
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-sm text-red-500">Delete Account</p>
                                            <p className="text-xs text-muted-foreground">Permanently remove your data from the system.</p>
                                        </div>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
