"use client"

import { useEffect, useRef, useState } from "react"
import dropin from "braintree-web-drop-in"
import { getClientToken, makePayment } from "./payment.api"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/payment_utils"


type Props = {
    amount: number
    userId: string
    bookingId: string
    seasonId?: string
    successUrl?: string
    failureUrl?: string
}

export const PaymentForm = ({
    amount,
    userId,
    bookingId,
    seasonId,
    successUrl = "/success",
    failureUrl = "/payment-failed",
}: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropinInstance = useRef<any>(null)
    const dropinContainer = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    useEffect(() => {
        const init = async () => {
            try {
                const token = await getClientToken()

                if (dropinInstance.current) {
                    await dropinInstance.current.teardown()
                    dropinInstance.current = null
                }

                if (dropinContainer.current) {
                    dropinContainer.current.innerHTML = ""
                }

                dropin.create(
                    {
                        authorization: token,
                        container: dropinContainer.current!,
                        paypal: {
                            flow: "checkout",
                            amount: amount,
                            currency: "USD",
                        },
                        paypalCredit: {
                            flow: "checkout",
                            amount: amount,
                            currency: "USD",
                        },
                    },
                    (err, instance) => {
                        if (err) {
                            console.error("Drop-in error:", err)
                            setError(err instanceof Error ? err.message : "Drop-in error")
                        } else {
                            dropinInstance.current = instance
                        }
                    },
                )
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Payment failed")
                }
            }
        }

        init()
    }, [amount])

    const handlePayment = async () => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const instance = dropinInstance.current
            if (!instance) throw new Error("Drop-in instance not ready")

            const { nonce } = await instance.requestPaymentMethod()
            const result = await makePayment({
                amount: amount.toString(),
                paymentMethodNonce: nonce,
                userId,
                bookingId,
                seasonId,
            })

            setSuccess(`Payment successful! Transaction ID: ${result.transactionId}`)

            await instance.teardown()

            setTimeout(() => {
                router.push(`${successUrl}?transactionId=${result.transactionId}`)
            }, 1000)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err)
            const errorMessage = err?.response?.data?.message || err.message || "Payment failed"
            setError(errorMessage)

            setTimeout(() => {
                router.push(`${failureUrl}?error=${encodeURIComponent(errorMessage)}`)
            }, 1500)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Payment Details</h2>
                    <div className="mt-4 mb-6">
                        <span className="text-sm text-slate-500">Amount to pay:</span>
                        <p className="text-3xl font-bold text-slate-900">{formatCurrency(amount)}</p>
                    </div>
                </div>

                <div ref={dropinContainer}></div>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? `Processing ${formatCurrency(amount)}...` : `Pay ${formatCurrency(amount)}`}
                </button>
            </div>
        </div>
    )
}
