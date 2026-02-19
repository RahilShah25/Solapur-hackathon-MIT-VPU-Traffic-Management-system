"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useTraffic } from "@/components/traffic/TrafficContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, AlertTriangle, Play, Pause, Siren, Zap } from "lucide-react"

export default function SignalDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { state, updateSignal, toggleSignal } = useTraffic()

    // Convert string param to number
    const signalId = parseInt(params.id as string)
    const signal = state.signals.find(s => s.id === signalId)

    if (!signal) {
        return <div className="p-8 text-center">Signal not found. <Button onClick={() => router.back()}>Go Back</Button></div>
    }

    const handleModeChange = (mode: "automatic" | "manual" | "sos") => {
        updateSignal({ ...signal, mode })
    }

    return (
        <div className="space-y-8 pt-20 px-4 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{signal.name}</h1>
                        <div className="flex items-center gap-3 text-muted-foreground mt-1 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                ID: #{signal.id.toString().padStart(4, '0')}
                            </span>
                            <span>•</span>
                            <span>Inspector: {signal.inspector}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge
                        variant={signal.status === "green" ? "success" : signal.status === "yellow" ? "warning" : "destructive"}
                        className="text-lg px-6 py-2 capitalize shadow-sm"
                    >
                        {signal.status.toUpperCase()} • {signal.timer}s
                    </Badge>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Traffic Density</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{signal.density}%</span>
                            <span className={`text-sm font-medium ${signal.density > 75 ? "text-red-500" : "text-green-500"}`}>
                                {signal.density > 75 ? "High Congestion" : "Flowing Smoothly"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Violations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">12</span>
                            <span className="text-sm text-muted-foreground">Today</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Wait Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">45s</span>
                            <span className="text-sm text-green-500">↓ 5s</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Control Panel */}
                <Card className="border-2 shadow-sm">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Signal Control Room</CardTitle>
                                <CardDescription>Manage operation modes and override timers</CardDescription>
                            </div>
                            <Siren className={`h-6 w-6 ${signal.mode === 'sos' ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* Mode Select */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Operation Mode</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Button
                                    variant={signal.mode === "automatic" ? "default" : "outline"}
                                    size="lg"
                                    className="h-14 text-base"
                                    onClick={() => handleModeChange("automatic")}
                                >
                                    <Play className="h-5 w-5 mr-2" /> Auto
                                </Button>
                                <Button
                                    variant={signal.mode === "manual" ? "default" : "outline"}
                                    size="lg"
                                    className="h-14 text-base"
                                    onClick={() => handleModeChange("manual")}
                                >
                                    <Pause className="h-5 w-5 mr-2" /> Manual
                                </Button>
                                <Button
                                    variant={signal.mode === "sos" ? "destructive" : "outline"}
                                    size="lg"
                                    className={`h-14 text-base ${signal.mode === "sos" ? "animate-pulse shadow-red-500/20 shadow-lg" : ""}`}
                                    onClick={() => handleModeChange("sos")}
                                >
                                    <Siren className="h-5 w-5 mr-2" /> SOS
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground pl-1">
                                {signal.mode === "automatic" && "AI Assistant is optimizing signal timings based on real-time density."}
                                {signal.mode === "manual" && "Manual control active. Operators can set fixed timings or force signal changes."}
                                {signal.mode === "sos" && "EMERGENCY: All signals set to RED. Priority given to emergency vehicles."}
                            </p>
                        </div>

                        {/* Manual Controls */}
                        {signal.mode === "manual" && (
                            <div className="rounded-xl border bg-card p-6 space-y-6 animate-in fade-in slide-in-from-top-4">

                                {/* Cycle Duration Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">Cycle Duration (Seconds)</Label>
                                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{signal.timer}s</span>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <Slider
                                            value={[signal.timer]}
                                            max={120}
                                            step={5}
                                            className="flex-1"
                                            onValueChange={(val) => updateSignal({ ...signal, timer: val[0] })}
                                        />
                                        <div className="w-20">
                                            <input
                                                type="number"
                                                className="w-full h-10 px-3 text-right font-medium border rounded-md focus:ring-2 focus:ring-primary outline-none"
                                                value={signal.timer}
                                                onChange={(e) => updateSignal({ ...signal, timer: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-border my-2" />

                                {/* Force Switch Action */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-base">Force Signal Switch</Label>
                                        <p className="text-xs text-muted-foreground">Override timer and toggle current signal state immediately.</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        className={`w-full ${signal.status === "green" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                                        onClick={() => toggleSignal(signal.id)}
                                    >
                                        <Zap className="mr-2 h-4 w-4 fill-current" />
                                        Switch to {signal.status === "green" ? "Red" : "Green"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="font-medium">System Health</span>
                                <Badge variant={signal.maintenanceStatus === "Operational" ? "outline" : "destructive"} className="bg-background">
                                    {signal.maintenanceStatus}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="font-medium">Last Inspection</span>
                                <span suppressHydrationWarning>{new Date(signal.lastMaintained).toLocaleDateString('en-IN')}</span>
                            </div>
                            <Button variant="outline" className="w-full">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Report Technical Fault
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-primary">Inspector Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This junction experiences high volume during evening peak hours (18:00 - 20:00).
                                Recommended to keep in <strong>Auto Mode</strong> during these times for AI optimization.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
