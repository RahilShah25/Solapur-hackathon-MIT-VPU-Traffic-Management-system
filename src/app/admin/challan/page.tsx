
"use client"

import * as React from "react"
import { useAdmin } from "@/components/admin/AdminContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Camera, MapPin, Check, ArrowLeft } from "lucide-react"
import CameraCapture from "@/components/common/CameraCapture"
import RoleGuard from "@/components/auth/RoleGuard"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function InstantChallanPage() {
    const { issueInstantChallan } = useAdmin()
    const router = useRouter()

    const [showCamera, setShowCamera] = React.useState(false)
    const [instantData, setInstantData] = React.useState({
        vehicleNo: "",
        location: "",
        section: "177 MVA",
        amount: 500,
        notes: "",
        evidence: "",
        violatorPhone: ""
    })

    // Mock RTO Database (duplicated for now, ideal to move to valid context or helper)
    const mockRegistry: Record<string, any> = {
        "MH-13-AB-1234": { owner: "Rahul Sharma", phone: "+91 9876543210", type: "2-Wheeler", address: "123, Navi Peth, Solapur" },
        "MH-13-XY-9876": { owner: "Anjali Gupta", phone: "+91 9988776655", type: "4-Wheeler", address: "45, Civil Lines, Solapur" },
        "MH-13-CR-5555": { owner: "Rajesh Patil", phone: "+91 8888888888", type: "Heavy", address: "MIDC, Solapur" }
    }

    const handleInstantSubmit = () => {
        if (!instantData.vehicleNo || !instantData.location) {
            toast.error("Please fill in Vehicle Number and Location")
            return
        }

        // Auto-fill phone from registry if exists and not manually entered
        const regData = mockRegistry[instantData.vehicleNo]
        const phoneToUse = regData?.phone || instantData.violatorPhone

        issueInstantChallan({
            type: instantData.section === "No Parking" ? "no-parking" : "traffic-violation",
            location: instantData.location,
            description: `[INSTANT CHALLAN] Section: ${instantData.section}. Notes: ${instantData.notes}`,
            vehicleNo: instantData.vehicleNo,
            amount: instantData.amount,
            evidence: instantData.evidence || "https://images.unsplash.com/photo-1599365593685-2a2ec9afc202?w=500&auto=format&fit=crop",
            violatorPhone: phoneToUse,
            vehicleType: regData?.type || "Unknown"
        })

        toast.success("Instant Challan Issued Successfully!")
        router.push("/admin/violations")
    }

    return (
        <RoleGuard roles={["admin", "police"]}>
            <div className="container max-w-5xl px-4 pt-32 pb-12 mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-red-600" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="flex items-center gap-4 mb-8 border-b pb-6">
                    <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl text-red-600 shadow-sm ring-1 ring-red-500/20">
                        <Camera className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">Instant E-Challan</h1>
                        <p className="text-muted-foreground text-lg">Issue on-the-spot fine with photographic evidence.</p>
                    </div>
                </div>

                {showCamera ? (
                    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col justify-center animate-in fade-in duration-300">
                        <CameraCapture
                            onCapture={(imageData) => {
                                setInstantData(prev => ({ ...prev, evidence: imageData }))
                                setShowCamera(false)
                            }}
                            onClose={() => setShowCamera(false)}
                        />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Evidence */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="overflow-hidden shadow-lg border-muted/50 transition-all hover:shadow-xl group">
                                <CardHeader className="bg-muted/30 pb-4 border-b">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-primary" />
                                        Evidence
                                    </CardTitle>
                                    <CardDescription>Capture vehicle violation photo</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 bg-gradient-to-b from-background to-muted/20">
                                    <div
                                        className="aspect-[3/4] w-full rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all relative overflow-hidden group-hover:scale-[1.02] duration-300"
                                        onClick={() => setShowCamera(true)}
                                    >
                                        {instantData.evidence ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={instantData.evidence} alt="Evidence" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                                        <Camera className="h-8 w-8" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md font-medium border border-white/10">
                                                    Tap to Retake
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground p-6">
                                                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 shadow-inner ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                                                    <Camera className="h-10 w-10 text-primary/60 group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="font-semibold text-foreground">Tap to Capture</p>
                                                <p className="text-sm mt-1">Photo of Number Plate</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Violation Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-lg border-muted/50">
                                <CardHeader className="bg-muted/30 pb-4 border-b">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-600" />
                                        Violation Details
                                    </CardTitle>
                                    <CardDescription>Enter vehicle and fine information</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Vehicle Number</Label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1 group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground group-focus-within:text-primary transition-colors">IND</div>
                                                <Input
                                                    placeholder="MH-13-AB-1234"
                                                    value={instantData.vehicleNo}
                                                    onChange={(e) => setInstantData({ ...instantData, vehicleNo: e.target.value.toUpperCase() })}
                                                    className="pl-14 uppercase font-mono font-bold text-xl tracking-widest h-14 border-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 transition-all bg-muted/50 focus:bg-background"
                                                    maxLength={13}
                                                />
                                            </div>
                                            {mockRegistry[instantData.vehicleNo] ? (
                                                <div className="flex flex-col justify-center px-6 bg-green-500/10 border border-green-500/20 rounded-lg min-w-[120px] items-center">
                                                    <Check className="h-6 w-6 text-green-600 mb-1" />
                                                    <span className="text-xs font-bold text-green-700">VERIFIED</span>
                                                </div>
                                            ) : instantData.vehicleNo.length > 5 && (
                                                <div className="flex flex-col justify-center px-6 bg-amber-500/10 border border-amber-500/20 rounded-lg min-w-[120px] items-center">
                                                    <span className="text-xs font-bold text-amber-700">UNKNOWN</span>
                                                </div>
                                            )}
                                        </div>
                                        {mockRegistry[instantData.vehicleNo] && (
                                            <div className="bg-blue-500/5 p-4 rounded-xl text-sm border border-blue-200/20 flex flex-wrap gap-x-8 gap-y-2 animate-in slide-in-from-top-2">
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-muted-foreground">Owner:</span>
                                                    <span className="font-medium bg-background px-2 py-0.5 rounded border">{mockRegistry[instantData.vehicleNo].owner}</span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-muted-foreground">Type:</span>
                                                    <span className="font-medium bg-background px-2 py-0.5 rounded border">{mockRegistry[instantData.vehicleNo].type}</span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-muted-foreground">Address:</span>
                                                    <span className="font-medium bg-background px-2 py-0.5 rounded border">{mockRegistry[instantData.vehicleNo].address}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter location"
                                                    className="pl-10 h-10 bg-muted/30 focus:bg-background transition-colors"
                                                    value={instantData.location}
                                                    onChange={(e) => setInstantData({ ...instantData, location: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Fine Amount (₹)</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 font-bold text-muted-foreground">₹</span>
                                                <Input
                                                    type="number"
                                                    className="pl-8 font-bold h-10 bg-muted/30 focus:bg-background transition-colors"
                                                    value={instantData.amount}
                                                    onChange={(e) => setInstantData({ ...instantData, amount: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Violation Type</Label>
                                        <select
                                            className="w-full h-11 px-3 border rounded-md text-sm bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all cursor-pointer"
                                            value={instantData.section}
                                            onChange={(e) => setInstantData({ ...instantData, section: e.target.value })}
                                        >
                                            <option value="177 MVA">177 MVA (General Traffic Violation)</option>
                                            <option value="184 MVA">184 MVA (Dangerous Driving)</option>
                                            <option value="129 MVA">129 MVA (Driving Without Helmet)</option>
                                            <option value="No Parking">No Parking Violation</option>
                                            <option value="Signal Jump">Signal Jump / Red Light Violation</option>
                                        </select>
                                    </div>


                                    <div className="space-y-2">
                                        <Label>Officer Remarks (Optional)</Label>
                                        <Textarea
                                            value={instantData.notes}
                                            onChange={(e) => setInstantData({ ...instantData, notes: e.target.value })}
                                            placeholder="Add specific details about the violation..."
                                            className="h-24 resize-none bg-muted/30 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </CardContent>
                                <div className="p-6 bg-muted/10 border-t flex flex-col gap-3">
                                    <Button
                                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 h-14 text-lg font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-[1.01] hover:shadow-red-500/30"
                                        onClick={handleInstantSubmit}
                                        disabled={!instantData.evidence || !instantData.vehicleNo}
                                    >
                                        Issue Challan
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        This action will immediately generate a challan and notify the vehicle owner.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
