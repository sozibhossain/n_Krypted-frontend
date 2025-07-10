import Image from "next/image";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gray-900 lg:block">
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/assets/auth.jpg"
              alt="Background"
              fill
              className="object-cover opacity-50"
              priority
            />
          </div>
          <div className="z-10 flex flex-col items-center justify-center text-center text-white">
            <div className="mb-4 rounded-full bg-gray-800/70 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 className="mb-2 text-4xl font-bold">
              Stellen Sie Ihr Passwort wieder her
            </h2>
            <p className="max-w-md text-gray-300">
              Entdecken Sie tolle Produkte und genießen Sie bei uns ein
              nahtloses Einkaufserlebnis.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-[#212121] lg:w-1/2">
        <div className="w-full max-w-md space-y-8 p-8 text-white">
          <div className="text-center">
            <h1 className="text-[26px] lg:text-[32px] font-semibold leading-[120%]">
              Geben Sie die E-Mail-Adresse ein
            </h1>
            <p className="text-white text-[14px] lg:text-[16px] font-normal">
              Geben Sie Ihre E-Mail-Adresse ein, um den Link zu erhalten
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
