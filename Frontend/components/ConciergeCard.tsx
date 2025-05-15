"use client"

import React, { useRef, useEffect, useState } from "react"
import { 
  Calendar, 
  ShoppingBag, 
  ChefHat, 
  Anchor, 
  Map, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Users 
} from "lucide-react"

export default function ConciergeCard() {
  const scrollContainerRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  // Common services data to ensure consistency between mobile and desktop
  const services = [
    { 
      icon: Calendar, 
      title: "Bespoke Event Planning",
      description: "From intimate gatherings to lavish celebrations"
    },
    { 
      icon: ShoppingBag, 
      title: "Personal Shopping & Styling",
      description: "Fashion consultation, designer access, private showrooms"
    },
    { 
      icon: Map, 
      title: "Curated Cultural Experiences",
      description: "Private museum tours, local artisans. Immersive heritage"
    },
    { 
      icon: ChefHat, 
      title: "Private Chefs & Dining",
      description: "Gourmet menus in your villa, yacht, or retreat"
    },
    { 
      icon: Anchor, 
      title: "Yacht & Jet Charters",
      description: "Cruise or Fly with elite luxury and comfort"
    },
    { 
      icon: Heart,
      title: "Wellness & Rejuvenation",
      description: "Spa getaways, detox programs and holistic care"
    }
  ];

  // Common features with added icons
  const features = [
    { title: "24/7 Global Assistance", icon: Clock },
    { title: "Unmatched Privacy & Discretion", icon: ShieldCheck },
    { title: "Lightning-Fast Response Time", icon: Zap },
    { title: "Handpicked Concierge Experts", icon: Users }
  ];

  // Enhanced scrolling with touch gestures for services
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollInterval
    let scrollPosition = 0
    let startX
    let scrollLeft
    let isDragging = false

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && !isDragging) {
          scrollPosition += 1
          scrollContainer.scrollLeft = scrollPosition

          // Reset scroll position when reaching the end
          if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollPosition = 0
          }
        }
      }, 40) // Adjust speed here (lower number = faster)
    }

    startScrolling()

    // Mouse and touch events for pausing
    const handleMouseEnter = () => setIsPaused(true)
    const handleMouseLeave = () => {
      if (!isDragging) setIsPaused(false)
    }
    
    // Touch and drag functionality
    const handleTouchStart = (e) => {
      setIsPaused(true)
      isDragging = true
      startX = e.touches[0].pageX - scrollContainer.offsetLeft
      scrollLeft = scrollContainer.scrollLeft
    }
    
    const handleTouchMove = (e) => {
      if (!isDragging) return
      const x = e.touches[0].pageX - scrollContainer.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      scrollContainer.scrollLeft = scrollLeft - walk
      // Update scroll position for when auto-scroll resumes
      scrollPosition = scrollContainer.scrollLeft
    }
    
    const handleTouchEnd = () => {
      isDragging = false
      // Only unpause if the user isn't still hovering
      if (!scrollContainer.matches(':hover')) {
        setTimeout(() => setIsPaused(false), 1000) // Resume auto-scroll after 1 second
      }
    }
    
    // Mouse drag functionality (for desktop, but also applies to touch-capable devices)
    const handleMouseDown = (e) => {
      setIsPaused(true)
      isDragging = true
      startX = e.pageX - scrollContainer.offsetLeft
      scrollLeft = scrollContainer.scrollLeft
      scrollContainer.style.cursor = 'grabbing'
    }
    
    const handleMouseMove = (e) => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - scrollContainer.offsetLeft
      const walk = (x - startX) * 2
      scrollContainer.scrollLeft = scrollLeft - walk
      scrollPosition = scrollContainer.scrollLeft
    }
    
    const handleMouseUp = () => {
      isDragging = false
      scrollContainer.style.cursor = 'grab'
      // Only unpause if the user isn't still hovering
      if (!scrollContainer.matches(':hover')) {
        setTimeout(() => setIsPaused(false), 1000)
      }
    }

    // Add all event listeners
    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)
    
    // Touch events
    scrollContainer.addEventListener('touchstart', handleTouchStart)
    scrollContainer.addEventListener('touchmove', handleTouchMove)
    scrollContainer.addEventListener('touchend', handleTouchEnd)
    
    // Mouse drag events
    scrollContainer.addEventListener('mousedown', handleMouseDown)
    scrollContainer.addEventListener('mousemove', handleMouseMove)
    scrollContainer.addEventListener('mouseup', handleMouseUp)
    scrollContainer.addEventListener('mouseleave', handleMouseUp) // Also stop dragging when leaving container

    return () => {
      clearInterval(scrollInterval)
      
      // Clean up all event listeners
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
      
      scrollContainer.removeEventListener('mousedown', handleMouseDown)
      scrollContainer.removeEventListener('mousemove', handleMouseMove)
      scrollContainer.removeEventListener('mouseup', handleMouseUp)
      scrollContainer.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isPaused])

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-2 md:p-8">
      {/* Mobile Version Card */}
      <div className="md:hidden w-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg text-gray-900 dark:text-white relative">
          {/* Background Image with Overlay for Mobile */}
          <div className="absolute inset-0 bg-[url('/packagebg.jpeg')] bg-cover bg-center opacity-30 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/75 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900/75" />
          
          <div className="relative p-5">
            {/* Header Section */}
            <h2 className="text-lg font-serif text-blue-700 dark:text-blue-300 mb-2 leading-snug">
              Your Private Concierge, Redefined
            </h2>
            
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Luxury is not just service — It's anticipation. Our concierge team crafts seamless experiences, tailored to your every desire.
            </p>
            
            {/* Features - Optimized layout with icons */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[11px] leading-snug text-gray-800 dark:text-gray-200">{feature.title}</span>
                </div>
              ))}
            </div>
            
            {/* Signature Services Title */}
            <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4 mb-4">
              <h3 className="text-sm font-serif text-blue-700 dark:text-blue-300">Signature Services</h3>
            </div>
            
            {/* Services - Auto-scrolling carousel with hidden scrollbar */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto -mx-5 px-5 mb-5 scrollbar-hide cursor-grab"
              style={{
                msOverflowStyle: 'none',  
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              
              <div className="inline-flex space-x-4 pb-2 touch-pan-x">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="w-56 flex space-x-3 bg-gray-100/80 dark:bg-gray-800/40 backdrop-blur-sm p-3 rounded-lg flex-shrink-0 cursor-pointer hover:bg-gray-200/80 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="rounded-full p-2 bg-blue-100/80 dark:bg-blue-900/30 h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-snug mb-1">
                        {service.title}
                      </h4>
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Duplicate services for seamless infinite scroll */}
                {services.map((service, index) => (
                  <div 
                    key={`duplicate-${index}`} 
                    className="w-56 flex space-x-3 bg-gray-100/80 dark:bg-gray-800/40 backdrop-blur-sm p-3 rounded-lg flex-shrink-0 cursor-pointer hover:bg-gray-200/80 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="rounded-full p-2 bg-blue-100/80 dark:bg-blue-900/30 h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-snug mb-1">
                        {service.title}
                      </h4>
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <a href="/concierge" className="w-full">
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white rounded text-sm font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-700">
                  Start Your Journey with Us
                </button>
              </a>
              
              <p className="text-[11px] text-center mt-2.5 text-gray-500 dark:text-gray-400/90">
                A concierge specialist is ready to assist you 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Version Card */}
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl text-gray-900 dark:text-white relative">
          {/* Background Image with Overlay for Desktop */}
          <div className="absolute inset-0 bg-[url('/packagebg.jpeg')] bg-cover bg-center opacity-30 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/85 
                         dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/85" />
          
          <div className="relative grid grid-cols-12">
            {/* Left Section */}
            <div className="col-span-4 p-8">
              <h2 className="text-3xl font-serif text-blue-700 dark:text-blue-300 mb-4">Your Private Concierge, Redefined</h2>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-8">
                Luxury is not just service — It's anticipation. Our concierge team crafts seamless experiences, tailored to your every desire.
              </p>
              
              {/* Features with icons for desktop */}
              <div className="grid grid-cols-2 gap-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <feature.icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Section */}
            <div className="col-span-8 p-8">
              {/* Signature Services heading at the top */}
              <h3 className="text-2xl font-serif text-blue-700 dark:text-blue-300 mb-8">Signature Services</h3>
              
              <div className="grid grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="flex space-x-3 bg-gray-100/80 dark:bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-800/60 transition-colors">
                    <div className="rounded-full p-2 bg-blue-100/80 dark:bg-blue-900/30 h-10 w-10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-blue-700 dark:text-blue-300">{service.title}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 flex justify-center">
                <a href="/concierge" className="inline-block">
                  <button className="px-10 py-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-base font-semibold transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600">
                    Start Your Journey with Us
                  </button>
                </a>
              </div>
              
              <p className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
                A concierge specialist is ready to assist you 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}