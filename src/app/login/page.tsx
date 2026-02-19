"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Shield, Building2, User, Key, FileText, Smartphone, Hash, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

type UserRole = "citizen" | "police" | "admin" | "parking_owner"

export default function LoginPage() {
    const { login } = useAuth()
    const [name, setName] = React.useState("")
    const [role, setRole] = React.useState<UserRole>("citizen")
    const [isLoading, setIsLoading] = React.useState(false)

    // Role specific state
    const [details, setDetails] = React.useState({
        phone: "",
        vehicleNo: "",
        badgeNo: "",
        zone: "",
        password: "",
        licenseNo: "",
        adminKey: ""
    })

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call with a bit more "weight"
        setTimeout(() => {
            const roleDetails: Record<string, unknown> = {}
            if (role === "citizen") {
                roleDetails.phone = details.phone
                roleDetails.vehicleNo = details.vehicleNo
            } else if (role === "police") {
                roleDetails.badgeNo = details.badgeNo
                roleDetails.zone = details.zone
            } else if (role === "parking_owner") {
                roleDetails.phone = details.phone
                roleDetails.licenseNo = details.licenseNo
            }

            login(name, role, roleDetails)
            toast.success(`Welcome back, ${name}!`, {
                description: `Logged in as ${role.replace("_", " ").toUpperCase()}`,
            })
            setIsLoading(false)
        }, 1500)
    }

    const roles = [
        { id: "citizen", label: "Citizen", icon: Car, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { id: "parking_owner", label: "Parking", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { id: "police", label: "Police", icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    ] as const

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">

            {/* Dynamic Background Effects */}
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url(/login-bg.jpg)' }} />
                <div className="absolute inset-0 bg-slate-950/80" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-emerald-500/10 rounded-full blur-[100px]" />
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="container relative z-10 px-4 py-8 mx-auto flex flex-col items-center">

                {/* Header Branding */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8 text-center space-y-2"
                >
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Solapur Smart City
                    </h1>
                    <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">Traffic Management Portal</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-lg"
                >
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/60 shadow-2xl rounded-3xl overflow-hidden">

                        {/* Progress Line */}
                        <motion.div
                            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />

                        <div className="p-8 space-y-8">

                            {/* Role Selection */}
                            <div className="space-y-4">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Select Access Role</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {roles.map((r) => {
                                        const isActive = role === r.id
                                        const Icon = r.icon
                                        return (
                                            <motion.button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setRole(r.id as UserRole)}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group
                                                    ${isActive
                                                        ? `${r.bg} ${r.border} shadow-[0_0_20px_rgba(0,0,0,0.3)]`
                                                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                                                    }`}
                                            >
                                                <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${isActive ? r.color : "text-slate-400 group-hover:text-slate-200"}`} />
                                                <span className={`text-xs font-semibold tracking-wide ${isActive ? "text-slate-100" : "text-slate-500 group-hover:text-slate-300"}`}>
                                                    {r.label}
                                                </span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-role"
                                                        className={`absolute inset-0 rounded-2xl border-2 ${r.border.replace("border-", "border-")}`}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </motion.button>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setRole("admin")}
                                        className={`text-[10px] font-medium transition-colors duration-200 hover:text-primary ${role === 'admin' ? 'text-primary' : 'text-slate-600'}`}
                                    >
                                        Administration Login
                                    </button>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-2 group">
                                        <Label htmlFor="name" className="text-slate-300 group-focus-within:text-primary transition-colors">Full Name</Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <Input
                                                id="name"
                                                placeholder="Enter full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {/* Citizen Fields */}
                                        {role === "citizen" && (
                                            <motion.div
                                                key="citizen-fields"
                                                initial={{ opacity: 0, height: 0, y: 10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div className="space-y-2 group">
                                                    <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                                    <div className="relative">
                                                        <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                        <Input
                                                            id="phone"
                                                            name="phone"
                                                            placeholder="+91 99999 99999"
                                                            value={details.phone}
                                                            onChange={handleDetailsChange}
                                                            className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 group">
                                                    <Label htmlFor="vehicleNo" className="text-slate-300">Vehicle Number <span className="text-slate-600 text-xs ml-2">(Optional)</span></Label>
                                                    <div className="relative">
                                                        <Car className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                        <Input
                                                            id="vehicleNo"
                                                            name="vehicleNo"
                                                            placeholder="MH 13 AB 1234"
                                                            value={details.vehicleNo}
                                                            onChange={handleDetailsChange}
                                                            className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Police & Admin Fields */}
                                        {(role === "police" || role === "admin") && (
                                            <motion.div
                                                key="police-fields"
                                                initial={{ opacity: 0, height: 0, y: 10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="badgeNo" className="text-slate-300">Badge ID</Label>
                                                        <div className="relative">
                                                            <Hash className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                            <Input
                                                                id="badgeNo"
                                                                name="badgeNo"
                                                                placeholder="ID-882"
                                                                value={details.badgeNo}
                                                                onChange={handleDetailsChange}
                                                                className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="zone" className="text-slate-300">Zone</Label>
                                                        <Input
                                                            id="zone"
                                                            name="zone"
                                                            placeholder="North-01"
                                                            value={details.zone}
                                                            onChange={handleDetailsChange}
                                                            className="h-12 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password" className="text-slate-300">Secure Pin</Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                        <Input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            placeholder="••••••••"
                                                            value={details.password}
                                                            onChange={handleDetailsChange}
                                                            className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Parking Owner Fields */}
                                        {role === "parking_owner" && (
                                            <motion.div
                                                key="parking-fields"
                                                initial={{ opacity: 0, height: 0, y: 10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="licenseNo" className="text-slate-300">License Number</Label>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                        <Input
                                                            id="licenseNo"
                                                            name="licenseNo"
                                                            placeholder="LIC-2024-XXXX"
                                                            value={details.licenseNo}
                                                            onChange={handleDetailsChange}
                                                            className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-slate-300">Contact Number</Label>
                                                    <div className="relative">
                                                        <Smartphone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                        <Input
                                                            id="phone"
                                                            name="phone"
                                                            placeholder="+91 00000 00000"
                                                            value={details.phone}
                                                            onChange={handleDetailsChange}
                                                            className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button
                                    className={`w-full h-14 text-base font-bold shadow-lg transition-all duration-300 rounded-xl overflow-hidden relative group
                                    ${role === 'citizen' ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/25' : ''}
                                    ${role === 'police' || role === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-500/25' : ''}
                                    ${role === 'parking_owner' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/25' : ''}
                                    `}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Verifying Credentials...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Access System</span>
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 text-center">
                            <p className="text-xs text-slate-500">
                                Protected by Solapur Smart City Cyber Cell · <a href="#" className="hover:text-primary underline decoration-slate-700 underline-offset-4">Privacy</a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
