"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
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

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Schema with explicit typing
const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // console.log(data, "login data");
    try {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      // console.log("login data df", response);
      if (response?.error) {
        toast.error(response?.error);
        alert(response?.error);
      } else {
        toast.success("Login successful");
        // router.push("/dashboard");
        window.location.href = "/dashboard";
        // router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again. || " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16  mx-auto">
      <div className="flex flex-col lg:flex-row justify-between bg-[#F5EDE2] rounded-2xl h-auto lg:h-[600px] overflow-hidden">
        {/* Left section */}
        <div className="hidden lg:flex w-full lg:w-[45%] bg-[#645949] text-white flex-col justify-center items-center rounded-t-2xl lg:rounded-tr-[100px] lg:rounded-br-[100px] lg:rounded-tl-2xl lg:rounded-bl-2xl py-8 lg:py-0">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EDE2] mb-4">
              Welcome Back!
            </h3>
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-[#F5EDE2] mb-6">
              Don’t have an account?
            </p>
            <Link href="/sign-up">
              <Button className="px-8 py-3 border border-[#F5EDE2] text-base font-semibold hover:bg-[#F5EDE2] hover:text-[#645949]">
                Register
              </Button>
            </Link>
          </div>
        </div>
        {/* Right section */}
        <div className="flex flex-col justify-center w-full lg:w-[55%] py-8 px-4 sm:px-6 lg:px-10">
          <div className="w-full max-w-md mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#645949] text-center">
              Login
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
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
                          type="string"
                          placeholder="Enter your email"
                          {...field}
                          className="h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="h-10 sm:h-12 text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-4 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs sm:text-sm text-[#0a1155] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-12 bg-[#645949] hover:bg-[#645949]/90 text-sm sm:text-base font-bold text-white"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </Form>

            {/* Mobile-only Register Link */}
            <div className="lg:hidden text-center mt-4">
              <p className="text-sm text-[#645949] mb-2">
                Don’t have an account?
              </p>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="px-6 py-2 border-[#645949] text-[#645949] hover:bg-[#645949] hover:text-white text-sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
