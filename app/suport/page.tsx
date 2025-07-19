"use client"


import { PageHeader } from "@/Shared/PageHeader"
import ContactForm from "@/components/contactForm"



export default function SupportPage() {

    return (
        <div>
            <PageHeader
                title="Support"
                imge="/assets/herobg.png"
             
            />

        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                  
            <div className="w-full container">
                <h1 className="text-[32px] font-semibold mb-5">Unterstützung</h1>
                <p className="mb-8 text-base text-[#FFFFFF] font-normal leading-[150%]">
                    Wir helfen Ihnen gerne! Egal, ob Sie eine Frage zu Ihren Deals haben, Hilfe bei einem Deal benötigen oder einfach nur Hallo sagen möchten – unser Support-Team hilft Ihnen gerne weiter.
                </p>

                <div>
                    <ContactForm /> 
                </div>
            </div>
            </div>
        </div>
    )
}
