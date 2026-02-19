"use client"

import * as React from "react"

export interface Incident {
    id: string
    type: "accident" | "congestion" | "roadwork" | "violation"
    location: string
    timestamp: number
    severity: "low" | "medium" | "high" | "critical"
    description?: string
}

export interface Signal {
    id: number
    name: string
    status: "red" | "yellow" | "green"
    timer: number
    density: number
    inspector: string
    contact: string
    maintenanceStatus: "Operational" | "Maintenance Req." | "Faulty"
    lastMaintained: string
    mode: "automatic" | "manual" | "sos"
}

export interface TrafficState {
    density: {
        north: number
        south: number
        east: number
        west: number
    }
    signals: Signal[]
    isSimulating: boolean
    incidents: Incident[]
}

interface TrafficContextType {
    state: TrafficState
    reportIncident: (incident: Omit<Incident, "id" | "timestamp">) => void
    updateDensity: (zone: keyof TrafficState["density"], value: number) => void
    optimizeSignals: () => void
    // Signal Actions
    addSignal: (signal: Omit<Signal, "id" | "status" | "density" | "lastMaintained" | "mode">) => void
    updateSignal: (signal: Signal) => void
    toggleSignal: (id: number) => void
    setSimulation: (simulating: boolean) => void
}

const TrafficContext = React.createContext<TrafficContextType | undefined>(undefined)

export function TrafficProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<TrafficState>({
        density: { north: 45, south: 30, east: 60, west: 20 },
        signals: [
            {
                id: 1,
                name: "Market Chowk",
                status: "green",
                timer: 45,
                density: 85,
                inspector: "PSI V.K. Patil",
                contact: "+91 98220 12345",
                maintenanceStatus: "Operational",
                lastMaintained: "2024-02-15",
                mode: "manual"
            },
            {
                id: 2,
                name: "Station Road",
                status: "red",
                timer: 12,
                density: 45,
                inspector: "API S.M. Deshmukh",
                contact: "+91 99600 67890",
                maintenanceStatus: "Operational",
                lastMaintained: "2024-02-10",
                mode: "automatic"
            },
            {
                id: 3,
                name: "Ring Road",
                status: "green",
                timer: 30,
                density: 20,
                inspector: "HC R.B. Shinde",
                contact: "+91 88888 54321",
                maintenanceStatus: "Maintenance Req.",
                lastMaintained: "2024-01-20",
                mode: "automatic"
            }
        ],
        isSimulating: false,
        incidents: [],
    })

    // Signal Simulation Effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout
        if (state.isSimulating) {
            interval = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    signals: prev.signals.map(s => {
                        // Skip if in manual/sos mode (optional, but good for "control room")
                        if (s.mode !== "automatic") return s

                        // Random fluctuation
                        const change = Math.floor(Math.random() * 25) - 10
                        const newDensity = Math.max(0, Math.min(100, s.density + change))

                        let newTimer = Math.max(0, s.timer - 1)
                        let newStatus = s.status

                        if (newTimer === 0) {
                            if (s.status === "red") {
                                newStatus = "green"
                                newTimer = 60
                            } else if (s.status === "green") {
                                newStatus = "yellow"
                                newTimer = 5
                            } else if (s.status === "yellow") {
                                newStatus = "red"
                                newTimer = 60
                            }
                        }

                        return {
                            ...s,
                            density: newDensity,
                            timer: newTimer,
                            status: newStatus
                        }
                    })
                }))
            }, 1000) // 1 second real-time
        }
        return () => clearInterval(interval)
    }, [state.isSimulating])

    const reportIncident = (incidentData: Omit<Incident, "id" | "timestamp">) => {
        const newIncident: Incident = {
            ...incidentData,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
        }
        setState((prev) => ({
            ...prev,
            incidents: [newIncident, ...prev.incidents]
        }))
    }

    const updateDensity = (zone: keyof TrafficState["density"], value: number) => {
        setState((prev) => ({
            ...prev,
            density: { ...prev.density, [zone]: value },
        }))
    }

    const optimizeSignals = () => {
        // Placeholder for AI optimization
        console.log("Optimizing signals...")
    }

    const addSignal = (signalData: Omit<Signal, "id" | "status" | "density" | "lastMaintained" | "mode">) => {
        const id = Math.max(0, ...state.signals.map(s => s.id)) + 1
        setState(prev => ({
            ...prev,
            signals: [...prev.signals, {
                id,
                ...signalData,
                status: "red",
                density: 30,
                lastMaintained: new Date().toISOString(),
                mode: "automatic"
            }]
        }))
    }

    const updateSignal = (updatedSignal: Signal) => {
        setState(prev => ({
            ...prev,
            signals: prev.signals.map(s => s.id === updatedSignal.id ? updatedSignal : s)
        }))
    }

    const toggleSignal = (id: number) => {
        setState(prev => ({
            ...prev,
            signals: prev.signals.map(s => {
                if (s.id === id) {
                    if (s.status === "green") return { ...s, status: "yellow", timer: 5 }
                    if (s.status === "yellow") return { ...s, status: "red", timer: 60 }
                    return { ...s, status: "green", timer: 60 }
                }
                return s
            })
        }))
    }

    const setSimulation = (simulating: boolean) => {
        setState(prev => ({ ...prev, isSimulating: simulating }))
    }

    return (
        <TrafficContext.Provider value={{
            state,
            reportIncident,
            updateDensity,
            optimizeSignals,
            addSignal,
            updateSignal,
            toggleSignal,
            setSimulation
        }}>
            {children}
        </TrafficContext.Provider>
    )
}

export function useTraffic() {
    const context = React.useContext(TrafficContext)
    if (context === undefined) {
        throw new Error("useTraffic must be used within a TrafficProvider")
    }
    return context
}
