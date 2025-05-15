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
import { mansionsAPI } from "@/lib/api-client"
import { AxiosError } from 'axios'

export default function MansionsPage() {
  // Mock data for mansions (fallback)
  const mansionsData: CategoryItemProps[] = [
    {
      id: "beverly-hills-estate",
      title: "Beverly Hills Estate",
      description:
        "Luxurious mansion with panoramic views of Los Angeles, featuring a grand pool, home theater, and wine cellar.",
      price: 15000,
      priceUnit: "night",
      location: "Beverly Hills, CA",
      rating: 4.9,
      reviews: 28,
      images: ["/images/mansions_img/Mansions_img1.jpeg"],
      amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security", "helipad"],
      featured: true,
      categoryType: "mansions",
    },
    {
      id: "miami-beachfront",
      title: "Miami Beachfront Villa",
      description: "Stunning beachfront property with direct ocean access, infinity pool, and tropical gardens.",
      price: 12000,
      priceUnit: "night",
      location: "Miami Beach, FL",
      rating: 4.8,
      reviews: 36,
      images: ["/images/mansions_img/Mansions_img2.jpeg"],
      amenities: ["pool", "beach", "spa", "wifi", "parking", "ac", "kitchen", "staff", "security"],
      categoryType: "mansions",
    },
    {
      id: "hamptons-retreat",
      title: "Hamptons Luxury Retreat",
      description:
        "Classic Hamptons estate with tennis court, pool house, and expansive gardens just minutes from the beach.",
      price: 18000,
      priceUnit: "night",
      location: "East Hampton, NY",
      rating: 4.7,
      reviews: 19,
      images: ["/images/mansions_img/Mansions_img3.jpeg"],
      amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security"],
      categoryType: "mansions",
    },
    {
      id: "malibu-oceanview",
      title: "Malibu Ocean View Estate",
      description: "Modern architectural masterpiece perched on the Malibu cliffs with breathtaking ocean views.",
      price: 20000,
      priceUnit: "night",
      location: "Malibu, CA",
      rating: 4.9,
      reviews: 24,
      images: ["/images/mansions_img/Mansions_img4.jpeg"],
      amenities: ["pool", "beach", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security"],
      categoryType: "mansions",
    },
    {
      id: "aspen-mountain-lodge",
      title: "Aspen Mountain Lodge",
      description: "Spectacular mountain retreat with ski-in/ski-out access, indoor pool, and panoramic mountain views.",
      price: 25000,
      priceUnit: "night",
      location: "Aspen, CO",
      rating: 4.8,
      reviews: 31,
      images: ["/images/mansions_img/Mansions_img5.jpeg"],
      amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security"],
      categoryType: "mansions",
    },
    {
      id: "palm-beach-estate",
      title: "Palm Beach Waterfront Estate",
      description: "Elegant waterfront mansion with private dock, tennis court, and lush tropical gardens.",
      price: 16000,
      priceUnit: "night",
      location: "Palm Beach, FL",
      rating: 4.7,
      reviews: 22,
      images: ["/images/mansions_img/Mansions_img6.jpeg"],
      amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security"],
      categoryType: "mansions",
    },
  ]

  const { t } = useLanguage()
  const [mansions, setMansions] = useState<CategoryItemProps[]>(mansionsData)
  const [filteredMansions, setFilteredMansions] = useState<CategoryItemProps[]>(mansionsData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
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

  // Fetch data from API
  useEffect(() => {
    const fetchMansions = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const { data } = await mansionsAPI.getAll()
        
        // Map API data to match the CategoryItemProps structure
        const formattedData = data.map((mansion: any) => ({
          id: mansion.id || String(mansion._id),
          title: mansion.title,
          description: mansion.description,
          price: mansion.price,
          priceUnit: mansion.priceUnit || "night",
          location: mansion.location,
          rating: mansion.rating,
          reviews: mansion.reviews,
          images: mansion.images || ["/images/mansions_img/Mansions_img1.jpeg"],
          amenities: mansion.amenities || [],
          featured: mansion.featured || false,
          categoryType: "mansions",
        }))
        
        setMansions(formattedData)
        setFilteredMansions(formattedData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch mansions:", err)
        const error = err as AxiosError
        const errorMessage = (error.response?.data as { message: string })?.message || "Failed to load mansions. Please try again later."
        setError(errorMessage)
        // Keep using the fallback data already set in state
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMansions()
  }, [])

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

  // Apply filters to mansions
  useEffect(() => {
    let filtered = [...mansions]

    // Filter by price
    filtered = filtered.filter(
      (mansion) => mansion.price >= filters.priceRange[0] && mansion.price <= filters.priceRange[1],
    )

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((mansion) => 
        mansion.amenities && filters.amenities.every((amenity) => mansion.amenities.includes(amenity))
      )
    }

    // Filter by location
    if (filters.locations.length > 0) {
      filtered = filtered.filter((mansion) => 
        mansion.location && filters.locations.some((loc) => mansion.location.includes(loc))
      )
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

    setFilteredMansions(filtered)
  }, [filters, mansions])

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
      {/* Enhanced Hero Banner with Video Background */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div
          style={{
            transform: `scale(${scale.get()})`,
            filter: `blur(${blur.get()}px)`,
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
            <source src="/Video/luxury-Mansions.mp4" type="video/mp4" />
            {/* Fallback image in case video doesn't load */}
            <Image
              src="/images/mansions_img/mansions_hero.jpg"
              alt={t("category.mansions")}
              fill
              className="object-cover"
              priority
            />
          </video>
        </div>
        
        <div 
          style={{ 
            opacity: gradientOpacity.get() 
          }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" 
        />
        
        <div 
          style={{ 
            opacity: opacity.get(),
            transform: `translateY(${translateY.get()}px)`
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
              {t("category.mansions")}
            </motion.h1>
            
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto drop-shadow-sm"
            >
              Experience unparalleled luxury in our exclusive collection of mansions around the world.
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
        </div>
      </section>

      {/* Mansions Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          {/* Display error message if API fetch failed */}
          {error && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300">
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <div className="lg:w-1/4">
              <CategoryFilter categoryType="mansions" onFilterChange={handleFilterChange} />
            </div>

            {/* Mansions Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t("category.mansions")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {filteredMansions.length} {t("category.results")}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredMansions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMansions.map((mansion, index) => (
                    <motion.div 
                      key={mansion.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <CategoryItem {...mansion} />
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
                        priceRange: [0, 50000],
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