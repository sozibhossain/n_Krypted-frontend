"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { toast } from "sonner";

const registerFormSchema = z
  .object({
    username: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
    role: z.enum(["bidder", "seller"], {
      required_error: "Please select a user type.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "bidder",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    console.log("signup", data);

    try {
      const result = await registerUser({
        username: data?.username,
        email: data?.email,
        role: data?.role,
        password: data?.password,
        confirmPassword: data?.confirmPassword,
      });

      console.log("sign up", result);

      if (result.success) {
        toast("Account Successfully created");
        toast("Login to continue");
        router.push("/login");
      } else {
        toast("Registration failed");
      }
    } catch (error) {
      toast("Something went wrong || " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row justify-between bg-[#F5EDE2] rounded-2xl h-auto overflow-hidden shadow-lg">
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#645949]">
              Registration
            </h1>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      User Type
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={isLoading}
                        className="h-10 sm:h-12 rounded-md text-sm sm:text-base border border-input bg-background px-3 w-full"
                      >
                        <option value="">Select a user type</option>
                        <option value="bidder">Bidder</option>
                        <option value="seller">Seller</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Create a password"
                        disabled={isLoading}
                        className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        disabled={isLoading}
                        className="h-10 sm:h-12 rounded-md text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-[#645949] hover:bg-[#645949]/90 text-sm sm:text-base font-semibold text-white rounded-md"
              >
                Sign Up
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center block md:hidden">
            <Link href="/login">
              <Button className="px-6 py-2 sm:px-8 sm:py-3 border border-[#F5EDE2] text-sm sm:text-base font-semibold text-[#000000] hover:bg-[#F5EDE2]  rounded-md">
                Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[45%] bg-[#645949] text-white flex-col justify-center items-center rounded-t-2xl lg:rounded-tl-[100px] lg:rounded-bl-[100px] lg:rounded-tr-2xl lg:rounded-br-2xl py-8">
          <div className="text-center px-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5EDE2] mb-4">
              Welcome Back!
            </h3>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-[#F5EDE2] mb-6">
              Already have an account? Log in to continue.
            </p>
            <Link href="/login">
              <Button className="px-6 py-2 sm:px-8 sm:py-3 border border-[#F5EDE2] text-sm sm:text-base font-semibold text-[#F5EDE2] hover:bg-[#F5EDE2] hover:text-[#645949] rounded-md">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
