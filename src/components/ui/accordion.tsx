"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple"
        collapsible?: boolean
        value?: string
        onValueChange?: (value: string) => void
    }
>(({ className, type, collapsible, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string>(controlledValue || "")

    const handleValueChange = (newValue: string) => {
        const updatedValue = newValue === value && collapsible ? "" : newValue
        setValue(updatedValue)
        if (onValueChange) {
            onValueChange(updatedValue)
        }
    }

    return (
        <AccordionContext.Provider value={{ value: controlledValue !== undefined ? controlledValue : value, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn(className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    const isOpen = context.value === value

    return (
        <div ref={ref} className={cn("border-b", className)} data-state={isOpen ? "open" : "closed"} {...props}>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        // @ts-ignore
                        isOpen,
                        // @ts-ignore
                        value
                    })
                }
                return child
            })}
        </div>
    )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { isOpen?: boolean, value?: string }
>(({ className, children, isOpen, value, ...props }, ref) => {
    const context = React.useContext(AccordionContext)

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={() => context.onValueChange?.(value || "")}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }
>(({ className, children, isOpen, ...props }, ref) => {

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                className
            )}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
