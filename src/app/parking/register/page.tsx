"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import RoleGuard from "@/components/auth/RoleGuard"
import { useAdmin } from "@/components/admin/AdminContext"
import { toast } from "sonner"

export default function ParkingRegisterPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { submitParkingRequest } = useAdmin()
    const [facilities, setFacilities] = React.useState<string[]>([])

    const toggleFacility = (facility: string) => {
        setFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate file upload getting a URL
        const mockDocUrl = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop"

        setTimeout(() => {
            const form = e.target as HTMLFormElement
            const price = parseInt((form.querySelector('#price') as HTMLInputElement).value) || 15

            submitParkingRequest({
                ownerName: (form.querySelector('#name') as HTMLInputElement).value,
                phone: (form.querySelector('#phone') as HTMLInputElement).value,
                location: (form.querySelector('#address') as HTMLTextAreaElement).value,
                slots: parseInt((form.querySelector('#slots') as HTMLInputElement).value) || 0,
                pricePerHour: price,
                facilities: facilities,
                govIdUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop", // Mock Gov ID
                landRegistryUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop" // Mock Registry Paper
            })
            setIsSubmitting(false)
            toast.success("Registration submitted!", { description: "Pending Admin Verification." })
            router.push("/profile")
        }, 1500)
    }

    return (
        <RoleGuard roles={["parking_owner", "admin", "citizen", "police"]}>
            <div className="container px-4 py-8 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Register Parking Space</CardTitle>
                        <CardDescription>
                            Monetize your empty space by registering it as a verified parking spot.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Owner Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" placeholder="+91 0000000000" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Space Details</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address / Location</Label>
                                    <Textarea id="address" placeholder="Nearby Landmark..." required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="slots">Number of Slots</Label>
                                        <Input id="slots" type="number" min="1" placeholder="e.g 5" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price Per Hour (₹)</Label>
                                        <Input id="price" type="number" min="5" placeholder="e.g 20" required />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label>Facilities Available</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["CCTV", "Covered", "Security Guard", "24/7 Access", "EV Charging", "Valet"].map((fac) => (
                                            <div key={fac} className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted" onClick={() => toggleFacility(fac)}>
                                                <div className={`h-4 w-4 rounded border flex items-center justify-center ${facilities.includes(fac) ? "bg-primary border-primary" : "border-input"}`}>
                                                    {facilities.includes(fac) && <div className="h-2 w-2 rounded-sm bg-primary-foreground" />}
                                                </div>
                                                <span className="text-sm">{fac}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Legal Documents Verification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <FileText className="h-8 w-8 mx-auto text-primary" />
                                        <p className="text-sm font-medium">Upload Government ID</p>
                                        <p className="text-xs text-muted-foreground">(Aadhar / PAN / Voter ID)</p>
                                        <Input type="file" className="max-w-xs mx-auto mt-2" accept="image/*,.pdf" />
                                    </div>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <FileText className="h-8 w-8 mx-auto text-primary" />
                                        <p className="text-sm font-medium">Upload Land Registry Paper</p>
                                        <p className="text-xs text-muted-foreground">(7/12 Extract / Property Card)</p>
                                        <Input type="file" className="max-w-xs mx-auto mt-2" accept="image/*,.pdf" />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit for Verification"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    )
}
