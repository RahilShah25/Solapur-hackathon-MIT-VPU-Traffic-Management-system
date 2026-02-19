"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation } from "lucide-react"

// Dynamically import map to avoid SSR
const TrafficMap = dynamic(() => import("@/components/map/TrafficMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
})

export default function TrafficMapPage() {
    return (
        <div className="flex flex-col h-screen pt-20 md:flex-row">
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 p-4 border-r bg-background z-10 space-y-4 overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-primary" />
                            Route Planner
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500" />
                                <Input placeholder="Your Location" className="pl-9" defaultValue="Solapur Bus Stand" />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-red-500" />
                                <Input placeholder="Destination" className="pl-9" />
                            </div>
                        </div>
                        <Button className="w-full">Find Best Route</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Live Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Heavy Traffic</span>
                            <span className="text-muted-foreground">Market Area</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Clear Route</span>
                            <span className="text-muted-foreground">Ring Road</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Accident Alert</span>
                            <span className="text-muted-foreground">Station Rd</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <TrafficMap className="h-full w-full" />
            </div>
        </div>
    )
}
