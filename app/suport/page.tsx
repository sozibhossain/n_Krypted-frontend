"use client";

import { PageHeader } from "@/Shared/PageHeader";
import ContactForm from "@/components/contactForm";

export default function SupportPage() {
  return (
    <div>
      <PageHeader title="Support" imge="/assets/herobg.png" />

      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="w-full container">
          <h1 className="text-[32px] font-semibold mb-5">
            Wir sind für dich da
          </h1>
          <div className="mb-8 text-base text-[#FFFFFF] font-normal leading-[150%]">
            Du hast eine Frage zu deiner Buchung, brauchst Hilfe bei einem Deal
            oder möchtest uns einfach mal Hallo sagen? Wir sind für dich da{" "}
            <p>– persönlich, schnell und unkompliziert.</p>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
