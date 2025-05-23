"use client"

import { type FC, Suspense } from "react"
import Link from "next/link"
import PaymentErrorContent from "./_component/paymnt_error"


const PaymentFailedPage: FC = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h1>
                    <p className="text-gray-600 mb-2">We couldn&apos;t process your payment.</p>

                    <Suspense fallback={<p className="text-gray-500 text-sm mb-6">Loading error details...</p>}>
                        <PaymentErrorContent />
                    </Suspense>

                    <div className="mt-8 space-y-3">
                        <Link
                            href="/payment"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </Link>
                        <div>
                            <Link href="/" className="inline-block text-blue-600 hover:underline">
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentFailedPage
