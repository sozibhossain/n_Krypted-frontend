import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import NewsletterSubscription from "./Subscribe"

export function Footer() {
  return (
    <footer className="bg-white text-white pt-[50px] pb-8">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <Image
                    src="/assets/footerlogo1.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-[30px] w-[80px]"
                  />
                </div>
                <h1 className="font-benedict text-[32px] font-medium mb-2 text-[#212121] mt-3">Walk Throughz</h1>
              </div>
            </Link>
          </div>
          <p className="text-[#4E4E4E] py-4">
            Join us on social media for exclusive updates, auction previews, and special offers!
          </p>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-2">
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4E4E4E] hover:bg-gray-100 transition-colors"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4E4E4E] hover:bg-gray-100 transition-colors"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4E4E4E] hover:bg-gray-100 transition-colors"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4E4E4E] hover:bg-gray-100 transition-colors"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-[#4E4E4E]">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about-us">Über uns</Link>
            </li>
            <li>
              <Link href="/deals">Deals</Link>
            </li>
            <li>
              <Link href="/blog">Blogs</Link>
            </li>
            <li>
              <Link href="/contact">Kontakt</Link>
            </li>
          </ul>
        </div>

        <div className="text-[#4E4E4E]">
          <h3 className="text-[#4E4E4E] font-semibold text-lg mb-3">Contact</h3>
          <div className="flex items-start gap-2 text-[#4E4E4E] mb-2">
            <MapPin size={16} className="mt-1" />
            <span>208 Olson Boulevard, Toyburgh</span>
          </div>
          <div className="flex items-start gap-2 text-[#4E4E4E]">
            <Phone size={16} className="mt-1" />
            <span>(303) 555-0105</span>
          </div>
          <div className="flex text-[#4E4E4E] items-start gap-2 mb-2">
            <Mail size={16} className="mt-1" />
            <span>housing@realestate.com</span>
          </div>
        </div>

        <div>
          <NewsletterSubscription />
        </div>
      </div>

      <div className="container">
        <div className="my-6 border-b border-gray-600" />
      </div>

      <div className="container">
        {/* Payment Methods */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <p className="text-xs text-[#595959] mb-2 md:mb-0">Accepted Payment Methods:</p>
          <div className="flex space-x-4">
            <div className="flex items-center justify-center bg-white rounded-md p-1 shadow-sm border border-gray-200">
              <Image src="/assets/paypal.png" alt="PayPal" width={60} height={30} className="h-6 w-auto" />
            </div>
            <div className="flex items-center justify-center bg-white rounded-md p-1 shadow-sm border border-gray-200">
              <Image src="/assets/amex.png" alt="American Express" width={60} height={30} className="h-6 w-auto" />
            </div>
            <div className="flex items-center justify-center bg-white rounded-md p-1 shadow-sm border border-gray-200">
              <Image src="/assets/maestro.png" alt="Maestro" width={60} height={30} className="h-6 w-auto" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between text-xs text-[#595959]">
          <p>© 2025 Agency All rights reserved.</p>
          <div className="space-x-4 pt-2 md:pt-0 lg:pt-0">
            <Link href="/suport">Support</Link>
            <Link href="/report">Geschäftsbedingungen</Link>
            <Link href="/refund-policies">Datenschutzerklärung</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
