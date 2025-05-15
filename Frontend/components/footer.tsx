"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Logo from "@/components/logo"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function Footer() {
  const { t } = useLanguage()
  const { theme } = useTheme()  // Get theme from context instead of system preference
  const currentYear = new Date().getFullYear()
  const isDarkMode = theme === 'dark'  // Determine mode from theme context

  return (
<footer className="pt-16 pb-8 bg-gray-50 dark:bg-gray-950">
  <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div>
            <Logo className="mb-4" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Experience unparalleled luxury with YoloMatrix. From mansions to yachts, jets to exotic cars – elevate
              your lifestyle with our premium rental services.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-cyan-600' : 'bg-gray-200 hover:bg-cyan-500'} flex items-center justify-center transition-colors`}
              >
                <Facebook size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              </Link>
              <Link
                href="#"
                className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-cyan-600' : 'bg-gray-200 hover:bg-cyan-500'} flex items-center justify-center transition-colors`}
              >
                <Instagram size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              </Link>
              <Link
                href="#"
                className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-cyan-600' : 'bg-gray-200 hover:bg-cyan-500'} flex items-center justify-center transition-colors`}
              >
                <Twitter size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              </Link>
              <Link
                href="#"
                className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-cyan-600' : 'bg-gray-200 hover:bg-cyan-500'} flex items-center justify-center transition-colors`}
              >
                <Linkedin size={18} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} pb-2`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rentals" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Rentals
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Rental Categories */}
          <div>
            <h3 className={`text-lg font-bold mb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} pb-2`}>Rental Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mansions" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Luxury Mansions
                </Link>
              </li>
              <li>
                <Link href="/apartments" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Premium Apartments
                </Link>
              </li>
              <li>
                <Link href="/yachts" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Superyachts
                </Link>
              </li>
              <li>
                <Link href="/jets" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Private Jets
                </Link>
              </li>
              <li>
                <Link href="/cars" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Exotic Cars
                </Link>
              </li>
              <li>
                <Link href="/concierge" className={`${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'} transition-colors`}>
                  Concierge Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-bold mb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} pb-2`}>Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} mr-2 mt-1 flex-shrink-0`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  123 Luxury Avenue
                  <br />
                  Beverly Hills, CA 90210
                  <br />
                  United States
                </span>
              </li>
              <li className="flex items-center">
                <Phone className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} mr-2 flex-shrink-0`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>+1 (800) YOLO-MTX</span>
              </li>
              <li className="flex items-center">
                <Mail className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} mr-2 flex-shrink-0`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>concierge@yolomatrix.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-600'} text-center text-sm`}>
          <p>
            © {currentYear} YoloMatrix. {t("footer.rights")} Designed with luxury in mind.
          </p>
        </div>
      </div>
    </footer>
  )
}