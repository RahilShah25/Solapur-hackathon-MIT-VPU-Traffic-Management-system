"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, MapPin, Upload, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import RoleGuard from "@/components/auth/RoleGuard"
import { useAdmin } from "@/components/admin/AdminContext"
import { toast } from "sonner"

export default function ReportPage() {
    const router = useRouter()
    const [location, setLocation] = React.useState("")
    const [file, setFile] = React.useState<File | null>(null)
    const [preview, setPreview] = React.useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleLocationDetect = () => {
        // Simulate geolocation
        setLocation("Scanning location...")
        setTimeout(() => {
            setLocation("123, Navi Peth, Solapur")
        }, 1500)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const { submitViolation } = useAdmin()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            toast.error("Please upload an image or video evidence.")
            return
        }
        setIsSubmitting(true)

        // Simulate upload delay
        setTimeout(() => {
            const form = e.target as HTMLFormElement
            const select = form.querySelector('select') as HTMLSelectElement
            submitViolation({
                type: select.value || "General",
                vehicleNo: (form.querySelector('#vehicleNo') as HTMLInputElement).value || "UNKNOWN",
                vehicleType: (form.querySelector('#vehicleType') as HTMLSelectElement)?.value,
                location: location,
                description: (document.getElementById('description') as HTMLTextAreaElement).value,
                evidence: preview || undefined
            })
            setIsSubmitting(false)
            toast.success("Report submitted successfully!", { description: "Pending Police Verification." })
            router.push("/profile")
        }, 1500)
    }

    return (
        <RoleGuard>
            <div className="container px-4 pt-28 pb-8 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Report Violation</h1>
                            <p className="text-muted-foreground">Submit details of traffic violations. Rewards for valid reports.</p>
                        </div>
                    </div>

                    <Card className="border-t-4 border-t-blue-500 shadow-lg overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-6 border-b">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Upload className="h-5 w-5 text-blue-600" />
                                Incident Details
                            </CardTitle>
                            <CardDescription>
                                Please provide accurate information. False reporting may lead to account suspension.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Media Upload (Mandatory) */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Evidence (Photo/Video)</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${preview ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}`}
                                        onClick={() => !preview && fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                        />

                                        <AnimatePresence mode="wait">
                                            {preview ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="relative w-full"
                                                >
                                                    <img src={preview} alt="Evidence" className="max-h-[350px] w-full object-contain rounded-lg shadow-sm" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setFile(null)
                                                            setPreview(null)
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                                        {(file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0")} MB
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="text-center space-y-4">
                                                    <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                        <Camera className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium">Click to upload evidence</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Supported formats: JPG, PNG, MP4</p>
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                                        <div className="relative">
                                            <select
                                                id="vehicleType"
                                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:bg-accent/50 transition-colors"
                                            >
                                                <option value="2-wheeler">2-Wheeler (Bike/Scooter)</option>
                                                <option value="4-wheeler">4-Wheeler (Car/Jeep)</option>
                                                <option value="heavy">Heavy Vehicle (Truck/Bus)</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicleNo">Vehicle Number</Label>
                                        <Input
                                            id="vehicleNo"
                                            placeholder="e.g. MH 13 AB 1234"
                                            className="uppercase font-mono tracking-wider h-11 bg-background/50 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                placeholder="Enter location or detect automatically"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                required
                                                className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                                            />
                                        </div>
                                        <Button type="button" variant="outline" onClick={handleLocationDetect} className="h-11 px-4 border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Target
                                        </Button>
                                    </div>
                                </div>

                                {/* Violation Type */}
                                <div className="space-y-2">
                                    <Label>Violation Type</Label>
                                    <Select required>
                                        <SelectTrigger className="h-11 bg-background/50 focus:bg-background transition-colors">
                                            <SelectValue placeholder="Select violation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no-parking">No Parking Zone</SelectItem>
                                            <SelectItem value="red-light">Red Light Jump</SelectItem>
                                            <SelectItem value="helmet">Without Helmet</SelectItem>
                                            <SelectItem value="wrong-side">Wrong Side Driving</SelectItem>
                                            <SelectItem value="rash-driving">Rash Driving</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add any additional details about the incident..."
                                        className="resize-none min-h-[100px] bg-background/50 focus:bg-background transition-colors"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>Uploading Report...</>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-5 w-5" /> Submit Report
                                        </>
                                    )}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </RoleGuard>
    )
}
