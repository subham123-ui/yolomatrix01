"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail } from "lucide-react"
import FloatingActions from "@/components/floating-actions"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" })
    // Show success message
    alert("Thank you for your message. Our concierge team will contact you shortly.")
  }

  return (
    <main className="min-h-screen pt-0">
      {/* Hero Banner */}
      <section className="relative h-[40vh] w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Contact YoloMatrix"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
              Our concierge team is available 24/7 to assist you
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="rounded-lg resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Our luxury concierge team is available 24/7 to assist with any inquiries or to help you plan your next
                  extraordinary experience.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Our Headquarters</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Luxury Avenue
                        <br />
                        Beverly Hills, CA 90210
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        +1 (800) YOLO-MTX
                        <br />
                        Available 24/7
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        concierge@yolomatrix.com
                        <br />
                        support@yolomatrix.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Global Offices</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">New York</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manhattan</p>
                  </div>
                  <div>
                    <p className="font-semibold">London</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mayfair</p>
                  </div>
                  <div>
                    <p className="font-semibold">Dubai</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Palm Jumeirah</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tokyo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ginza</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  )
}
