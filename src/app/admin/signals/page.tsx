"use client"

import SignalManager from "@/components/traffic/SignalManager"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function SignalsPage() {
    return (
        <div className="container px-4 pt-28 pb-8">
            <div className="mb-6">
                <Link href="/admin">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mt-2">Signal Management</h1>
            </div>
            <SignalManager />
        </div>
    )
}
