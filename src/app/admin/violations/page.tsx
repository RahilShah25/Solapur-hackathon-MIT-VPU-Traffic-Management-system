"use client"

import * as React from "react"
import { useAdmin } from "@/components/admin/AdminContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, MapPin, Clock, Car, AlertTriangle, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RoleGuard from "@/components/auth/RoleGuard"

import CameraCapture from "@/components/common/CameraCapture"
import Link from "next/link"

export default function VerifyViolationsPage() {
    const { violations, approveViolation, rejectViolation } = useAdmin()
    const [selectedViolation, setSelectedViolation] = React.useState<any>(null)
    const [challanDetails, setChallanDetails] = React.useState({
        amount: 500,
        section: "177 MVA",
        notes: "",
        vehicleNo: ""
    })

    // Mock RTO Database
    const mockRegistry: Record<string, any> = {
        "MH-13-AB-1234": { owner: "Rahul Sharma", phone: "+91 9876543210", type: "2-Wheeler", address: "123, Navi Peth, Solapur" },
        "MH-13-XY-9876": { owner: "Anjali Gupta", phone: "+91 9988776655", type: "4-Wheeler", address: "45, Civil Lines, Solapur" },
        "MH-13-CR-5555": { owner: "Rajesh Patil", phone: "+91 8888888888", type: "Heavy", address: "MIDC, Solapur" }
    }

    const handleOpenReview = (v: any) => {
        setSelectedViolation(v)
        // Auto-fill from registry if vehicle number matches
        const regData = mockRegistry[v.vehicleNo]
        setChallanDetails({
            amount: v.amount || 500,
            section: "177 MVA",
            notes: "",
            vehicleNo: v.vehicleNo || ""
        })
    }

    const handleIssueChallan = () => {
        if (!selectedViolation) return
        approveViolation(selectedViolation.id, {
            amount: challanDetails.amount,
            description: `${selectedViolation.description}\n[CHALLAN ISSUED]: Section ${challanDetails.section}. Notes: ${challanDetails.notes}`,
            violatorPhone: mockRegistry[challanDetails.vehicleNo]?.phone,
        })
        setSelectedViolation(null)
    }

    const pendingViolations = violations.filter(v => v.status === "pending")
    // Note: issueInstantChallan is now used in /admin/challan/page.tsx

    return (
        <RoleGuard roles={["admin", "police"]}>
            <div className="container px-4 pt-28 pb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold">Verify Violations & Issue E-Challan</h1>
                    <Link href="/admin/challan">
                        <Button className="bg-red-600 hover:bg-red-700">
                            <Camera className="h-4 w-4 mr-2" />
                            Issue Instant Challan
                        </Button>
                    </Link>
                </div>
                <p className="text-muted-foreground mb-8">Review reports, verify vehicle owner details, and issue digitally signed E-Challans.</p>

                {pendingViolations.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">No pending violations to review.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingViolations.map((v) => (
                            <Card key={v.id} className="overflow-hidden flex flex-col">
                                {v.evidence && (
                                    <div className="aspect-video w-full bg-muted relative group cursor-pointer" onClick={() => handleOpenReview(v)}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={v.evidence} alt="Evidence" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Review Case</span>
                                        </div>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="capitalize">{v.type?.replace("-", " ") || "Violation"}</Badge>
                                        <span className="text-xs text-muted-foreground">{new Date(v.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{v.vehicleNo || "Unknown Vehicle"}</CardTitle>
                                    <CardDescription className="line-clamp-2">{v.location}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">{v.description}</p>
                                </CardContent>
                                <CardFooter className="flex gap-2 bg-muted/20 p-4 mt-auto">
                                    <Button
                                        variant="default"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleOpenReview(v)}
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Verify & Issue
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => rejectViolation(v.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* E-Challan Modal */}
                <Dialog open={!!selectedViolation} onOpenChange={(open) => !open && setSelectedViolation(null)}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Issue E-Challan</DialogTitle>
                            <DialogDescription>Verify details and generate challan for {selectedViolation?.vehicleNo}</DialogDescription>
                        </DialogHeader>

                        {selectedViolation && (
                            <div className="grid md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                    <div className="rounded-lg overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={selectedViolation.evidence} alt="Evidence" className="w-full h-auto" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Reported By</p>
                                            <p className="font-medium">Public Report</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Time</p>
                                            <p className="font-medium">{new Date(selectedViolation.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-muted-foreground">Location</p>
                                            <p className="font-medium">{selectedViolation.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3 border">
                                        <h3 className="font-semibold flex items-center gap-2"><Car className="h-4 w-4" /> RTO Registry Data</h3>
                                        {mockRegistry[selectedViolation.vehicleNo] ? (
                                            <div className="space-y-1 text-sm">
                                                <p><span className="text-muted-foreground">Owner:</span> {mockRegistry[selectedViolation.vehicleNo].owner}</p>
                                                <p><span className="text-muted-foreground">Phone:</span> {mockRegistry[selectedViolation.vehicleNo].phone}</p>
                                                <p><span className="text-muted-foreground">Type:</span> {mockRegistry[selectedViolation.vehicleNo].type}</p>
                                                <p><span className="text-muted-foreground">Address:</span> {mockRegistry[selectedViolation.vehicleNo].address}</p>
                                                <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50">Verified Vehicle</Badge>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-amber-600 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                Vehicle not found in registry. Proceed with caution.
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label>Violated Vehicle Number</Label>
                                            <Input
                                                value={challanDetails.vehicleNo}
                                                onChange={(e) => setChallanDetails({ ...challanDetails, vehicleNo: e.target.value.toUpperCase() })}
                                                placeholder="MH-13-..."
                                                className="uppercase font-mono font-bold text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Violation Section</Label>
                                                <select
                                                    className="w-full p-2 border rounded-md text-sm"
                                                    value={challanDetails.section}
                                                    onChange={(e) => setChallanDetails({ ...challanDetails, section: e.target.value })}
                                                >
                                                    <option value="177 MVA">177 MVA (General)</option>
                                                    <option value="184 MVA">184 MVA (Dangerous Driving)</option>
                                                    <option value="129 MVA">129 MVA (No Helmet)</option>
                                                    <option value="No Parking">No Parking</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Fine Amount (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={challanDetails.amount}
                                                    onChange={(e) => setChallanDetails({ ...challanDetails, amount: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>



                                        <div className="space-y-2">
                                            <Label>Officer Notes</Label>
                                            <Textarea
                                                value={challanDetails.notes}
                                                onChange={(e) => setChallanDetails({ ...challanDetails, notes: e.target.value })}
                                                placeholder="Enter challan remarks..."
                                                className="h-20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedViolation(null)}>Cancel</Button>
                            <Button onClick={handleIssueChallan} className="bg-red-600 hover:bg-red-700">
                                Issue Challan of ₹{challanDetails.amount}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </RoleGuard>
    )
}
