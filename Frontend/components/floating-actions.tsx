"use client"

import { Button } from "@/components/ui/button"

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg h-12 w-12"
        onClick={() => window.open("https://wa.me/1234567890", "_blank")}
      >
        <img 
          src="/images/WhatsApp_icon.png" 
          alt="WhatsApp" 
          className="h-6 w-6"
        />
        <span className="sr-only">WhatsApp Support</span>
      </Button>
    </div>
  )
}