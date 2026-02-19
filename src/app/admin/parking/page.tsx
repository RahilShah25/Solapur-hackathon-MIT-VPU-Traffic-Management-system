"use client"

import * as React from "react"
import { useAdmin } from "@/components/admin/AdminContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Phone, User, IndianRupee, FileText } from "lucide-react"
import RoleGuard from "@/components/auth/RoleGuard"

export default function VerifyParkingPage() {
    const { parkingRequests, approveParking, rejectParking } = useAdmin()
    const pendingRequests = parkingRequests.filter(p => p.status === "pending")

    return (
        <RoleGuard roles={["admin", "police"]}>
            <div className="container px-4 pt-28 pb-8">
                <h1 className="text-3xl font-bold mb-2">Parking Approvals</h1>
                <p className="text-muted-foreground mb-8">Verify new parking spot registrations from owners.</p>

                {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">No pending parking requests.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingRequests.map((p) => (
                            <Card key={p.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary">Slots: {p.slots}</Badge>
                                        <span className="text-xs text-muted-foreground">{new Date(p.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{p.location}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {p.govIdUrl && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">Gov ID Proof</p>
                                                <div className="aspect-video w-full bg-muted relative rounded-md overflow-hidden border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={p.govIdUrl} alt="Gov ID" className="object-cover w-full h-full hover:scale-105 transition-transform" />
                                                </div>
                                            </div>
                                        )}
                                        {p.landRegistryUrl && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">Land Registry</p>
                                                <div className="aspect-video w-full bg-muted relative rounded-md overflow-hidden border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={p.landRegistryUrl} alt="Land Registry" className="object-cover w-full h-full hover:scale-105 transition-transform" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="font-medium">{p.ownerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span>{p.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span>₹{p.pricePerHour}/hr</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {p.facilities.map((fac, i) => (
                                            <Badge key={i} variant="outline" className="text-xs font-normal">{fac}</Badge>
                                        ))}
                                    </div>

                                    <div className="pt-2 border-t text-xs text-muted-foreground">
                                        Verified Legal Documents Required.
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2 bg-muted/20 p-4 mt-auto">
                                    <Button
                                        variant="default"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => approveParking(p.id)}
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => rejectParking(p.id)}
                                    >
                                        <X className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
