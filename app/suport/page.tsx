"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { PageHeader } from "@/Shared/PageHeader"

// Form schema validation
const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phoneNumber: z.string().min(6, { message: "Please enter a valid phone number." }),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
   
})

type FormValues = z.infer<typeof formSchema>

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            subject: "",
            message: "",
        },
    })

    // Setup mutation for form submission
    const mutation = useMutation({
        mutationFn: async (values: FormValues) => {
            // Create JSON payload in the requested format
            const jsonPayload = {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                phoneNumber: values.phoneNumber,
                message: values.message,
                subject: values.subject,
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonPayload),
            })

            if (!response.ok) {
                throw new Error("Failed to submit feedback")
            }

            return response.json()
        },
        onSuccess: () => {
            toast.success("Feedback submitted successfully", { position: "top-right" })
            form.reset()
        },
        onError: () => {
            toast.error("Failed to submit feedback", { position: "top-right" })
        },
        onSettled: () => {
            setIsSubmitting(false)
        },
    })

    // Handle form submission
    function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        mutation.mutate(values)
    }

    return (
        <div>
            <PageHeader
                title="Support"
                imge="/assets/herobg.png"
                items={[
                    {
                        label: "Home",
                        href: "/",
                    },
                    {
                        label: "Support",
                        href: "/blogs",
                    },
                ]}
            />

        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                  
            <div className="w-full container">
                <h1 className="text-[32px] font-semibold mb-5">Support</h1>
                <p className="mb-8 text-base text-[#FFFFFF] font-normal leading-[150%]">
                    We&apos;re here to help! Whether you have a question about your Deals, need help with a Deal, or just want to
                    say hi, our support team is ready to assist you.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your First name"
                                                className="bg-transparent border-[#BFBFBF] focus:border-gray-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your Last name"
                                                className="bg-transparent border-[#BFBFBF] focus:border-gray-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your Email Address"
                                                type="email"
                                                className="bg-transparent border-[#BFBFBF] focus:border-gray-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your Phone Number"
                                                className="bg-transparent border-[#BFBFBF] focus:border-gray-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your Subject"
                                            className="bg-transparent border-[#BFBFBF] focus:border-gray-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                     

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your Message..."
                                            className="bg-transparent border-[#BFBFBF] focus:border-gray-500 min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-[150px] bg-white text-black hover:bg-gray-200"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            </div>
        </div>
    )
}
