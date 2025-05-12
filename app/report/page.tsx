import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/Shared/PageHeader"
import Link from "next/link"

export default function ReportInfringement() {
    return (
        <div className="">
            <PageHeader
                title="Report Infringement"
                imge="/assets/herobg.png"
                items={[
                    {
                        label: "Home",
                        href: "/",
                    },
                    {
                        label: "Report Infringement",
                        href: "/faq",
                    },
                ]}
            />
            <div className="w-full container mt-[80px] pb-[120px]">
                <h1 className="text-2xl md:text-[32px] font-semibold text-[#FFFFFF] mb-6">Report Infringement</h1>

                <p className="mb-9 text-sm md:text-base text-white leading-[150%] font-midium">
                    At Walk Through, we take intellectual property rights seriously and are committed to ensuring that all content
                    on our website adheres to the applicable laws and regulations. If you believe that your intellectual property
                    rights have been infringed upon in any way, please report it promptly. Below is the process for reporting any
                    infringement:
                </p>

                <h2 className="text-base md:text-lg font-semibold mb-9 text-[#FFFFFF]">How to Report an Infringement:</h2>

                <ol className="list-decimal pl-6 space-y-8 mb-6">
                    <li className="text-sm md:text-base text-[#FFFFFF]">
                        <span className="font-semibold">Identify the Infringed Content:</span>
                        <ul className="list-disc pl-6 mt-1 space-y-1 text-[#FFFFFF]" >
                            <li className="text-sm md:text-base">
                                Please provide a clear description of the content that you believe is infringing on your rights. This
                                could include text, images, videos, trademarks, or other types of content.
                            </li>
                            <li className="text-sm md:text-base text-[#FFFFFF]">
                                Specify the exact URL(s) where the infringing content can be found on our website.
                            </li>
                        </ul>
                    </li>

                    <li className="text-sm md:text-base text-[#FFFFFF]">
                        <span className="font-semibold">Provide Proof of Ownership:</span>
                        <p className="mt-1 text-[#FFFFFF]">
                            To help us resolve this quickly, please provide proof of your ownership or the rights to the intellectual
                            property in question. This may include:
                        </p>
                        <ul className="list-disc pl-6 mt-1 space-y-1 text-[#FFFFFF]">
                            <li className="text-sm md:text-base">
                                A copyright registration number or certificate (for copyrighted works).
                            </li>
                            <li className="text-sm md:text-base">
                                Trademark registration number or certificate (for trademarked works).
                            </li>
                            <li className="text-sm md:text-base">
                                Any other relevant documentation that proves your ownership or rights.
                            </li>
                        </ul>
                    </li>

                    <li className="text-sm md:text-base text-[#FFFFFF]">
                        <span className="font-semibold">Contact Information:</span>
                        <ul className="list-disc pl-6 mt-1 text-[#FFFFFF]">
                            <li className="text-sm md:text-base">
                                Please provide your full name, address, phone number, and email address for follow-up correspondence.
                            </li>
                        </ul>
                    </li>

                    <li className="text-sm md:text-base text-[#FFFFFF]">
                        <span className="font-semibold text-[#FFFFFF]">Statement of Good Faith:</span>
                        <ul className="list-disc pl-6 mt-1 text-[#FFFFFF]">
                            <li className="text-sm md:text-base">
                                By submitting this report, you confirm that you believe in good faith that the material in question is
                                infringing upon your intellectual property rights and that the information you have provided is
                                accurate.
                            </li>
                        </ul>
                    </li>
                </ol>

                <div className="mt-10">
                    <Link href="/suport">
                        <Button
                            variant="outline"
                            className="bg-white text-black hover:bg-gray-200 rounded-md px-4 !h-[40px] text-sm flex items-center gap-2 transition-colors"
                        >
                            Contact To Support
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
