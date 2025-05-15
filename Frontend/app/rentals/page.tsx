"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MessageSquare, ChevronRight, Menu, X, ChevronDown, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpring, animated } from "react-spring"
import Footer from "@/components/footer"
import FloatingActions from "@/components/floating-actions"
import { useLanguage } from "@/contexts/language-context"
import CategoryFilter from "@/components/category-filter"
import CategoryItem, { type CategoryItemProps } from "@/components/category-item"
import { mansionsAPI, apartmentsAPI, jetsAPI, yachtsAPI, conciergeAPI } from "@/lib/api-client"

type SortBy = "recommended" | "price-low" | "price-high" | "rating"

// Define the rental category data structure
const rentalCategories = [
  {
    id: "mansions" as const,
    title: "Luxury Mansions",
    description:
      "Experience unparalleled luxury in our exclusive collection of mansions around the world. From beachfront villas to mountain retreats, our collection includes some of the most prestigious properties available for short-term rental.",
    heroImage: "/images/mansions_img/Mansions_hero1.jpeg",
    heroVideo: "/Video/luxury-mansions.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 50000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
  {
    id: "apartments" as const,
    title: "Premium Apartments",
    description:
      "Discover our collection of luxury apartments in the world's most desirable locations. From Manhattan penthouses to Parisian pieds-à-terre, our apartments offer the perfect blend of comfort, style, and convenience.",
    heroImage: "/images/rental_hero.webp",
    heroVideo: "/Video/luxury-Apartments.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 10000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
  {
    id: "jets" as const,
    title: "Private Jets",
    description:
      "Experience the pinnacle of air travel with our exclusive private jet collection. From mid-size jets to ultra-long-range aircraft, our fleet offers unparalleled comfort, privacy, and flexibility for your travel needs.",
    heroImage: "/Video/luxury-jets.mp4",
    heroVideo: "/Video/luxury-jets.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 50000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
  {
    id: "cars" as const,
    title: "Exotic Cars",
    description:
      "Drive in style with our collection of exotic and luxury vehicles. From Italian supercars to British grand tourers, our fleet features the most coveted automobiles from prestigious manufacturers worldwide.",
    heroImage: "/Video/luxury-cars.mp4",
    heroVideo: "/Video/luxury-cars.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 5000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
  {
    id: "yachts" as const,
    title: "Superyachts",
    description:
      "Set sail in ultimate luxury with our exclusive collection of superyachts. From sleek motor yachts to classic sailing vessels, our fleet offers the perfect vessel for exploring the world's most beautiful coastlines.",
    heroImage: "/images/rental_hero.webp",
    heroVideo: "/Video/luxury-yachts.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 100000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
  {
    id: "concierge" as const,
    title: "Concierge Services",
    description:
      "Elevate your experience with our premium concierge services. From event planning to personal shopping, our dedicated team is available 24/7 to fulfill your every request and create unforgettable memories.",
    heroImage: "/images/rental_hero.webp",
    heroVideo: "/Video/luxury-concierge.mp4",
    items: [] as CategoryItemProps[],
    filters: {
      priceRange: [0, 10000],
      amenities: [] as string[],
      locations: [] as string[],
      sortBy: "recommended" as SortBy,
    }
  },
]

type CategoryId = typeof rentalCategories[number]["id"]

interface CategoryFilterProps {
  categoryType: CategoryId
  onFilterChange: (newFilters: {
    priceRange: number[]
    amenities: string[]
    locations: string[]
    sortBy: SortBy
  }) => void
  initialFilters: {
    priceRange: number[]
    amenities: string[]
    locations: string[]
    sortBy: SortBy
  }
}

export default function RentalsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<CategoryId>("mansions")
  const [isLoaded, setIsLoaded] = useState(false)
  const [filteredItems, setFilteredItems] = useState<CategoryItemProps[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    amenities: [] as string[],
    locations: [] as string[],
    sortBy: "recommended" as SortBy,
  })
  
  // Add state for hero zoom effect using react-spring
  const [{ currentZoom }, setSpring] = useSpring(() => ({
    currentZoom: 1,
    config: { mass: 1, tension: 80, friction: 26, clamp: true },
  }))
  
  const heroRef = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Get the active category data
  const activeCategoryData = rentalCategories.find((cat) => cat.id === activeTab)

  // Handle client-side rendering check
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-play video when component mounts or when tab changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error);
        // Could add a play button here if autoplay is blocked
      });
    }
  }, [activeTab])

  // Add zoom effect on scroll
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Calculate zoom based on scroll position with easing function
      const scrollProgress = Math.min(1, scrollY / 500); // Use 500px as max scroll for full effect
      
      // Apply easing function for smoother zoom (cubic easing)
      const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
      
      // Scale from 1 to 1.3 based on the eased progress
      const newZoom = 1 + (easedProgress * 0.3);
      
      // Update spring animation
      setSpring({ currentZoom: newZoom });
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient, setSpring]);

  useEffect(() => {
    if (isClient) {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      checkMobile();
      window.addEventListener('resize', checkMobile);
  
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, [isClient]);
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Set the initial filters when changing tabs
    if (activeCategoryData) {
      setFilters(activeCategoryData.filters)
      setFilteredItems(activeCategoryData.items || [])
    }
  }, [activeTab])

  useEffect(() => {
    if (!activeCategoryData) return

    let filtered = [...(activeCategoryData.items || [])]

    // Filter by price
    filtered = filtered.filter(
      (item) => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1],
    )

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((item) => 
        filters.amenities.every((amenity) => item.amenities?.includes(amenity))
      )
    }

    // Filter by location
    if (filters.locations.length > 0) {
      filtered = filtered.filter((item) => 
        filters.locations.some((loc) => item.location?.includes(loc))
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

    setFilteredItems(filtered)
  }, [filters, activeCategoryData])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    if (isClient && window.innerWidth < 1024) {
      setShowMobileFilters(false) // Close mobile filters after applying
    }
  }

  // Function to toggle mobile filters drawer
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  // Select a category and close dropdown on mobile
  const selectCategory = (categoryId: string) => {
    setActiveTab(categoryId as CategoryId)
    setShowMobileMenu(false)
  }

  // Fetch data for each category
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError("")

        // Fetch data for each category
        const [mansions, apartments, jets, yachts, concierge] = await Promise.all([
          mansionsAPI.getAll(),
          apartmentsAPI.getAll(),
          jetsAPI.getAll(),
          yachtsAPI.getAll(),
          conciergeAPI.getAll()
        ])

        // Update the rental categories with fetched data
        rentalCategories[0].items = mansions.data || []
        rentalCategories[1].items = apartments.data || []
        rentalCategories[2].items = jets.data || []
        rentalCategories[4].items = yachts.data || []
        rentalCategories[5].items = concierge.data || []

        // Set initial filtered items
        if (activeCategoryData) {
          setFilteredItems(activeCategoryData.items || [])
        }

      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load rental data. Please try again later.")
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [])

  // Update the sort function to use the correct type
  const handleSort = (sortBy: SortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  return (
    <main className="min-h-screen pt-0">
      {/* Enhanced Hero Banner with Video Background & Zoom/Parallax Effect */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <motion.div
          className="relative w-full h-[60vh] overflow-hidden"
          animate={{
            scale: currentZoom.get(),
            filter: `brightness(${1 - (currentZoom.get() - 1) * 0.2})`,
            opacity: 1 - (currentZoom.get() - 1) * 0.5,
          }}
        >
          {/* Video background with fallback image */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={activeCategoryData?.heroVideo || "/Video/luxury-rentals.mp4"} type="video/mp4" />
            {/* Fallback image */}
            <Image
              src={activeCategoryData?.heroImage || "/images/rental_hero.webp"}
              alt={activeCategoryData?.title || "Luxury Rentals"}
              fill
              className="object-cover"
              priority
            />
          </video>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-black/50"
          animate={{
            opacity: (currentZoom.get() - 1) * 0.5,
          }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: 1 / currentZoom.get(),
          }}
        >
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg"
            >
              {activeCategoryData?.title || "Luxury Rentals"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 max-w-3xl mx-auto drop-shadow-md"
            >
              {activeCategoryData?.description || "Discover our exclusive collection of premium rentals"}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Responsive Tab Navigation */}
      <section className="bg-white dark:bg-black py-4 sm:py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Mobile Dropdown Menu */}
          <div className="sm:hidden">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between"
              onClick={toggleMobileMenu}
            >
              <span>{activeCategoryData?.title || "Select Category"}</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-300 ${showMobileMenu ? 'rotate-180' : ''}`} 
              />
            </Button>
            
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-30 mt-2 w-[calc(100%-2rem)] mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {rentalCategories.map((category) => (
                    <div 
                      key={category.id}
                      className={`p-3 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between ${
                        activeTab === category.id ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => selectCategory(category.id)}
                    >
                      <span className={activeTab === category.id ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
                        {category.title}
                      </span>
                      {activeTab === category.id && <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Original Desktop Tabs */}
          <div className="hidden sm:block">
            <Tabs
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value as CategoryId)}
              className="w-full"
            >
              <TabsList className="w-full flex flex-nowrap justify-center mb-0 bg-transparent overflow-visible">
                {rentalCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full data-[state=active]:shadow-lg transition-all duration-300 m-1 whitespace-nowrap text-sm sm:text-base"
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Filter Toggle Button */}
              <div className="lg:hidden flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">{activeCategoryData?.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filteredItems.length} {t("category.results")}
                  </p>
                </div>
                <Button 
                  onClick={toggleMobileFilters} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {showMobileFilters ? <X size={16} /> : <Menu size={16} />}
                  <span>{showMobileFilters ? "Close" : "Filters"}</span>
                </Button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Sidebar Filter - Responsive Drawer on Mobile */}
                <AnimatePresence>
                  {(showMobileFilters || (isClient && window.innerWidth >= 1024)) && (
                    <motion.div
                      className={`${
                        showMobileFilters 
                          ? "fixed inset-0 z-50 bg-white dark:bg-black p-4 overflow-y-auto" 
                          : "hidden lg:block lg:w-1/4"
                      }`}
                      initial={{ x: showMobileFilters ? "-100%" : 0, opacity: showMobileFilters ? 0 : 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: showMobileFilters ? "-100%" : 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                      {showMobileFilters && (
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold">Filters</h3>
                          <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                            <X size={24} />
                          </Button>
                        </div>
                      )}
                      <CategoryFilter
                        categoryType={activeTab}
                        onFilterChange={handleFilterChange}
                        initialFilters={{
                          priceRange: filters.priceRange,
                          amenities: filters.amenities,
                          locations: filters.locations,
                          sortBy: filters.sortBy,
                        }}
                      />
                      {showMobileFilters && (
                        <div className="mt-4 sticky bottom-0 bg-white dark:bg-black py-4 border-t border-gray-200 dark:border-gray-800">
                          <Button 
                            className="w-full"
                            onClick={() => setShowMobileFilters(false)}
                          >
                            Show {filteredItems.length} Results
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Items Grid */}
                <div className="lg:w-3/4">
                  <div className="hidden lg:block mb-6">
                    <h2 className="text-2xl font-bold">{activeCategoryData?.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {filteredItems.length} {t("category.results")}
                    </p>
                  </div>

                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {filteredItems.map((item) => (
                        <div key={item.id} className="transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                          <CategoryItem {...item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{t("category.noResults")}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (activeCategoryData) {
                            setFilters(activeCategoryData.filters)
                          }
                        }}
                      >
                        {t("category.reset")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  )
}