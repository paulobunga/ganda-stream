import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-[#757575] px-4 py-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
            <h3 className="text-white text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:underline">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:underline">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
            <h3 className="text-white text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
            <h3 className="text-white text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cookies" className="hover:underline">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:underline">
                  Corporate Information
                </Link>
              </li>
              <li>
                <Link href="/agreement" className="hover:underline">
                  User Agreement
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:underline">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
            <h3 className="text-white text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6 hover:text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-6 h-6 hover:text-white" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="w-6 h-6 hover:text-white" />
              </a>
            </div>
            <p className="mt-4">© 2023 Netflix Clone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

