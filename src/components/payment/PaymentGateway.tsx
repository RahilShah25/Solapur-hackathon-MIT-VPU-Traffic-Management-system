"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { CreditCard, Wallet, Building, CheckCircle2, Loader2, IndianRupee } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentGatewayProps {
    isOpen: boolean
    onClose: () => void
    amount: number
    onSuccess: () => void
    title?: string
    description?: string
}

export default function PaymentGateway({
    isOpen,
    onClose,
    amount,
    onSuccess,
    title = "Secure Payment",
    description = "Select a payment method to proceed."
}: PaymentGatewayProps) {
    const [step, setStep] = React.useState<"select" | "processing" | "success">("select")
    const [method, setMethod] = React.useState("upi")

    // Reset state when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            setStep("select")
            setMethod("upi")
        }
    }, [isOpen])

    const handlePay = () => {
        setStep("processing")

        // Simulate processing delay
        setTimeout(() => {
            setStep("success")

            // Wait a bit before closing and triggering success
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 2000)
        }, 3000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <AnimatePresence mode="wait">
                    {step === "select" && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <IndianRupee className="h-5 w-5 text-primary" />
                                    </div>
                                    {title}
                                </DialogTitle>
                                <DialogDescription>{description}</DialogDescription>
                            </DialogHeader>

                            <div className="py-6 space-y-6">
                                <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center border">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold">₹{amount}</span>
                                </div>

                                <RadioGroup defaultValue="upi" value={method} onValueChange={setMethod} className="space-y-3">
                                    <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${method === 'upi' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:bg-muted/80'}`}>
                                        <RadioGroupItem value="upi" id="upi" />
                                        <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-3 font-medium">
                                            <Wallet className="h-5 w-5 text-orange-500" />
                                            UPI / Wallets
                                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Fastest</span>
                                        </Label>
                                    </div>
                                    <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${method === 'card' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:bg-muted/80'}`}>
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3 font-medium">
                                            <CreditCard className="h-5 w-5 text-blue-500" />
                                            Credit / Debit Card
                                        </Label>
                                    </div>
                                    <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${method === 'netbanking' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:bg-muted/80'}`}>
                                        <RadioGroupItem value="netbanking" id="netbanking" />
                                        <Label htmlFor="netbanking" className="flex-1 cursor-pointer flex items-center gap-3 font-medium">
                                            <Building className="h-5 w-5 text-purple-500" />
                                            Net Banking
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {method === 'card' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="space-y-3 pt-2"
                                    >
                                        <Input placeholder="Card Number" className="font-mono" />
                                        <div className="flex gap-3">
                                            <Input placeholder="MM/YY" className="font-mono" />
                                            <Input placeholder="CVV" className="font-mono" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={onClose}>Cancel</Button>
                                <Button onClick={handlePay} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                                    Pay ₹{amount}
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Processing Payment</h3>
                                <p className="text-muted-foreground">Please do not close this window...</p>
                            </div>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-green-700">Payment Successful!</h3>
                                <p className="text-muted-foreground">Redirecting you back...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
