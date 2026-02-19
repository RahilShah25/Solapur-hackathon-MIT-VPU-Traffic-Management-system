"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, MessageSquare, Send, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    id: string
    role: "user" | "assistant"
    text: string
    timestamp: number
}

// Pre-defined responses based on keywords and user roles
const getAIResponse = (query: string, userRole: string): string => {
    const lowerQuery = query.toLowerCase()

    if (userRole === "police") {
        if (lowerQuery.includes("code") || lowerQuery.includes("fine")) return "📋 **Traffic Violation Codes**:\n- **184 MV Act**: Dangerous Driving (₹1000-₹5000)\n- **185 MV Act**: Drunk Driving (₹10000+)\n- **194D**: Helmet Violation (₹1000 + 3-month Disqualification)"
        if (lowerQuery.includes("procedure") || lowerQuery.includes("accident")) return "🚨 **Accident Protocol**:\n1. Secure the scene and ensure safety.\n2. Call ambulance if injuries present.\n3. Document scene with photos/videos.\n4. Clear traffic if possible.\n5. File FIR immediately."
        if (lowerQuery.includes("deployment") || lowerQuery.includes("duty")) return "👮 **Deployment Status**: Current shift strength is 85%. High density at Market Yard and Saat Rasta."
    }

    if (userRole === "parking_owner") {
        if (lowerQuery.includes("occupancy") || lowerQuery.includes("full")) return "🅿️ **Occupancy Tips**: Your lot is 80% full. Consider enabling 'Dynamic Pricing' for the last 20% slots to maximize revenue."
        if (lowerQuery.includes("revenue") || lowerQuery.includes("earnings")) return "💰 **Revenue Insight**: Peak hours are 11 AM - 4 PM. Try offering 'Early Bird' discounts to spread the load."
        if (lowerQuery.includes("scanner") || lowerQuery.includes("qr")) return "📱 **Scanner Issue?**: Ensure good lighting. If the app freezes, clear cache or restart. Contact support at +91-9922-HELP if persistent."
    }

    // Default Citizen / General responses
    if (lowerQuery.includes("fine") || lowerQuery.includes("challan")) return "🧾 **Fines**: You can check and pay pending challans in the 'My Fines' section. Always wear a helmet to avoid a ₹1000 penalty!"
    if (lowerQuery.includes("parking") || lowerQuery.includes("park")) return "🚗 **Parking**: Use the 'Parking' tab to find nearby spots. Green markers indicate available slots."
    if (lowerQuery.includes("traffic") || lowerQuery.includes("route")) return "🚦 **Traffic Update**: Heavy congestion reported at Market Chowk. Suggested alternate route: Ring Road."
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) return `👋 Hello! I'm your Solapur Traffic AI Assistant. How can I help you today?`

    return "🤖 I'm still learning! Try asking about **Fines**, **Parking**, **Traffic Rules**, or **Safety Tips**."
}

export default function TrafficAiAssistant() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = React.useState(false)
    const [input, setInput] = React.useState("")
    const [messages, setMessages] = React.useState<Message[]>(() => [
        { id: "1", role: "assistant", text: "👋 Hi there! Need help with traffic rules, parking, or safety? Ask me anything!", timestamp: Date.now() }
    ])
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", text: input, timestamp: Date.now() }
        setMessages(prev => [...prev, userMsg])
        setInput("")

        // Simulate AI thinking delay
        setTimeout(() => {
            const responseText = getAIResponse(input, user?.role || "citizen")
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: responseText, timestamp: Date.now() }
            setMessages(prev => [...prev, aiMsg])
        }, 800)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 pointer-events-auto origin-bottom-right"
                    >
                        <Card className="w-[350px] md:w-[400px] shadow-2xl border-primary/20 backdrop-blur-xl bg-background/95">
                            <CardHeader className="p-4 border-b bg-primary/5 rounded-t-xl flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg">
                                        <Bot className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            Traffic AI
                                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {user ? `Helping ${user.name}` : "Virtual Assistant"}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                                        : "bg-muted text-foreground rounded-bl-none border"
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                                    <span className="text-[10px] opacity-50 mt-1 block text-right">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-3 border-t bg-muted/20">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex w-full items-center gap-2"
                                >
                                    <Input
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="rounded-full bg-background border-muted-foreground/20 focus-visible:ring-primary/50"
                                    />
                                    <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-full h-10 w-10 shrink-0 shadow-md">
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/50 flex items-center justify-center transition-all duration-300 z-50 ring-4 ring-background/50"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </motion.button>
        </div>
    )
}
