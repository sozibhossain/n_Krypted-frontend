"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function PaymentErrorContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An unknown error occurred")

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setErrorMessage(error)
    }
  }, [searchParams])

  return <p className="text-red-500 text-sm mb-6">{errorMessage}</p>
}
