"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, Receipt } from "lucide-react"
import RoleGuard from "@/components/auth/RoleGuard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import PaymentGateway from "@/components/payment/PaymentGateway"

const mockFines = [
    { id: "TR-2024-001", violation: "Red Light Jump", location: "Saat Rasta Chowk", date: "2024-02-10", amount: 500, status: "pending", image: "https://images.unsplash.com/photo-1566427382025-a1344446b772?q=80&w=300&auto=format&fit=crop" },
    { id: "TR-2024-045", violation: "No Parking", location: "Hotgi Road", date: "2024-01-25", amount: 200, status: "paid", image: null },
    { id: "TR-2024-089", violation: "Without Helmet", location: "Old Employment Chowk", date: "2024-02-15", amount: 1000, status: "pending", image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=300&auto=format&fit=crop" },
]

export default function FinesPage() {
    const [selectedFine, setSelectedFine] = React.useState<typeof mockFines[0] | null>(null)
    const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)

    const handlePaymentSuccess = () => {
        setIsPaymentOpen(false)
        toast.success("Payment Successful!", { description: "Receipt sent to your email." })
        // In a real app, update state here (e.g. move fine to 'paid')
        // For prototype, we just close the dialog
        document.getElementById("close-dialog")?.click()
    }

    return (
        <RoleGuard>
            <div className="container px-4 pt-28 pb-12 max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <Receipt className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">My Challans</h1>
                        <p className="text-muted-foreground">View and pay your pending traffic fines.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockFines.map((fine, index) => (
                        <Card key={fine.id} className="group overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-3 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <Badge variant={fine.status === "pending" ? "destructive" : "secondary"} className="mb-2">
                                        {fine.status === "pending" ? "Pending Payment" : "Paid"}
                                    </Badge>
                                    <span className="font-mono text-xs text-muted-foreground">{fine.id}</span>
                                </div>
                                <CardTitle className="text-lg">{fine.violation}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPinIcon className="h-3 w-3" /> {fine.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Violation Date</p>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {fine.date}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Fine Amount</p>
                                        <p className="text-2xl font-bold text-primary">₹{fine.amount}</p>
                                    </div>
                                </div>

                                {fine.status === "pending" && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-md shadow-red-500/20" onClick={() => setSelectedFine(fine)}>
                                                Pay Now
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Pay Challan {selectedFine?.id}</DialogTitle>
                                                <DialogDescription>
                                                    Payment for {selectedFine?.violation} at {selectedFine?.location}.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 py-2">
                                                {selectedFine?.image && (
                                                    <div className="rounded-xl overflow-hidden border relative group/image">
                                                        <img src={selectedFine.image} alt="Violation Evidence" className="w-full h-48 object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs font-medium">Evidence Photo</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Challan No</span>
                                                        <span className="font-mono">{selectedFine?.id}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Violation</span>
                                                        <span className="font-medium">{selectedFine?.violation}</span>
                                                    </div>
                                                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                                                        <span className="font-semibold">Total Payable</span>
                                                        <span className="text-2xl font-bold text-primary">₹{selectedFine?.amount}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button className="w-full h-11 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/20" onClick={() => setIsPaymentOpen(true)}>
                                                    Proceed to Pay
                                                </Button>
                                            </DialogFooter>

                                            <PaymentGateway
                                                isOpen={isPaymentOpen}
                                                onClose={() => setIsPaymentOpen(false)}
                                                amount={selectedFine?.amount || 0}
                                                onSuccess={handlePaymentSuccess}
                                                title={`Pay Challan ${selectedFine?.id}`}
                                                description={`Payment for ${selectedFine?.violation}`}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}

                                {fine.status === "paid" && (
                                    <Button variant="outline" className="w-full cursor-default hover:bg-background opacity-75" disabled>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Paid on {fine.date}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </RoleGuard>
    )
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
