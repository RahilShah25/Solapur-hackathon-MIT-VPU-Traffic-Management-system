"use client"

import * as React from "react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, CreditCard, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"
import { useRouter } from "next/navigation"
import RoleGuard from "@/components/auth/RoleGuard"
import { Map } from "lucide-react"

import { useAdmin } from "@/components/admin/AdminContext"

const staticParkingSpots = [
    { id: "1", name: "City Center Mall", address: "Station Road, Solapur", slots: 15, price: 20, image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=500&auto=format&fit=crop" },
    { id: "2", name: "Railway Station Parking", address: "Railway Lines", slots: 5, price: 10, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500&auto=format&fit=crop" },
    { id: "3", name: "Market Yard Plaza", address: "Market Yard", slots: 0, price: 15, image: "https://images.unsplash.com/photo-1626863905192-3efff9758136?q=80&w=500&auto=format&fit=crop" },
]

function ParkingBookingContent() {
    const { parkingRequests } = useAdmin()

    // Combine static spots with approved dynamic spots
    const approvedSpots = parkingRequests
        .filter(p => p.status === "approved")
        .map(p => ({
            id: p.id,
            name: `${p.ownerName}'s Space`,
            address: p.location,
            slots: p.slots,
            price: 15, // Default price for user-registered spots
            image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=500&auto=format&fit=crop" // Generic parking image
        }))

    const allParkingSpots = [...staticParkingSpots, ...approvedSpots]

    // const searchParams = useSearchParams()
    // const vehicleType = searchParams.get("type") || "4-wheeler"

    const [searchTerm, setSearchTerm] = React.useState("")

    // Owner Redirect Logic
    const { user } = useAuth()
    const router = useRouter()

    // Owner Redirect Logic - REMOVED to allow owners to see the map/list
    /*
    React.useEffect(() => {
        if (user?.role === "parking_owner") {
            router.push("/parking/dashboard")
        }
    }, [user, router])
    */



    // Check for Manual Full Override
    const [isFullOverride, setIsFullOverride] = React.useState(false)
    React.useEffect(() => {
        const checkOverride = () => {
            const status = localStorage.getItem("parking_lot_override_full") === "true"
            setIsFullOverride(status)
        }
        checkOverride()
        const interval = setInterval(checkOverride, 2000) // Poll for changes
        return () => clearInterval(interval)
    }, [])

    // Apply Override to Spots
    const visibleSpots = allParkingSpots.map(spot => {
        if (isFullOverride && spot.id === "1") { // Simulate only the main mall being managed by this owner
            return { ...spot, slots: 0 }
        }
        return spot
    })




    return (
        <div className="container px-4 pt-28 pb-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find Parking</h1>
                    <p className="text-muted-foreground">Book a spot near you in seconds.</p>
                </div>
                {user?.role === "admin" && (
                    <Link href="/parking/register">
                        <Button variant="outline">Register Your Space</Button>
                    </Link>
                )}
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by location..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleSpots.filter(spot =>
                    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    spot.address.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((spot) => (
                    <Card key={spot.id} className={`overflow-hidden ${spot.slots === 0 ? "opacity-60" : ""}`}>
                        <div className="h-32 w-full overflow-hidden">
                            <img src={spot.image} alt={spot.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>{spot.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${spot.slots > 0 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"}`}>
                                    {spot.slots > 0 ? `${spot.slots} slots` : "Full"}
                                </span>
                            </CardTitle>
                            <CardDescription className="flex items-center justify-between mt-2">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {spot.address}</span>
                                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => router.push("/traffic-map?layer=parking")}>
                                    <Map className="h-3 w-3 mr-1" /> View Map
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm">
                                <span>Rate:</span>
                                <span className="font-bold">₹{spot.price}/hr</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                disabled={spot.slots === 0}
                                onClick={() => router.push(`/parking/book/${spot.id}`)}
                            >
                                {spot.slots === 0 ? "No Slots Available" : "Book Spot"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function ParkingBookingPage() {
    return (
        <RoleGuard>
            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <ParkingBookingContent />
            </Suspense>
        </RoleGuard>
    )
}
