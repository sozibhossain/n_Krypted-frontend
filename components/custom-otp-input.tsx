"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface OtpInputProps {
  length?: number
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function CustomOtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first empty input on mount
    const firstEmptyIndex = value.findIndex((v) => !v)
    const indexToFocus = firstEmptyIndex !== -1 ? firstEmptyIndex : 0

    if (inputRefs.current[indexToFocus] && !disabled) {
      inputRefs.current[indexToFocus].focus()
    }
  }, [disabled, value])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Allow only alphanumeric characters
    if (!/^[a-zA-Z0-9]*$/.test(newValue)) return

    // Update the value
    const newOtp = [...value]
    // Take only the last character if multiple characters are entered
    newOtp[index] = newValue.slice(-1)
    onChange(newOtp)

    // Auto-focus next input if a character was entered
    if (newValue && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigate to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !value[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }

    // Navigate to next input on right arrow
    if (e.key === "ArrowRight" && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }

    // Navigate to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content matches the expected length and contains only alphanumeric characters
    if (pastedData.length === length && /^[a-zA-Z0-9]+$/.test(pastedData)) {
      const newOtp = pastedData.split("")
      onChange(newOtp)

      // Focus the last input
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="h-12 w-12 rounded-md border border-gray-600 bg-gray-700 text-center text-xl text-white focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
          autoComplete={index === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  )
}
