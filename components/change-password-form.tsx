"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            alert("New passwords don't match")
            return
        }

        // Here you would typically save the new password to your backend
        console.log("Changing password")

        // Reset form
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm">
                        Current Password
                    </label>
                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="bg-zinc-900 border-zinc-700"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm">
                            New Password
                        </label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="bg-zinc-900 border-zinc-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm">
                            Confirm New Password
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="bg-zinc-900 border-zinc-700"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="text-[#212121] bg-white">Update Password</Button>
                </div>
            </form>
        </div>
    )
}
