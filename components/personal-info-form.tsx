"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit } from "lucide-react"

interface PersonalInfoData {
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    cityState: string
    roadArea: string
}

export default function PersonalInfoForm({ initialData }: { initialData: PersonalInfoData }) {
    const [formData, setFormData] = useState<PersonalInfoData>(initialData)
    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically save the data to your backend
        console.log("Saving data:", formData)
        setIsEditing(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#FFFFFF]">Personal Information</h1>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="text-sm bg-[#FFFFFF] text-[#212121] hover:bg-[#FFFFFF]/80">
                        <Edit/>
                        Edit
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm">
                            First Name
                        </label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0] "
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm">
                            Last Name
                        </label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm">
                            Phone
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm">
                            Country
                        </label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cityState" className="block text-sm">
                            City/State
                        </label>
                        <Input
                            id="cityState"
                            name="cityState"
                            value={formData.cityState}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="bg-transparent border-[#E0E0E0]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="roadArea" className="block text-sm">
                        Road/Area
                    </label>
                    <Input
                        id="roadArea"
                        name="roadArea"
                        value={formData.roadArea}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-transparent border-[#E0E0E0]"
                    />
                </div>

                {isEditing && (
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData(initialData)
                                setIsEditing(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                )}
            </form>
        </div>
    )
}
