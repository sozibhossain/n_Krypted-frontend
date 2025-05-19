import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSubscription from "./Subscribe";

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
                <h1 className="font-benedict text-[32px] font-medium mb-2 text-[#212121] mt-3">
                  Walk Throughz
                </h1>
              </div>

            </Link>
          </div>
          <p className="text-[#4E4E4E] py-4">
            Join us on social media for exclusive updates, auction previews, and
            special offers!
          </p>
          <div className="flex space-x-4">
            <div className="border border-[#1E1E1E] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Facebook className="w-4 h-4 text-black" />
              </Link>
            </div>
            <div className="border border-[#1E1E1E] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Instagram className="w-4 h-4 text-black" />
              </Link>
            </div>
            <div className="border border-[#1E1E1E] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Twitter className="w-4 h-4 text-black" />
              </Link>
            </div>
            <div className="border border-[#1E1E1E] rounded-full p-2 w-8 h-8 flex items-center justify-center">

              <Link href="">
                <Linkedin className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>

        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-[#4E4E4E]">
            <li><Link href="/">Home</Link></li>

            <li><Link href="/about-us">About Us</Link></li>
            <li><Link href="/deals">Deals</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="text-[#4E4E4E]">
          <h3 className="text-[#4E4E4E] font-semibold text-lg mb-3">Contact</h3>
          <div className="flex items-start gap-2 text-[#4E4E4E] mb-2">
            <MapPin size={16} className="mt-1" />
            <span>546 Market Street PMB 830066</span>
          </div>
          <div className="flex items-start gap-2 text-[#4E4E4E]">
            <Phone size={16} className="mt-1" />
            <span>(000)0005555445</span>
          </div>
          <div className="flex text-[#4E4E4E] items-start gap-2 mb-2">
            <Mail size={16} className="mt-1" />
            <span>info@diamondauctionsllc.com</span>
          </div>
        </div>
        <div>
          <NewsletterSubscription />
        </div>

      </div>

      <div className="container">
        <div className="my-6 border-b border-gray-600" />
      </div>

      <div className="flex flex-col md:flex-row justify-between text-xs text-[#595959] max-w-7xl mx-auto px-6 md:px-16">
        <p>© 2025 Agency All rights reserved.</p>
        <div className="space-x-4 pt-2 md:pt-0 lg:pt-0">
          <Link href="/privacypolicy">Support</Link>
          <Link href="/report">Report Infringement</Link>
          <Link href="/refund-policies">Refund Policies</Link>
        </div>
      </div>



    </footer>
  );
}
