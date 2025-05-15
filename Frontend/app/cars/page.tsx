"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import FloatingActions from "@/components/floating-actions"
import CategoryFilter from "@/components/category-filter"
import CategoryItem, { type CategoryItemProps } from "@/components/category-item"
import { useLanguage } from "@/contexts/language-context"
import Footer from "@/components/footer"
import { useSpring, animated, config } from "react-spring"
import { motion } from "framer-motion"

// Mock data for cars
export const carsData: CategoryItemProps[] = [
  {
    id: "lamborghini-aventador",
    title: "Lamborghini Aventador SVJ",
    description: "Flagship V12 supercar with 770 horsepower, scissor doors, and breathtaking performance.",
    price: 2500,
    priceUnit: "hour",
    location: "Miami, FL",
    rating: 4.9,
    reviews: 32,
    images: ["/images/Car_img/car_img1.webp"],
    amenities: ["ac", "parking"],
    featured: true,
    categoryType: "cars",
  },
  {
    id: "rolls-royce-phantom",
    title: "Rolls-Royce Phantom",
    description: "The pinnacle of luxury motoring with handcrafted interior and whisper-quiet cabin.",
    price: 3000,
    priceUnit: "hour",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 28,
    images: ["/images/Car_img/car_img2.webp"],
    amenities: ["ac", "parking"],
    categoryType: "cars",
  },
  {
    id: "ferrari-sf90",
    title: "Ferrari SF90 Stradale",
    description: "Hybrid hypercar with nearly 1,000 horsepower combining V8 power with electric efficiency.",
    price: 2800,
    priceUnit: "hour",
    location: "Las Vegas, NV",
    rating: 4.9,
    reviews: 24,
    images: ["/images/Car_img/car_img3.webp"],
    amenities: ["ac", "parking"],
    categoryType: "cars",
  },
  {
    id: "bentley-continental",
    title: "Bentley Continental GT",
    description: "Grand touring excellence with handcrafted luxury and powerful W12 engine.",
    price: 1800,
    priceUnit: "hour",
    location: "New York, NY",
    rating: 4.7,
    reviews: 30,
    images: ["/images/Car_img/car_img4.webp"],
    amenities: ["ac", "parking"],
    categoryType: "cars",
  },
  {
    id: "mclaren-720s",
    title: "McLaren 720S",
    description: "Stunning supercar with butterfly doors and race-derived technology for exceptional performance.",
    price: 2200,
    priceUnit: "hour",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 26,
    images: ["/images/Car_img/car_img5.webp"],
    amenities: ["ac", "parking"],
    categoryType: "cars",
  },
  {
    id: "aston-martin-dbs",
    title: "Aston Martin DBS Superleggera",
    description: "Grand touring masterpiece combining raw power with refined British luxury and iconic design.",
    price: 2400,
    priceUnit: "hour",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 22,
    images: ["/images/Car_img/car_img.webp"],
    amenities: ["ac", "parking"],
    categoryType: "cars",
  },
]

export default function CarsPage() {
  const { t } = useLanguage()
  const [filteredCars, setFilteredCars] = useState<CategoryItemProps[]>(carsData)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    amenities: [] as string[],
    locations: [] as string[],
    sortBy: "recommended",
  })

  // Hero animation values based on scroll position
  const [{ scale, blur, opacity, gradientOpacity, translateY }, setHeroSpring] = useSpring(() => ({
    scale: 1,
    blur: 0,
    opacity: 1,
    gradientOpacity: 0.6,
    translateY: 0,
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  // Handle scroll events with passive listener for performance
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Calculate animation values based on scroll
      const heroHeight = heroRef.current?.offsetHeight || 0
      const scrollProgress = Math.min(currentScrollY / (heroHeight * 0.8), 1)
      
      // Set spring values for animations
      setHeroSpring({
        scale: 1 + (scrollProgress * 0.3), // Max zoom 1.3x
        blur: scrollProgress * 2,
        opacity: 1 - (scrollProgress * 0.3),
        gradientOpacity: 0.6 + (scrollProgress * 0.2),
        translateY: currentScrollY * 0.2 // Parallax effect
      })
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial calculation
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setHeroSpring])

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error);
        // Could add a play button here if autoplay is blocked
      });
    }
  }, [])

  useEffect(() => {
    let filtered = [...carsData]

    // Filter by price
    filtered = filtered.filter((car) => car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1])

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((car) => filters.amenities.every((amenity) => car.amenities.includes(amenity)))
    }

    // Filter by location
    if (filters.locations.length > 0) {
      filtered = filtered.filter((car) => filters.locations.some((loc) => car.location.includes(loc)))
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Keep default order (recommended)
        break
    }

    setFilteredCars(filtered)
  }, [filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  // Text animation variants for staggered animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }

  return (
    <main className="min-h-screen pt-0">
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <animated.div
          style={{
            transform: scale.to(s => `scale(${s})`),
            filter: blur.to(b => `blur(${b}px)`),
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Video background instead of image */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/Video/luxury-cars.mp4" type="video/mp4" />
            {/* Fallback image in case video doesn't load */}
            <Image
              src="/images/Car_img/car_hero.jpg"
              alt={t("category.cars")}
              fill
              className="object-cover"
              priority
            />
          </video>
        </animated.div>
        
        <animated.div 
          style={{ 
            opacity: gradientOpacity 
          }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" 
        />
        
        <animated.div 
          style={{ 
            opacity,
            transform: translateY.to(y => `translateY(${y}px)`)
          }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <div className="max-w-4xl px-4">
            <motion.h1 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md"
            >
              {t("category.cars")}
            </motion.h1>
            
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto drop-shadow-sm"
            >
              Drive in style with our collection of exotic and luxury vehicles.
            </motion.p>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 transition-all"
              >
                Explore Now
              </Button>
            </motion.div>
          </div>
        </animated.div>
      </section>

      {/* Cars Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <div className="lg:w-1/4">
              <CategoryFilter categoryType="cars" onFilterChange={handleFilterChange} />
            </div>

            {/* Cars Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t("category.cars")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {filteredCars.length} {t("category.results")}
                </p>
              </div>

              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCars.map((car, index) => (
                    <motion.div 
                      key={car.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden"
                    >
                      <CategoryItem {...car} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t("category.noResults")}</p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 5000],
                        amenities: [],
                        locations: [],
                        sortBy: "recommended",
                      })
                    }
                  >
                    {t("category.reset")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  )
}