"use client"

import * as React from "react"

export interface ViolationReport {
    id: string
    type: string
    location: string
    description: string
    status: "pending" | "approved" | "rejected"
    timestamp: number
    evidence?: string // URL or base64 placeholder
    vehicleNo?: string
    violatorPhone?: string
    chassisNo?: string
    vehicleType?: string
    amount?: number
}

export interface ParkingRegistration {
    id: string
    ownerName: string
    phone: string
    location: string
    slots: number
    pricePerHour: number
    facilities: string[]
    govIdUrl?: string
    landRegistryUrl?: string
    status: "pending" | "approved" | "rejected"
    timestamp: number
}

interface AdminContextType {
    violations: ViolationReport[]
    parkingRequests: ParkingRegistration[]
    submitViolation: (report: Omit<ViolationReport, "id" | "timestamp" | "status">) => void
    issueInstantChallan: (data: Omit<ViolationReport, "id" | "timestamp" | "status">) => void
    submitParkingRequest: (request: Omit<ParkingRegistration, "id" | "timestamp" | "status">) => void
    approveViolation: (id: string, data?: Partial<ViolationReport>) => void
    rejectViolation: (id: string) => void
    approveParking: (id: string) => void
    rejectParking: (id: string) => void
}

const AdminContext = React.createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Load from LocalStorage on mount
    const [violations, setViolations] = React.useState<ViolationReport[]>([])
    const [parkingRequests, setParkingRequests] = React.useState<ParkingRegistration[]>([])

    React.useEffect(() => {
        const storedViolations = JSON.parse(localStorage.getItem("solapur_traffic_violations") || "[]")
        if (storedViolations.length > 0) {
            setViolations(storedViolations)
        } else {
            // Load Mock Data if empty
            setViolations([
                {
                    id: "v1",
                    type: "wrong-side",
                    location: "Station Road, Solapur",
                    description: "Bike driving on wrong side near signal.",
                    status: "pending",
                    timestamp: Date.now() - 3600000,
                    evidence: "https://images.unsplash.com/photo-1566207198135-c3c252277c27?w=500&auto=format&fit=crop"
                },
                {
                    id: "v2",
                    type: "no-parking",
                    location: "Market Yard Gate 2",
                    description: "Car parked in front of emergency exit.",
                    status: "pending",
                    timestamp: Date.now() - 7200000,
                }
            ])
        }

        const storedRequests = JSON.parse(localStorage.getItem("solapur_parking_requests") || "[]")
        if (storedRequests.length > 0) {
            setParkingRequests(storedRequests)
        } else {
            setParkingRequests([
                {
                    id: "p1",
                    ownerName: "Rajesh Kumar",
                    phone: "+91 9876543210",
                    location: "Near Siddheshwar Temple",
                    slots: 10,
                    pricePerHour: 20,
                    facilities: ["CCTV", "Covered", "Security Guard"],
                    govIdUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop",
                    landRegistryUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop",
                    status: "pending",
                    timestamp: Date.now() - 86400000
                },
                {
                    id: "p2",
                    ownerName: "Amit Patil",
                    phone: "+91 9988776655",
                    location: "Railway Station Parking B",
                    slots: 25,
                    pricePerHour: 15,
                    facilities: ["Open", "24/7 Access"],
                    status: "pending",
                    timestamp: Date.now() - 12000000
                }
            ])
        }
    }, [])

    // Persist changes
    React.useEffect(() => {
        if (violations.length > 0) localStorage.setItem("solapur_traffic_violations", JSON.stringify(violations))
    }, [violations])

    React.useEffect(() => {
        if (parkingRequests.length > 0) localStorage.setItem("solapur_parking_requests", JSON.stringify(parkingRequests))
    }, [parkingRequests])


    const submitViolation = (report: Omit<ViolationReport, "id" | "timestamp" | "status">) => {
        const newReport: ViolationReport = {
            ...report,
            id: Math.random().toString(36).substr(2, 9),
            vehicleNo: report.vehicleNo,
            violatorPhone: report.violatorPhone,
            chassisNo: report.chassisNo,
            vehicleType: report.vehicleType,
            amount: report.amount,
            status: "pending",
            timestamp: Date.now()
        }
        setViolations(prev => [newReport, ...prev])
    }

    const submitParkingRequest = (request: Omit<ParkingRegistration, "id" | "timestamp" | "status">) => {
        const newRequest: ParkingRegistration = {
            ...request,
            pricePerHour: request.pricePerHour || 15,
            facilities: request.facilities || ["Standard"],
            id: Math.random().toString(36).substr(2, 9),
            status: "pending",
            timestamp: Date.now()
        }
        setParkingRequests(prev => [newRequest, ...prev])
    }

    const issueInstantChallan = (data: Omit<ViolationReport, "id" | "timestamp" | "status">) => {
        const newChallan: ViolationReport = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            status: "approved",
            timestamp: Date.now()
        }
        setViolations(prev => [newChallan, ...prev])
    }

    const approveViolation = (id: string, data?: Partial<ViolationReport>) => {
        setViolations(prev => prev.map(v => v.id === id ? {
            ...v,
            status: "approved",
            ...data
        } : v))
    }

    const rejectViolation = (id: string) => {
        setViolations(prev => prev.map(v => v.id === id ? { ...v, status: "rejected" } : v))
    }

    const approveParking = (id: string) => {
        setParkingRequests(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p))
    }

    const rejectParking = (id: string) => {
        setParkingRequests(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p))
    }

    return (
        <AdminContext.Provider value={{
            violations,
            parkingRequests,
            submitViolation,
            issueInstantChallan,
            submitParkingRequest,
            approveViolation,
            rejectViolation,
            approveParking,
            rejectParking
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
    const context = React.useContext(AdminContext)
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}
