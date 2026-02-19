"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Phone, ShieldAlert, Ambulance, MessageSquare, CheckCircle2, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SOSPage() {
    const [showSOSDialog, setShowSOSDialog] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSOS = () => {
        setIsSending(true)
        setShowSOSDialog(true)

        // Simulate sending signal
        setTimeout(() => {
            setIsSending(false)
            setIsSent(true)
            toast.error("SOS Signal Sent to Control Room!", {
                duration: 5000,
                icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
            })
        }, 1500)
    }

    const handleClose = () => {
        setShowSOSDialog(false)
        setIsSent(false)
        setIsSending(false)
    }

    return (
        <div className="container px-4 pt-28 pb-8 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
                    <ShieldAlert className="h-8 w-8" />
                    Emergency SOS
                </h1>
                <p className="text-muted-foreground mt-2">Instant assistance for accidents and emergencies.</p>
            </div>

            <div className="grid gap-6">
                <Button
                    variant="destructive"
                    size="lg"
                    className="h-32 text-2xl font-bold rounded-2xl shadow-xl shadow-red-500/20 animate-pulse hover:animate-none transition-all hover:scale-105 active:scale-95"
                    onClick={handleSOS}
                >
                    <div className="flex flex-col items-center gap-2">
                        <ShieldAlert className="h-10 w-10" />
                        TAP FOR SOS
                    </div>
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.open('tel:100')}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Phone className="h-8 w-8 text-blue-600 mb-2" />
                            <span className="font-bold">Police (100)</span>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.open('tel:108')}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Ambulance className="h-8 w-8 text-red-600 mb-2" />
                            <span className="font-bold">Ambulance (108)</span>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                            AI Traffic Assistant
                        </CardTitle>
                        <CardDescription>Get help with rules, fines, or non-emergency queries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Our AI assistant is available 24/7 to answer your traffic-related queries.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Custom SOS Dialog */}
            <Dialog open={showSOSDialog} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md border-red-500/20 bg-black/95">
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-bold flex items-center gap-2 ${isSent ? "text-green-500" : "text-red-500"}`}>
                            {isSent ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6 animate-pulse" />}
                            {isSent ? "Help is on the way!" : "Sending Distress Signal..."}
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            {isSent
                                ? "Police Control Room has received your location. Keep your phone line open."
                                : "Connecting to nearest patrol unit and sharing live location coordinates."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-center py-6">
                        {isSent ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                                <MapPin className="h-16 w-16 text-green-500 relative z-10 animate-bounce" />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-ping" />
                                <Loader2 className="h-16 w-16 text-red-500 animate-spin relative z-10" />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            variant={isSent ? "secondary" : "destructive"}
                            className="w-full sm:w-auto font-bold"
                            onClick={handleClose}
                            disabled={!isSent}
                        >
                            {isSent ? "I Understand" : "Cancel Signal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
