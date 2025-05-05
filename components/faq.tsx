import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const faqs = [
    {
        question: "How do I register for an auction?",
        answer:
            "Click the Register button at the top of our site. Complete the form with your details and verify your email to activate your account. Once you're verified, you're ready to start bidding!",
    },
    {
        question: "Is there a fee to join or bid?",
        answer:
            "Registration is completely free! There are no charges to join or place bids. You only pay if you win an item, along with any applicable buyer’s premium and shipping fees.",
    },
    {
        question: "How do I place a bid?",
        answer:
            "Once registered and logged in, simply navigate to the item you’re interested in and enter your bid. You can also set a maximum bid and let our system bid incrementally on your behalf up to that limit.",
    },
    {
        question: "What payment methods are accepted?",
        answer:
            "We accept major credit and debit cards, bank transfers, and secure online payment platforms. Full payment details are provided at checkout after you win an item.",
    },
    {
        question: "How do I receive my item after winning?",
        answer:
            "After payment is confirmed, we’ll carefully package your item and ship it using a trusted courier. You'll receive a tracking number so you can monitor your delivery every step of the way.",
    }
]

function Faq() {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="rounded-lg">
                        <AccordionTrigger className="text-left text-base md:text-xl lg:text-2xl font-semibold">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-[#595959]">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faq