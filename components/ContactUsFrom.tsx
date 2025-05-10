"use client"

import type React from "react"
import { useState } from "react"

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 md:py-14 ">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold mb-4 text-white text-center">
          Any suggestions or feedback,
        </h1>
        <h1
          className="font-benedict text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-8 text-center text-white"
          style={{ fontFamily: "cursive" }}
        >
          Get in touch.
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 bg-[#212121] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-white text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email Address"
                className="w-full p-3 bg-[#212121] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-white text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your Phone Number"
                className="w-full p-3 bg-[#212121] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-white text-sm sm:text-base"
                required
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              className="w-full h-[150px] sm:h-[200px] lg:h-full p-3 bg-[#212121] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-white text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-md hover:bg-white/90 transition-colors text-sm sm:text-base"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}