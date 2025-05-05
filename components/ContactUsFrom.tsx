"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Instagram,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";

// Define the form schema with Zod
const formSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string(),
  subject: z.enum(["general", "support", "business"], {
    required_error: "Please select a subject",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const postContactForm = async (data: FormValues) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/contactus/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODA1YzVmNGNlMWQ1ZWU1NzQ5NDFmMzkiLCJpYXQiOjE3NDU1ODU3MzQsImV4cCI6MTc0NjE5MDUzNH0.nBpInXLQgepba8n8V10HYHuKrwRMH1P6bShY2eI58CQ`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit contact form");
  }

  return response.json();
};

export default function ContactForm() {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    },
  });

  // Setup mutation for form submission
  const { mutate, isPending } = useMutation({
    mutationFn: postContactForm,
    onSuccess: () => {
      form.reset();
      toast.success("Message sent successfully", {
        position: "top-right",
      });
      // alert("Message sent successfully")
    },
    onError: (error) => {
      console.error("Submission error:", error);
      // You might want to show an error message to the user here
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className="w-full  bg-[#6459491A] rounded-lg overflow-hidden p-0 md:p-10 mt-10">
      <div className="flex flex-col md:flex-row gap-y-10">
        {/* Contact Information Section */}
        <div className="bg-[url('/assets/contactusBg.png')] bg-cover bg-center text-white p-8 md:w-2/5 pt-[32px] rounded-[16px]">
          <div className="h-full flex flex-col ">
            <div>
              <h2 className="text-[32px] font-semibold text-[#FFFFFF] mb-2">
                Contact Information
              </h2>
              <p className="mb-8 text-base text-[#C9C9C9] font-normal">
                Say something to start a live chat!
              </p>

              <div className="space-y-6 pt-[120px] pb-[120px]">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5" />
                  <span>+1012 3456 789</span>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5" />
                  <span>demo@gmail.com</span>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-7 w-7 mt-1" />
                  <span>
                    132 Dartmouth Street Boston, Massachusetts 02156 United
                    States
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 md:w-3/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#645949] font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="!border-b-2 border-[#645949] rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#645949] font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="!border-b-2 border-[#645949] rounded-none border-t-0 border-l-0 border-r-0"
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
                      <FormLabel className="text-base text-[#645949] font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder=""
                          {...field}
                          className="!border-b-2 border-[#645949] rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#645949] font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="!border-b-2 border-[#645949] rounded-none border-t-0 border-l-0 border-r-0"
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
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base text-[#645949] font-medium">
                      Select Subject?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label
                            className="text-base text-[#645949] font-medium"
                            htmlFor="general"
                          >
                            General Inquiry
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="support" id="support" />
                          <Label
                            className="text-base text-[#645949] font-medium"
                            htmlFor="support"
                          >
                            Support
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business" />
                          <Label
                            className="text-base text-[#645949] font-medium"
                            htmlFor="business"
                          >
                            Business
                          </Label>
                        </div>
                      </RadioGroup>
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
                    <FormLabel className="text-base text-[#645949] font-medium">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message.."
                        className="min-h-[120px] !border-b-2 border-[#645949] rounded-none border-t-0 border-l-0 border-r-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end relative">
                <Button
                  type="submit"
                  className="bg-[#6b5d4d] hover:bg-[#5a4d3d] px-8 py-2"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>

                <div className=" absolute top-[50px] right-14 hidden md:block">
                  <Image
                    src="/assets/contact_under_img.png"
                    alt="work 1"
                    height={400}
                    width={400}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
