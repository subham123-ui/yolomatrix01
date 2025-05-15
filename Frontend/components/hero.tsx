"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [buttonTextIndex, setButtonTextIndex] = useState(0)
  const videoRef = useRef(null)
  const { t, getButtonTexts } = useLanguage()
  const { theme, resolvedTheme } = useTheme()
  const isLightMode = theme === "light" || resolvedTheme === "light"
  
  // Internal video file path
  const videoUrl = "/Video/yolohero.mp4"
  // Image fallback for faster loading and iOS compatibility
  const posterImage = "/images/hero-poster.jpg"
  // Logo path - replace with your actual logo path
  const logoPath = "/images/logo.png"
  
  const buttonTexts = getButtonTexts()
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Preload the video
    const preloadVideo = () => {
      const videoElement = videoRef.current
      if (videoElement) {
        // Set video attributes for optimal loading
        videoElement.setAttribute('playsinline', '')
        videoElement.setAttribute('muted', '')
        videoElement.setAttribute('preload', 'auto')
        videoElement.muted = true // Explicit mute for iOS
        
        // Set poster for faster initial rendering
        videoElement.poster = posterImage
        
        // Try to load and play immediately
        videoElement.load()
        
        // Attempt to play video as soon as possible
        const playPromise = videoElement.play().catch(err => {
          console.log("Auto-play prevented:", err)
          // Handle auto-play prevention here if needed
        })
      }
    }
    
    // Force play for iOS and handle user interaction
    const handleUserInteraction = () => {
      const videoElement = videoRef.current
      if (videoElement && videoElement.paused) {
        videoElement.play().catch(err => console.log("Play attempt failed:", err))
      }
    }
    
    preloadVideo()
    
    // Add event listeners for user interaction to trigger video playback
    document.addEventListener('touchstart', handleUserInteraction, {once: true})
    document.addEventListener('click', handleUserInteraction, {once: true})
    
    return () => {
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [])
  
  useEffect(() => {
    const buttonIntervalId = setInterval(() => {
      setButtonTextIndex((prevIndex) => (prevIndex + 1) % buttonTexts.length)
    }, 5000)
    return () => {
      clearInterval(buttonIntervalId)
    }
  }, [buttonTexts.length])
  
  const scrollToSearch = () => {
    const searchElement = document.getElementById("search-section")
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: "smooth" })
    }
  }
  
  const handleVideoLoad = () => {
    // Short delay to ensure smooth transition
    setTimeout(() => {
      setVideoLoaded(true)
    }, 300)
  }
  
  return (
    <section className="relative w-full overflow-hidden h-[90vh] sm:h-screen">
      {/* Logo Loading State */}
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 z-10",
        isLightMode ? "bg-gray-100" : "bg-gray-900",
        videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="relative w-40 h-40 md:w-56 md:h-56">
          <Image
            src={logoPath}
            alt="Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
      
      {/* Video Background with optimization */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          isLightMode ? "bg-gray-100" : "bg-black",
        )}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
          onCanPlayThrough={handleVideoLoad}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            isLightMode ? "opacity-80" : "opacity-100",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="/Video/yolohero.webm" type="video/webm" />
        </video>
      </div>
      
      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0",
          isLightMode
            ? "bg-gradient-to-b from-white/40 via-transparent to-white/50"
            : "bg-gradient-to-b from-black/60 via-black/30 to-black/70"
        )}
      />
      
      {/* Main Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
        <div
          className={cn(
            "max-w-5xl transition-all duration-1000 transform",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          {/* You can keep other hero content here if needed */}
        </div>
        
        {/* Bottom Buttons Container */}
        <div className="absolute bottom-16 sm:bottom-20 flex flex-col items-center space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToSearch}
            className={cn(
              "animate-bounce rounded-full",
              isLightMode ? "text-blue-800" : "text-white"
            )}
          >
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="sr-only">Scroll Down</span>
          </Button>
        </div>
      </div>
    </section>
  )
}