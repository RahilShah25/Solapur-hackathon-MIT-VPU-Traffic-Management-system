"use client"

import * as React from "react"
import { Scan, CheckCircle2, XCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TicketData } from "./QRCodeTicket"

export default function QRScanner() {
    const [isScanning, setIsScanning] = React.useState(false)
    const [scanResult, setScanResult] = React.useState<{ success: boolean; message: string; ticket?: TicketData } | null>(null)

    const handleScan = () => {
        setIsScanning(true)
        setScanResult(null)

        // Simulate scanning process
        setTimeout(() => {
            const storedTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")

            // Randomly simulate success or failure for demo purposes
            // In a real app, this would process the actual QR payload
            const randomTicket = storedTickets.find((t: any) => new Date(t.endTime).getTime() > Date.now())

            setIsScanning(false)

            if (randomTicket) {
                setScanResult({
                    success: true,
                    message: "Ticket Verified Successfully",
                    ticket: randomTicket
                })
            } else if (storedTickets.length > 0) {
                // Found expired ticket
                setScanResult({
                    success: false,
                    message: "Ticket Expired",
                    ticket: storedTickets[0]
                })
            } else {
                setScanResult({
                    success: false,
                    message: "No valid ticket found in demo data",
                })
            }
        }, 2000)
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            <div className="relative w-full aspect-square bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                {/* Camera Feed Simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/0 opacity-50" />

                {/* Scanning Laser Animation */}
                {isScanning && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                )}

                {/* Camera Overlay UI */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl" />
                        <div className="w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl" />
                    </div>

                    {isScanning ? (
                        <div className="text-center">
                            <p className="text-white font-mono text-sm animate-pulse bg-black/50 px-2 py-1 rounded inline-block">Scanning...</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Camera className="w-12 h-12 text-white/20" />
                        </div>
                    )}

                    <div className="flex justify-between items-end">
                        <div className="w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl" />
                        <div className="w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl" />
                    </div>
                </div>

                {/* Result Overlay */}
                {!isScanning && scanResult && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="text-center space-y-4 animate-in zoom-in duration-300">
                            {scanResult.success ? (
                                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                            ) : (
                                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                            )}
                            <div>
                                <h3 className={`text-xl font-bold ${scanResult.success ? "text-green-500" : "text-red-500"}`}>
                                    {scanResult.message}
                                </h3>
                                {scanResult.ticket && (
                                    <div className="mt-2 text-white/80 text-sm">
                                        <p>{scanResult.ticket.vehicleNo}</p>
                                        <p className="text-xs text-white/50">{scanResult.ticket.spotName}</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/20" onClick={() => setScanResult(null)}>
                                Scan Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center space-y-4">
                <Button
                    size="lg"
                    className="h-16 w-16 rounded-full border-4 border-white shadow-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                    onClick={handleScan}
                    disabled={isScanning}
                >
                    <Scan className="w-8 h-8" />
                </Button>
                <p className="text-muted-foreground text-sm">Tap button to simulate scanning a guest ticket</p>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}</style>
        </div>
    )
}
