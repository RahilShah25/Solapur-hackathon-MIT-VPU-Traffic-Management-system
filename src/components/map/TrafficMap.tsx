"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { AlertTriangle, Navigation, Clock, Ban, CheckCircle2, Info, Car } from "lucide-react"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false, loading: () => <Skeleton className="h-[600px] w-full rounded-lg" /> }
)
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
)
const Polyline = dynamic(
    () => import("react-leaflet").then((mod) => mod.Polyline),
    { ssr: false }
)
const Circle = dynamic(
    () => import("react-leaflet").then((mod) => mod.Circle),
    { ssr: false }
)

import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom Hook to load Leaflet icons only on client
const useLeafletIcons = () => {
    useEffect(() => {
        // Fix for default marker icon in Next.js
        const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
        const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"
        const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"

        delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
        });
    }, []);
};

// --- DATA TYPES ---
type RouteStatus = "FASTEST" | "CONGESTED" | "MODERATE"
type HotspotSeverity = "HIGH" | "MEDIUM" | "LOW"

interface RoutePath {
    id: string
    name: string
    coordinates: [number, number][]
    color: string
    status: RouteStatus
    duration: string
    distance: string
    peakHourAdvice: string
    isRecommended: boolean
}

interface Hotspot {
    id: string
    position: [number, number]
    radius: number
    color: string
    description: string
    severity: HotspotSeverity
}

export default function TrafficMap({ className }: { className?: string }) {
    const [isMounted, setIsMounted] = useState(false)
    useLeafletIcons()

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const centerParams: [number, number] = [17.6599, 75.9064] // Solapur Center

    // --- MOCK DATA ---
    const hotspots: Hotspot[] = useMemo(() => [
        {
            id: "h1",
            position: [17.6650, 75.9100],
            radius: 300,
            color: "#ef4444", // Red
            description: "⚠️ Accident Prone Zone: High intersection density",
            severity: "HIGH"
        },
        {
            id: "h2",
            position: [17.6550, 75.9000],
            radius: 200,
            color: "#f97316", // Orange
            description: "🚧 Road Construction: Main pipeline work",
            severity: "MEDIUM"
        },
        {
            id: "h3",
            position: [17.6750, 75.9150],
            radius: 250,
            color: "#ef4444",
            description: "🛑 Congested Market Area: Avoid 5PM-9PM",
            severity: "HIGH"
        }
    ], [])

    const routes: RoutePath[] = useMemo(() => [
        {
            id: "r1",
            name: "Route A (via Market)",
            coordinates: [
                [17.6599, 75.9064],
                [17.6650, 75.9100], // Passes through Hotspot 1
                [17.6750, 75.9150], // Passes through Hotspot 3
                [17.6800, 75.9200]
            ],
            color: "#ef4444", // Red
            status: "CONGESTED",
            duration: "45 mins",
            distance: "5.2 km",
            peakHourAdvice: "AVOID: High traffic expected due to market hours.",
            isRecommended: false
        },
        {
            id: "r2",
            name: "Route B (Ring Road)",
            coordinates: [
                [17.6599, 75.9064],
                [17.6500, 75.8900],
                [17.6600, 75.8800],
                [17.6800, 75.9200]
            ],
            color: "#22c55e", // Green
            status: "FASTEST",
            duration: "25 mins",
            distance: "6.8 km",
            peakHourAdvice: "RECOMMENDED: Bypass heavy city traffic.",
            isRecommended: true
        },
        {
            id: "r3",
            name: "Route C (Old Highway)",
            coordinates: [
                [17.6599, 75.9064],
                [17.6550, 75.9000], // Passes through Hotspot 2
                [17.6700, 75.9050],
                [17.6800, 75.9200]
            ],
            color: "#eab308", // Yellow
            status: "MODERATE",
            duration: "35 mins",
            distance: "5.5 km",
            peakHourAdvice: "CAUTION: Current road work causing delays.",
            isRecommended: false
        }
    ], [])

    const [selectedRoute, setSelectedRoute] = useState<RoutePath | null>(routes[1])

    // Parking Layer Logic
    const searchParams = useSearchParams()
    const [showParking, setShowParking] = useState(false)

    useEffect(() => {
        if (searchParams.get("layer") === "parking") {
            setShowParking(true)
        }
    }, [searchParams])

    const parkingSpots = useMemo(() => [
        { id: "p1", name: "City Center Mall", position: [17.6620, 75.9060] as [number, number], slots: 15 },
        { id: "p2", name: "Railway Station", position: [17.6680, 75.9040] as [number, number], slots: 5 },
        { id: "p3", name: "Market Yard", position: [17.6580, 75.9020] as [number, number], slots: 0 },
    ], [])


    if (!isMounted) return <Skeleton className="h-[600px] w-full rounded-lg animate-pulse" />

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px] lg:h-[600px] ${className}`}>

            {/* Map Area */}
            <div className="lg:col-span-2 relative h-full rounded-xl overflow-hidden border shadow-xl">
                <MapContainer
                    center={centerParams}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Hotspots */}
                    {hotspots.map(h => (
                        <Circle
                            key={h.id}
                            center={h.position}
                            radius={h.radius}
                            pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.2 }}
                        >
                            <Popup className="rounded-lg">
                                <div className="p-1">
                                    <h4 className="font-bold flex items-center gap-2 text-sm">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        Hotspot Alert
                                    </h4>
                                    <p className="text-xs mt-1">{h.description}</p>
                                </div>
                            </Popup>
                        </Circle>
                    ))}

                    {/* Routes */}
                    {routes.map(r => (
                        <Polyline
                            key={r.id}
                            positions={r.coordinates}
                            pathOptions={{
                                color: r.color,
                                weight: selectedRoute?.id === r.id ? 8 : 4,
                                opacity: selectedRoute?.id === r.id ? 1 : 0.5,
                                dashArray: r.status === "CONGESTED" ? '4, 10' : undefined
                            }}
                            eventHandlers={{
                                click: () => setSelectedRoute(r)
                            }}
                        >
                            <Popup>
                                <b>{r.name}</b><br />
                                {r.duration} • {r.distance}
                            </Popup>
                        </Polyline>
                    ))}

                    {/* Start Marker */}
                    <Marker position={centerParams}>
                        <Popup>Start: Central Solapur</Popup>
                    </Marker>

                    {/* End Marker (Simulated common destination) */}
                    <Marker position={[17.6800, 75.9200]}>
                        <Popup>Destination: MIDC Area</Popup>
                    </Marker>

                    {/* Parking Spots Layer */}
                    {showParking && parkingSpots.map(p => (
                        <Marker key={p.id} position={p.position} icon={new L.Icon({
                            iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png", // Fallback, normally custom icon
                            iconSize: [25, 41],
                            iconAnchor: [12, 41]
                        })}>
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold flex items-center gap-2 text-sm">{p.name}</h4>
                                    <p className={`text-xs font-bold ${p.slots > 0 ? "text-green-600" : "text-red-600"}`}>
                                        {p.slots > 0 ? `${p.slots} Slots Available` : "FULL"}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}


                </MapContainer>

                {/* Map Overlay Controls */}
                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur text-foreground border-border shadow-sm cursor-pointer hover:bg-background">
                        <Info className="h-3 w-3 mr-1" />
                        Interactive Mode
                    </Badge>
                    <Badge
                        variant={showParking ? "default" : "outline"}
                        className={`cursor-pointer shadow-sm ${showParking ? "bg-blue-600 hover:bg-blue-700" : "bg-background/80 hover:bg-background"}`}
                        onClick={() => setShowParking(!showParking)}
                    >
                        <Car className="h-3 w-3 mr-1" />
                        {showParking ? "Hide Parking" : "Show Parking"}
                    </Badge>
                </div>

            </div>

            {/* Information Panel */}
            <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
                <Card className="border-l-4 border-l-primary shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Navigation className="h-5 w-5 text-primary" />
                            Route Advisor
                        </CardTitle>
                        <CardDescription>
                            Real-time analysis based on traffic density and incidents.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="space-y-3">
                    {routes.map(route => (
                        <div
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${selectedRoute?.id === route.id
                                ? "bg-primary/5 ring-1 ring-primary border-primary"
                                : "bg-card border-border hover:border-primary/50"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-base">{route.name}</h3>
                                {route.isRecommended && (
                                    <Badge className="bg-green-600 hover:bg-green-700">Recommended</Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {route.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Navigation className="h-4 w-4" /> {route.distance}
                                </span>
                            </div>

                            <div className={`text-xs p-2 rounded-lg border font-medium flex items-start gap-2 ${route.status === "FASTEST"
                                ? "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-900"
                                : route.status === "CONGESTED"
                                    ? "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-900"
                                    : "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-900"
                                }`}>
                                {route.status === "FASTEST" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <Ban className="h-4 w-4 shrink-0" />}
                                {route.peakHourAdvice}
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="mt-auto bg-destructive/5 border-destructive/20">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-destructive mb-1">Peak Hour Alert</h4>
                                <p className="text-sm text-muted-foreground">
                                    Heavy congestion detected in <b>Market Chowk</b>. Avoid Route A until 9:00 PM.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
