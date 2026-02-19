"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Activity, Zap, Plus, Edit2, Play, Pause, Settings, Timer, AlertTriangle, CheckCircle2, Siren } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTraffic, Signal } from "./TrafficContext"
import Link from "next/link"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function SignalManager() {
    const { state, setSimulation, addSignal, updateSignal, toggleSignal } = useTraffic()
    const { signals, isSimulating } = state

    // Form State
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [editingSignal, setEditingSignal] = React.useState<Signal | null>(null)
    const [newSignal, setNewSignal] = React.useState({
        name: "",
        timer: 30,
        inspector: "",
        contact: "",
        maintenanceStatus: "Operational"
    })

    const getDensityColor = (val: number) => {
        if (val >= 75) return "#ef4444" // red
        if (val >= 40) return "#f97316" // orange
        return "#22c55e" // green
    }

    const handleAddSignal = () => {
        addSignal({
            name: newSignal.name,
            timer: newSignal.timer,
            inspector: newSignal.inspector,
            contact: newSignal.contact,
            maintenanceStatus: newSignal.maintenanceStatus as any
        })
        setIsAddOpen(false)
        setNewSignal({ name: "", timer: 30, inspector: "", contact: "", maintenanceStatus: "Operational" })
        toast.success("New Signal Added Successfully")
    }

    const handleUpdateInspector = () => {
        if (!editingSignal) return
        updateSignal(editingSignal)
        setEditingSignal(null)
        toast.success("Signal Details Updated")
    }

    const activeAlerts = signals.filter(s => s.maintenanceStatus !== "Operational").length
    const totalJunctions = signals.length
    const avgCongestion = Math.round(signals.reduce((acc, curr) => acc + curr.density, 0) / (totalJunctions || 1))

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dashboard Header */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {isSimulating ? <span className="text-green-500">Live</span> : <span className="text-muted-foreground">Paused</span>}
                            {isSimulating && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                        </div>
                        <p className="text-xs text-muted-foreground">Traffic Simulation Engine</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Junctions</CardTitle>
                        <Zap className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJunctions}</div>
                        <p className="text-xs text-muted-foreground">Monitored intersections</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Congestion</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgCongestion}%</div>
                        <p className="text-xs text-muted-foreground">City-wide traffic density</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-200/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeAlerts}</div>
                        <p className="text-xs text-muted-foreground">Maintenance required</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-4 rounded-xl border backdrop-blur-sm sticky top-20 z-10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Traffic Control Center</h2>
                    <p className="text-muted-foreground">Real-time signal monitoring and manual override controls.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setSimulation(!isSimulating)}
                        className={`transition-all ${isSimulating ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200" : "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"}`}
                    >
                        {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isSimulating ? "Stop Simulation" : "Start Simulation"}
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-lg shadow-primary/20"><Plus className="h-4 w-4 mr-2" /> Add Junction</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Traffic Junction</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Junction Name</Label>
                                        <Input value={newSignal.name} onChange={e => setNewSignal({ ...newSignal, name: e.target.value })} placeholder="e.g., Gandhi Chowk" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Default Timer (s)</Label>
                                        <Input type="number" value={newSignal.timer} onChange={e => setNewSignal({ ...newSignal, timer: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Assigned Inspector</Label>
                                        <Input value={newSignal.inspector} onChange={e => setNewSignal({ ...newSignal, inspector: e.target.value })} placeholder="Officer Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contact</Label>
                                        <Input value={newSignal.contact} onChange={e => setNewSignal({ ...newSignal, contact: e.target.value })} placeholder="+91..." />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSignal} className="w-full">Register Signal</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {signals.map((signal) => (
                        <motion.div
                            key={signal.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                        >
                            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors group">
                                {/* Traffic Light Effect */}
                                <div className="absolute top-0 right-0 p-3 bg-muted/30 rounded-bl-2xl border-b border-l backdrop-blur-md z-10 flex gap-2">
                                    <div className={`h-3 w-3 rounded-full transition-all duration-500 ${signal.status === "red" ? "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.6)] scale-125" : "bg-red-900/30"}`} />
                                    <div className={`h-3 w-3 rounded-full transition-all duration-500 ${signal.status === "yellow" ? "bg-yellow-500 shadow-[0_0_10px_2px_rgba(234,179,8,0.6)] scale-125" : "bg-yellow-900/30"}`} />
                                    <div className={`h-3 w-3 rounded-full transition-all duration-500 ${signal.status === "green" ? "bg-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.6)] scale-125" : "bg-green-900/30"}`} />
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{signal.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Siren className="h-3 w-3" /> {signal.inspector || "Unassigned"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Timer Display */}
                                    <div className="flex items-center justify-between">
                                        <div className="bg-black/5 dark:bg-black/40 p-3 rounded-lg border w-full flex items-center justify-between">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Wait Time</span>
                                            <div className="font-mono text-3xl font-bold tracking-tighter text-primary tabular-nums">
                                                {String(signal.timer).padStart(2, '0')}
                                                <span className="text-sm ml-1 text-muted-foreground">s</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Density Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-muted-foreground">Congestion Level</span>
                                            <span style={{ color: getDensityColor(signal.density) }}>
                                                {signal.density >= 75 ? "Heavy" : signal.density >= 40 ? "Moderate" : "Light"} ({signal.density}%)
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${signal.density}%`, backgroundColor: getDensityColor(signal.density) }}
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Actions (Buttons instead of Icons) */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingSignal(signal)}
                                            className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                        >
                                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                                        </Button>
                                        <Link href={`/admin/signals/${signal.id}`} className="w-full">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                            >
                                                <Settings className="h-3 w-3 mr-2" /> Config
                                            </Button>
                                        </Link>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={signal.status === "red" ? "default" : "secondary"}
                                        className={`w-full font-bold ${signal.status === "green" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200" :
                                            signal.status === "yellow" ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200" :
                                                "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                                            }`}
                                        onClick={() => toggleSignal(signal.id)}
                                    >
                                        Force {signal.status === "green" ? "Yellow" : signal.status === "yellow" ? "Red" : "Green"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Edit Signal Dialog */}
            <Dialog open={!!editingSignal} onOpenChange={(open) => !open && setEditingSignal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Signal Details</DialogTitle>
                    </DialogHeader>
                    {editingSignal && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Inspector Name</Label>
                                <Input value={editingSignal.inspector} onChange={e => setEditingSignal({ ...editingSignal, inspector: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Number</Label>
                                <Input value={editingSignal.contact} onChange={e => setEditingSignal({ ...editingSignal, contact: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Signal Timer (seconds)</Label>
                                <Input type="number" value={editingSignal.timer} onChange={e => setEditingSignal({ ...editingSignal, timer: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Maintenance Status</Label>
                                <Select
                                    value={editingSignal.maintenanceStatus}
                                    onValueChange={val => setEditingSignal({ ...editingSignal, maintenanceStatus: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Operational">Operational</SelectItem>
                                        <SelectItem value="Maintenance Req.">Maintenance Req.</SelectItem>
                                        <SelectItem value="Faulty">Faulty</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={handleUpdateInspector}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/10">
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Live Network Density
                        {isSimulating && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse ml-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> LIVE</span>}
                    </CardTitle>
                    <CardDescription>
                        Real-time visualization of traffic congestion across all monitored junctions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={signals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                            <XAxis
                                dataKey="name"
                                className="text-xs text-muted-foreground font-medium"
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                className="text-xs text-muted-foreground font-medium"
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                                unit="%"
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background/95 backdrop-blur-md border rounded-xl shadow-xl p-4 min-w-[150px]">
                                                <p className="font-bold text-sm mb-2">{label}</p>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-8 rounded-full"
                                                        style={{ backgroundColor: payload[0].payload.density >= 75 ? '#ef4444' : payload[0].payload.density >= 40 ? '#f97316' : '#22c55e' }}
                                                    />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Density</p>
                                                        <p className="text-xl font-bold font-mono">
                                                            {payload[0].value}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar dataKey="density" radius={[8, 8, 4, 4]} animationDuration={1000} barSize={60}>
                                {signals.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#${entry.density >= 75 ? 'colorRed' : entry.density >= 40 ? 'colorOrange' : 'colorGreen'})`}
                                        stroke={entry.density >= 75 ? '#ef4444' : entry.density >= 40 ? '#f97316' : '#22c55e'}
                                        strokeWidth={1}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
                <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500"></div> Low Traffic</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-orange-500"></div> Moderate</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div> High Congestion</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
