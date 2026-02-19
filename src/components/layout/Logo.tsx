import Link from "next/link"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    showText?: boolean
    size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12"
    }

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-7 w-7"
    }

    return (
        <Link href="/" className={cn("flex items-center space-x-2 group", className)}>
            <div className={cn(
                "relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center",
                sizeClasses[size]
            )}>
                <Zap className={cn("text-white animate-pulse", iconSizes[size])} />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={cn(
                        "font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-none",
                        size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg"
                    )}>
                        Solapur Traffic
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase leading-none mt-1">
                        Smart City Ops
                    </span>
                </div>
            )}
        </Link>
    )
}
