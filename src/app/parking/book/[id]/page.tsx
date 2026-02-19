"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, ArrowLeft, MapPin, Clock, Calendar } from "lucide-react"
import BookingForm, { VehicleDetails } from "@/components/parking/BookingForm"
import QRCodeTicket from "@/components/parking/QRCodeTicket"
import { toast } from "sonner"
import { useAdmin } from "@/components/admin/AdminContext"
import RoleGuard from "@/components/auth/RoleGuard"
import PaymentGateway from "@/components/payment/PaymentGateway"

// Duplicated for now to ensure consistency - ideally move to a shared constant/context
const staticParkingSpots = [
    { id: "1", name: "City Center Mall", address: "Station Road, Solapur", slots: 15, price: 20, image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=500&auto=format&fit=crop" },
    { id: "2", name: "Railway Station Parking", address: "Railway Lines", slots: 5, price: 10, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500&auto=format&fit=crop" },
    { id: "3", name: "Market Yard Plaza", address: "Market Yard", slots: 0, price: 15, image: "https://images.unsplash.com/photo-1626863905192-3efff9758136?q=80&w=500&auto=format&fit=crop" },
]

export default function BookingPage() {
    const params = useParams()
    const router = useRouter()
    const { parkingRequests } = useAdmin()

    // Combine static spots with approved dynamic spots to find the target
    // Note: In a real app this would be a backend call by ID
    const approvedSpots = parkingRequests
        .filter(p => p.status === "approved")
        .map(p => ({
            id: p.id,
            name: `${p.ownerName}'s Space`,
            address: p.location,
            slots: p.slots,
            price: 15,
            image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=500&auto=format&fit=crop"
        }))

    const allParkingSpots = [...staticParkingSpots, ...approvedSpots]
    const spotId = params?.id as string
    const selectedSpot = allParkingSpots.find(s => s.id === spotId)

    const [bookingTime, setBookingTime] = React.useState("2")
    const [bookingStep, setBookingStep] = React.useState<"details" | "confirmed">("details")
    const [vehicleDetails, setVehicleDetails] = React.useState<VehicleDetails | null>(null)
    const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)
    const [bookingTimeStart] = React.useState(() => Date.now())

    // Generate Ticket ID
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ticketId = React.useMemo(() => "TKT-" + Math.floor(Math.random() * 100000), [bookingStep === "confirmed"])

    const handleDetailsSubmit = (details: VehicleDetails) => {
        setVehicleDetails(details)
    }

    const handlePayment = () => {
        if (!vehicleDetails || !vehicleDetails.vehicleNo) {
            toast.error("Please enter vehicle details.")
            return
        }
        setIsPaymentOpen(true)
    }

    const handlePaymentSuccess = () => {
        setBookingStep("confirmed")
        setIsPaymentOpen(false)

        // SAVE TICKET TO LOCAL STORAGE
        if (selectedSpot && vehicleDetails) {
            const newTicket = {
                ticketId: ticketId,
                userId: "USR-CURRENT",
                vehicleNo: vehicleDetails.vehicleNo,
                spotName: selectedSpot.name,
                startTime: Date.now(),
                endTime: Date.now() + (parseInt(bookingTime) * 60 * 60 * 1000),
                amount: parseInt(bookingTime) * selectedSpot.price,
                status: "active"
            }

            const existingTickets = JSON.parse(localStorage.getItem("solapur_parking_tickets") || "[]")
            localStorage.setItem("solapur_parking_tickets", JSON.stringify([newTicket, ...existingTickets]))
            toast.success("Booking Confirmed!", { description: "Ticket has been saved to your account." })
        }
    }

    if (!selectedSpot) {
        return (
            <div className="container pt-32 text-center">
                <h2 className="text-xl font-bold">Parking Spot Not Found</h2>
                <Button variant="link" onClick={() => router.push('/parking')}>Back to Parking</Button>
            </div>
        )
    }

    return (
        <RoleGuard>
            <div className="container max-w-2xl px-4 pt-28 pb-12 mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Parking List
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Book Parking Spot</h1>
                    <div className="flex items-center text-muted-foreground gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedSpot.name}, {selectedSpot.address}</span>
                    </div>
                </div>

                <div className="grid gap-8">
                    <Card className="overflow-hidden border-2 shadow-sm">
                        <div className="h-40 bg-muted relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div className="text-white">
                                    <p className="font-bold text-lg">₹{selectedSpot.price}/hr</p>
                                </div>
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle>
                                {bookingStep === "details" && "1. Vehicle Details"}
                                {bookingStep === "confirmed" && "Booking Confirmed"}
                            </CardTitle>
                            <CardDescription>
                                {bookingStep === "details" && "Enter your vehicle information to reserve this spot."}
                                {bookingStep === "confirmed" && "Please save your ticket QR code."}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {bookingStep === "details" && (
                                <div className="space-y-6">
                                    <BookingForm onSubmit={handleDetailsSubmit} />

                                    <div className="bg-muted/30 p-4 rounded-xl space-y-4 border">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Clock className="h-4 w-4" /> Duration
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label>Hours</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="24"
                                                    value={bookingTime}
                                                    onChange={(e) => setBookingTime(e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <Label>Total Amount</Label>
                                                <div className="text-2xl font-bold text-primary mt-1">
                                                    ₹{parseInt(bookingTime || "0") * selectedSpot.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {bookingStep === "confirmed" && vehicleDetails && (
                                <div className="py-2">
                                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center">
                                        <p className="font-bold">Payment Successful!</p>
                                        <p className="text-sm">Your spot at {selectedSpot.name} is reserved.</p>
                                    </div>

                                    <div className="flex justify-center">
                                        <QRCodeTicket data={{
                                            ticketId: ticketId,
                                            userId: "USR-CURRENT",
                                            vehicleNo: vehicleDetails.vehicleNo,
                                            spotName: selectedSpot.name,
                                            startTime: bookingTimeStart,
                                            endTime: bookingTimeStart + (parseInt(bookingTime) * 60 * 60 * 1000),
                                            amount: parseInt(bookingTime) * selectedSpot.price
                                        }} />
                                    </div>

                                    <div className="mt-6 space-y-2 text-sm text-center text-muted-foreground">
                                        <p>Valid from: <span className="font-medium text-foreground">{new Date(bookingTimeStart).toLocaleTimeString()}</span></p>
                                        <p>Valid until: <span className="font-medium text-foreground">{new Date(bookingTimeStart + (parseInt(bookingTime) * 60 * 60 * 1000)).toLocaleTimeString()}</span></p>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="bg-muted/10 border-t p-6">
                            {bookingStep === "details" && (
                                <Button
                                    className="w-full h-12 text-lg font-semibold"
                                    onClick={handlePayment}
                                    disabled={!vehicleDetails?.vehicleNo || !bookingTime}
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pay ₹{parseInt(bookingTime || "0") * selectedSpot.price}
                                </Button>
                            )}
                            {bookingStep === "confirmed" && (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => router.push('/parking')}
                                >
                                    Done
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <PaymentGateway
                        isOpen={isPaymentOpen}
                        onClose={() => setIsPaymentOpen(false)}
                        amount={parseInt(bookingTime || "0") * selectedSpot.price}
                        onSuccess={handlePaymentSuccess}
                        title={`Book Spot at ${selectedSpot.name}`}
                        description="Complete payment to reserve your spot."
                    />
                </div>
            </div>
        </RoleGuard>
    )
}
