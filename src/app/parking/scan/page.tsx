"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, AlertTriangle, Car, RefreshCw, Camera, Power } from "lucide-react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { toast } from "sonner"

export default function ParkingScannerPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [scanResult, setScanResult] = React.useState<any | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const [isScanning, setIsScanning] = React.useState(false)
    const [debugLog, setDebugLog] = React.useState<string[]>([])

    // We use a ref to keep track of the scanner instance
    const scannerRef = React.useRef<Html5Qrcode | null>(null)

    // Helper to log to screen
    const log = (msg: string) => {
        console.log(msg)
        setDebugLog(prev => [msg, ...prev].slice(0, 5))
    }

    // Verify access
    React.useEffect(() => {
        if (!user || (user.role !== "parking_owner" && user.role !== "admin")) {
            // router.push("/profile")
        }
    }, [user, router])

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            // Retrieve the instance from ref
            const scanner = scannerRef.current;
            if (scanner && scanner.isScanning) {
                // We cannot await here, but we can trigger the stop
                scanner.stop()
                    .catch(err => console.warn("Cleanup stop warning:", err))
                    .finally(async () => {
                        try {
                            await scanner.clear();
                        } catch (e) {
                            // ignore clear errors
                        }
                    });
            }
        }
    }, [])

    const startCamera = async () => {
        setError(null);
        setScanResult(null);
        setIsScanning(true);
        log("Starting camera sequence...");

        try {
            // 1. Check if element exists
            const element = document.getElementById("reader");
            if (!element) {
                throw new Error("Scanner element not found in DOM");
            }

            // 2. Initialize instance if null
            if (!scannerRef.current) {
                log("Creating new Html5Qrcode instance...");
                scannerRef.current = new Html5Qrcode("reader", {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: false
                });
            }

            // 3. Start scanning
            log("Requesting camera access...");
            await scannerRef.current.start(
                { facingMode: "environment" }, // Prefer back camera
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText, decodedResult) => {
                    // Success callback
                    log("QR Code Detected!");
                    handleScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Ignore frame parse errors, they flood the log
                }
            );
            log("Camera started successfully.");

        } catch (err: any) {
            log(`Error: ${err.message || err}`);
            setIsScanning(false);
            let errorMessage = "Camera Error";
            if (err.name === "NotAllowedError") {
                errorMessage = "Permission Denied: Please allow camera access.";
            } else if (err.name === "NotFoundError") {
                errorMessage = "No Camera Found: Device has no camera.";
            } else {
                errorMessage = `Camera Error: ${err.message || "Unknown error"}`;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
    }

    const stopCamera = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                log("Camera stopped manually.");
            } catch (err) {
                log("Error stopping camera.");
            }
        }
        setIsScanning(false);
    }

    const handleScanSuccess = async (data: string) => {
        // Stop scanning immediately
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                log("Camera stopped after scan.");
            } catch (ignore) { }
        }
        setIsScanning(false);

        processScanData(data);
    }

    const processScanData = (data: string) => {
        try {
            // Try to parse as JSON first (app generated QR)
            let ticketId = data;

            try {
                const parsed = JSON.parse(data)
                ticketId = parsed.ticketId || data
            } catch (e) {
                ticketId = data
            }

            // Validate against database (localStorage)
            const storedTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")
            const foundTicketIndex = storedTickets.findIndex((t: any) => t.ticketId === ticketId || JSON.stringify(t).includes(data))

            if (foundTicketIndex >= 0) {
                const ticket = storedTickets[foundTicketIndex]

                // Allocation Logic
                let message = ""
                let status = ""
                let slot = ""

                if (!ticket.status || ticket.status === "Booked") {
                    // Check-in
                    ticket.status = "Parked"
                    ticket.checkInTime = new Date().toISOString()
                    slot = `L${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 50) + 10}`
                    ticket.allocatedSlot = slot
                    message = "Check-in Successful"
                    status = "success"
                } else if (ticket.status === "Parked") {
                    ticket.status = "Completed"
                    ticket.checkOutTime = new Date().toISOString()
                    message = "Check-out Successful"
                    status = "info"
                } else {
                    message = "Ticket Already Used/Completed"
                    status = "warning"
                }

                if (status === "success") toast.success(message);
                if (status === "info") toast.info(message);
                if (status === "warning") toast.warning(message);

                // Update Storage
                storedTickets[foundTicketIndex] = ticket
                localStorage.setItem("solapur_parking_tickets", JSON.stringify(storedTickets))

                // Show Result
                setScanResult({
                    status,
                    message,
                    ticket,
                    slot
                })
            } else {
                setError("Ticket Not Found in System")
                toast.error("Invalid Ticket: Not found in system");
            }

        } catch (err) {
            setError("Processing Error")
        }
    }

    const handleBack = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
            } catch (ignore) { }
        }
        router.push("/profile"); // Use strict path instead of back() for safety
    }

    return (
        <div className="min-h-screen bg-black/95 text-white p-4 pt-20">
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-white/20">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Scanner</h1>
                            <p className="text-sm text-white/60">Check-in Terminal</p>
                        </div>
                    </div>
                </div>

                {!scanResult && !error && (
                    <div className="space-y-4">
                        <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden relative min-h-[400px] flex flex-col shadow-2xl ring-1 ring-white/10">
                            {/* Camera Area */}
                            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden grouped-scanner">
                                <div id="reader" className="w-full h-full object-cover"></div>

                                {/* Scouting Animation Overlay */}
                                {isScanning && (
                                    <>
                                        <div className="absolute inset-0 border-2 border-green-500/30 z-10 pointer-events-none rounded-lg box-border m-4"></div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-scan z-20"></div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none z-0"></div>
                                    </>
                                )}

                                {!isScanning && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 backdrop-blur-sm">
                                        <div className="text-center space-y-6 p-8">
                                            <div className="relative">
                                                <div className="bg-zinc-800 p-6 rounded-full inline-block relative z-10 ring-4 ring-zinc-800/50">
                                                    <Camera className="h-10 w-10 text-zinc-400" />
                                                </div>
                                                <div className="absolute inset-0 bg-zinc-700/30 blur-xl rounded-full scale-150 animate-pulse"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-semibold text-white">Scanner is Offline</h3>
                                                <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
                                                    Camera access is required to scan parking tickets.
                                                </p>
                                            </div>
                                            <Button onClick={startCamera} size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg shadow-green-900/20 text-md h-12 rounded-xl transition-all hover:scale-105 active:scale-95">
                                                <Power className="mr-2 h-5 w-5" /> Activate Camera
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Debug Log (Visible for troubleshooting) */}
                            <div className="px-4 py-3 bg-zinc-950/80 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono h-24 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-2 opacity-50">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="uppercase tracking-wider">System Log</span>
                                </div>
                                {debugLog.map((l, i) => (
                                    <div key={i} className="py-0.5 border-l-2 border-zinc-800 pl-2 mb-1">{l}</div>
                                ))}
                                {debugLog.length === 0 && <div className="italic opacity-50">Waiting for system initialization...</div>}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Result View */}
                {(scanResult || error) && (
                    <Card className={`border-0 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative ${scanResult?.status === 'success' ? 'bg-gradient-to-br from-green-950 to-emerald-950 ring-1 ring-green-500/30' : error ? 'bg-gradient-to-br from-red-950 to-orange-950 ring-1 ring-red-500/30' : 'bg-zinc-900'}`}>
                        {/* Background Decor */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                        <CardHeader className="text-center pb-6 pt-10 relative z-10">
                            {error ? (
                                <div className="mx-auto bg-red-500/20 p-5 rounded-full w-fit mb-6 ring-1 ring-red-500/40 shadow-lg shadow-red-900/20 animate-in bounce-in duration-500">
                                    <AlertTriangle className="h-14 w-14 text-red-500" />
                                </div>
                            ) : (
                                <div className="mx-auto bg-green-500/20 p-5 rounded-full w-fit mb-6 ring-1 ring-green-500/40 shadow-lg shadow-green-900/20 animate-in bounce-in duration-500">
                                    <CheckCircle2 className="h-14 w-14 text-green-400" />
                                </div>
                            )}

                            <CardTitle className="text-3xl font-bold tracking-tight text-white">{error ? "Scan Failed" : scanResult?.message}</CardTitle>
                            {scanResult?.status === 'success' && <CardDescription className="text-green-200/70 mt-2">Ticket verified successfully</CardDescription>}
                        </CardHeader>

                        {!error && scanResult && (
                            <CardContent className="space-y-8 relative z-10 px-8">
                                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center shadow-inner">
                                    <p className="text-sm text-white/50 mb-2 uppercase tracking-widest font-medium">Allocated Slot</p>
                                    <p className="text-6xl font-mono font-bold text-green-400 tracking-wider drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">{scanResult.slot || "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Vehicle No</p>
                                        <p className="font-mono font-semibold text-lg text-white">{scanResult.ticket.vehicleNo}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Duration</p>
                                        <p className="font-semibold text-lg text-white">{Math.ceil((new Date(scanResult.ticket.endTime).getTime() - new Date(scanResult.ticket.startTime).getTime()) / (1000 * 60 * 60))} <span className="text-sm font-normal text-white/60">Hours</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        )}

                        {error && <CardContent className="text-center text-red-200/80 p-8 pt-0 relative z-10"><p className="text-lg">{error}</p></CardContent>}

                        <div className="p-8 pt-0 relative z-10">
                            <Button className="w-full h-14 text-lg font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-[1.02]" onClick={() => { setScanResult(null); setError(null); setIsScanning(false); }}>
                                <RefreshCw className="mr-2 h-5 w-5" /> Scan Next Vehicle
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
            <style jsx global>{`
                #reader {
                    width: 100%;
                    border: none !important;
                }
                #reader video {
                    object-fit: cover;
                    border-radius: 0.5rem;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    )
}
