import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportInfringement() {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Report Infringement</h1>

                <p className="mb-6 text-sm md:text-base">
                    At Walk Through, we take intellectual property rights seriously and are committed to ensuring that all content
                    on our website adheres to the applicable laws and regulations. If you believe that your intellectual property
                    rights have been infringed upon in any way, please report it promptly. Below is the process for reporting any
                    infringement:
                </p>

                <h2 className="text-base md:text-lg font-semibold mb-2">How to Report an Infringement:</h2>

                <ol className="list-decimal pl-6 space-y-4 mb-6">
                    <li className="text-sm md:text-base">
                        <span className="font-semibold">Identify the Infringed Content:</span>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                            <li className="text-sm md:text-base">
                                Please provide a clear description of the content that you believe is infringing on your rights. This
                                could include text, images, videos, trademarks, or other types of content.
                            </li>
                            <li className="text-sm md:text-base">
                                Specify the exact URL(s) where the infringing content can be found on our website.
                            </li>
                        </ul>
                    </li>

                    <li className="text-sm md:text-base">
                        <span className="font-semibold">Provide Proof of Ownership:</span>
                        <p className="mt-1">
                            To help us resolve this quickly, please provide proof of your ownership or the rights to the intellectual
                            property in question. This may include:
                        </p>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
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

                    <li className="text-sm md:text-base">
                        <span className="font-semibold">Contact Information:</span>
                        <ul className="list-disc pl-6 mt-1">
                            <li className="text-sm md:text-base">
                                Please provide your full name, address, phone number, and email address for follow-up correspondence.
                            </li>
                        </ul>
                    </li>

                    <li className="text-sm md:text-base">
                        <span className="font-semibold">Statement of Good Faith:</span>
                        <ul className="list-disc pl-6 mt-1">
                            <li className="text-sm md:text-base">
                                By submitting this report, you confirm that you believe in good faith that the material in question is
                                infringing upon your intellectual property rights and that the information you have provided is
                                accurate.
                            </li>
                        </ul>
                    </li>
                </ol>

                <div className="mt-8">
                    <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-gray-200 rounded-md px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                    >
                        Contact To Support
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
