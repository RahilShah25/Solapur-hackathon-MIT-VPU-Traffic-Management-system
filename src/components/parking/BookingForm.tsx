"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Fuel, User } from "lucide-react"

export interface VehicleDetails {
    vehicleNo: string
    modelName: string
    type: string
    fuelType: string
    ownerName: string
}

interface BookingFormProps {
    onSubmit: (details: VehicleDetails) => void
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
    const [details, setDetails] = React.useState<VehicleDetails>({
        vehicleNo: "",
        modelName: "",
        type: "",
        fuelType: "",
        ownerName: "",
    })

    const handleChange = (field: keyof VehicleDetails, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }))
    }

    // Expose validity or handle submit externally - for now we just track state
    // But parent needs to know state. Let's rely on parent passing an onChange or similar, 
    // or better: just render inputs and let parent handle the 'Book' button which triggers validation.
    // Actually, to keep it simple, let's just export the form content and let parent manage state? 
    // Or better, make this a controlled component.

    // Let's refactor to be a detailed form part of the dialog
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ownerName" className="text-right">
                    Name
                </Label>
                <div className="col-span-3 relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="ownerName"
                        placeholder="Owner Full Name"
                        className="pl-9"
                        value={details.ownerName}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleChange("ownerName", val);
                            onSubmit({ ...details, ownerName: val });
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleNo" className="text-right">
                    Vehicle No
                </Label>
                <div className="col-span-3 relative">
                    <Car className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="vehicleNo"
                        placeholder="MH-13-AB-1234"
                        className="pl-9 uppercase"
                        value={details.vehicleNo}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleChange("vehicleNo", val);
                            onSubmit({ ...details, vehicleNo: val });
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="modelName" className="text-right">
                    Model
                </Label>
                <div className="col-span-3 relative">
                    <Car className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="modelName"
                        placeholder="e.g. Swift Dzire, Honda City"
                        className="pl-9"
                        value={details.modelName}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleChange("modelName", val);
                            onSubmit({ ...details, modelName: val });
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                    Type
                </Label>
                <div className="col-span-3">
                    <Select onValueChange={(val) => {
                        handleChange("type", val);
                        onSubmit({ ...details, type: val });
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2-wheeler">2 Wheeler (Bike/Scooter)</SelectItem>
                            <SelectItem value="4-wheeler">4 Wheeler (Car/Jeep)</SelectItem>
                            <SelectItem value="heavy">Heavy Vehicle (Truck/Bus)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuel" className="text-right">
                    Fuel
                </Label>
                <div className="col-span-3 relative">
                    <Fuel className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <Select onValueChange={(val) => {
                        handleChange("fuelType", val);
                        onSubmit({ ...details, fuelType: val });
                    }}>
                        <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="cng">CNG</SelectItem>
                            <SelectItem value="electric">Electric (EV)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
