"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
    HTMLInputElement,
    Omit<React.ComponentPropsWithoutRef<"input">, "value" | "defaultValue"> & {
        value?: number[]
        defaultValue?: number[]
        onValueChange?: (value: number[]) => void
    }
>(({ className, value, defaultValue, onValueChange, max = 100, step = 1, ...props }, ref) => {
    const initialValue = (value && value.length > 0) ? value[0] : ((defaultValue && defaultValue.length > 0) ? defaultValue[0] : 0)
    const [val, setVal] = React.useState(initialValue)

    React.useEffect(() => {
        if (value && value.length > 0) {
            setVal(value[0])
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        setVal(newValue)
        if (onValueChange) {
            onValueChange([newValue])
        }
    }

    return (
        <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={val}
            onChange={handleChange}
            className={cn(
                "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Slider.displayName = "Slider"

export { Slider }
