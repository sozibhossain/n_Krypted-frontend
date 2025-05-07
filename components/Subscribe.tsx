"use client"

import type React from "react"

import { useState } from "react"

export default function NewsletterSubscription() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setMessage("Please enter your email address")
            return
        }

        setIsSubmitting(true)
        setMessage("")

        // Simulate API call
        try {
            // Replace with your actual newsletter subscription API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setMessage("Thanks for subscribing!")
            setEmail("")
        } catch (error) {
            setMessage("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="">
            <h2 className="text-xl font-bold mb-4 text-black">Subscribe for the latest deals</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 ">
                <div className="bg-[#222222] flex items-center p-2 rounded-lg">
                    <input
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow px-4 py-2 rounded-md bg-[#222222]  text-white placeholder-gray-400 focus:outline-none"
                        aria-label="Email address"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>
            </form>
            {message && (
                <p className={`mt-2 text-sm ${message.includes("Thanks") ? "text-green-500" : "text-red-500"}`}>{message}</p>
            )}
        </div>
    )
}
