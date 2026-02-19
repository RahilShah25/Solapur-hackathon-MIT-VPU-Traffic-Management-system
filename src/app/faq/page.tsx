
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I pay my traffic challan?",
            answer: "You can pay your challan online through the 'My Fines' section in your profile. We accept all major credit/debit cards, UPI, and net banking."
        },
        {
            question: "How can I report a traffic violation?",
            answer: "Use the 'Report Violation' page to submit details. You can upload photos as evidence. Valid reports may earn you reward points."
        },
        {
            question: "Can I dispute a fine?",
            answer: "Yes, you can raise a dispute for any challan within 15 days of issuance through the 'My Fines' dashboard. You will need to provide a reason and any supporting evidence."
        },
        {
            question: "Is my personal data safe?",
            answer: "Absolutely. We use industry-standard encryption to protect your data. Your personal information is only used for traffic management and enforcement purposes as per our Privacy Policy."
        },
        {
            question: "How does the Smart Parking system work?",
            answer: "You can find available parking spots on the map. Green indicators show open spots. You can navigate to the location and scan the QR code to check-in and pay."
        }
    ]

    return (
        <div className="container max-w-4xl py-12 px-4 mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 shadow-sm bg-card">
                        <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
