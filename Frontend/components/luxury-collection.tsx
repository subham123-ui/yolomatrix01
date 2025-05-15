"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Sparkles, Gift, Globe, CalendarClock, Headphones, Star, MapPin, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"
import BenefitsSection from './BenefitsSection'
import UserExperienceGrid from './UserExperienceGrid'
import ConciergeCard from './ConciergeCard'

interface LuxuryItem {
  id: string
  title: string
  image: string
  href: string
}

export default function LuxuryCollection() {
  const { t } = useLanguage()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("medellin")
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  const luxuryItems: LuxuryItem[] = [
    {
      id: "mansions",
      title: t("category.mansions"),
      image: "/images/mansions_img/Mansions_img1.jpeg",
      href: "/mansions",
    },
    {
      id: "apartments",
      title: t("category.apartments"),
      image: "/images/2.png",
      href: "/apartments",
    },
    {
      id: "yachts",
      title: t("category.yachts"),
      image: "/yatch.jpg",
      href: "/yachts",
    },
    {
      id: "jets",
      title: t("category.jets"),
      image: "/images/jet_img/jet_img1.jpg",
      href: "/jets",
    },
    {
      id: "cars",
      title: t("category.cars"),
      image: "/images/cars1.jpeg",
      href: "/cars",
    },
  ]
  
  const destinations = {
    medellin: {
      name: "Medellín",
      tagline: "City of Eternal Spring",
      description: "Nestled in the Aburrá Valley, Medellín boasts year-round spring-like weather, stunning mountain views, and a rich cultural scene. Enjoy vibrant festivals, explore lush parks, and experience the warmth of the 'City of Innovation.'",
      image: "/images/medellin/medellin-large.avif",
      gallery: [ "/images/medellin/medellin-3.webp","/images/medellin/medellin-large.avif", "/images/medellin/medellin-1.jpg", "/images/medellin/medellin-2.jpg","/images/medellin/medellin-5.jpg","/images/medellin/medellin-4.webp"],
      activities: ["City Tours", "Coffee Farm Visits", "Cable Car Rides", "Botanical Gardens"],
      price: "$1,499",
      duration: "5 nights",
      discount: "15% OFF",
      rating: 4.6,
      location: "Colombia",
      bestTime: "March to November"
    },
    cartagena: {
      name: "Cartagena",
      tagline: "Caribbean Charm",
      description: "Step into the heart of Colombia's Caribbean coast with Cartagena, where history, color, and warmth meet. Explore colonial architecture, wander cobblestone streets, and relax on pristine beaches with turquoise waters.",
      image: "/images/Cartagena/mansions-large.avif",
      gallery: ["/images/Cartagena/mansions-large.avif", "/images/Cartagena/Cartagena-1.avif", "/images/Cartagena/Cartagena-2.avif", "/images/Cartagena/Cartagena-3.avif"],
      activities: ["Old City Tour", "Beach Getaways", "Boat Tours", "Cooking Classes"],
      price: "$1,899",
      duration: "6 nights",
      discount: "10% OFF",
      rating: 4.8,
      location: "Colombia",
      bestTime: "December to April"
    },
    bogota: {
      name: "Bogotá",
      tagline: "The High Altitude Gem",
      description: "At over 2,600 meters above sea level, Bogotá is Colombia's vibrant capital known for its museums, historical sites, and modern urban life. Explore the Andean peaks, dine in top restaurants, and discover cultural treasures.",
      image: "/images/Bogotá/Bogotá-1.webp",
      gallery: ["/images/Bogotá/Bogotá-1.webp", "/images/Bogotá/Bogotá-large.jpeg", "/images/Bogotá/Bogotá-2.jpeg", "/images/Bogotá/Bogotá-3.jpg"],
      activities: ["Gold Museum Tour", "Ciclovía", "Andean Hiking", "Mountain Biking"],
      price: "$1,299",
      duration: "4 nights",
      discount: "12% OFF",
      rating: 4.5,
      location: "Colombia",
      bestTime: "March to December"
    },
    sanAndres: {
      name: "San Andrés",
      tagline: "Caribbean Paradise",
      description: "Discover the tropical beauty of San Andrés, with its crystal-clear waters, coral reefs, and laid-back atmosphere. Perfect for beach lovers, divers, and anyone seeking a peaceful island escape.",
      image: "/images/SanAndrés/SanAndrés-1.jpg",
      gallery: ["/images/SanAndrés/SanAndrés-1.jpg", "/images/SanAndrés/SanAndrés-large.jpeg", "/images/SanAndrés/SanAndrés-2.jpeg", "/images/SanAndrés/SanAndrés-3.jpeg"],
      activities: ["Snorkeling", "Scuba Diving", "Island Tours", "Beach Relaxation"],
      price: "$1,499",
      duration: "5 nights",
      discount: "18% OFF",
      rating: 4.7,
      location: "Colombia",
      bestTime: "December to April"
    },
    guatape: {
      name: "Guatapé",
      tagline: "The Colorful Wonder",
      description: "Famed for its vibrant houses and the towering Piedra del Peñol, Guatapé is a picturesque town nestled in the Colombian Andes. The lake and surrounding hills provide a stunning backdrop for hiking, boat tours, and sightseeing.",
      image: "/images/Guatapé/Guatapé-2.jpeg",
      gallery: ["/images/Guatapé/Guatapé-2.jpeg", "/images/Guatapé/Guatapé-1.jpeg", "/images/Guatapé/Guatapé.jpeg", "/images/Guatapé/Guatapé-3.jpeg"],
      activities: ["Piedra del Peñol Hike", "Boat Tours", "Village Exploration", "Photography"],
      price: "$1,299",
      duration: "3 nights",
      discount: "10% OFF",
      rating: 4.6,
      location: "Colombia",
      bestTime: "March to October"
    },
    cali: {
      name: "Cali",
      tagline: "Salsa Capital",
      description: "Known for its vibrant salsa culture, Cali is the heart of Colombian rhythm and nightlife. Dance the night away, explore lush parks, and indulge in delicious street food while soaking up the warm weather.",
      image: "/images/Cali/Cali-1.jpg",
      gallery: ["/images/Cali/Cali-1.jpg", "/images/Cali/Cali.jpeg", "/images/Cali/Cali-1.jpg", "/images/Cali/Cali-23.jpeg"],
      activities: ["Salsa Lessons", "Nightlife Tours", "Cali Zoo", "Nature Walks"],
      price: "$1,199",
      duration: "4 nights",
      discount: "20% OFF",
      rating: 4.4,
      location: "Colombia",
      bestTime: "December to April"
    }
  }
  
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveTab(tab)
        setCurrentImageIndex(0)
        setTimeout(() => {
          setIsAnimating(false)
        }, 50)
      }, 300)
    }
  }
  
  const handleNextImage = (e) => {
    if (e) e.preventDefault();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === destinations[activeTab].gallery.length - 1 ? 0 : prevIndex + 1
    );
  }
  
  const handlePrevImage = (e) => {
    if (e) e.preventDefault();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? destinations[activeTab].gallery.length - 1 : prevIndex - 1
    );
  }
  
  const handleGalleryImageClick = (index) => {
    setCurrentImageIndex(index)
  }
  
  // Touch handlers for swipe functionality
  const minSwipeDistance = 50
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      handleNextImage(null)
    }
    if (isRightSwipe) {
      handlePrevImage(null)
    }
  }

  return (
    <>
      <section className="py-6 md:py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{t("luxury.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {luxuryItems.map((item) => (
              <Link key={item.id} href={item.href} className="block group">
                <div
                  className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer h-64"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 md:group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/rentals">
              <button className="inline-flex items-center px-6 py-3 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black transition-colors">
                {t("category.viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>

          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Personal Concierge Service
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience unparalleled luxury with our dedicated concierge team ready to fulfill your every request
              </p>
            </div>
            <ConciergeCard />
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Destinations
            </h2>
          </div>

          <div className="flex justify-center mb-8 relative">
            <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 shadow-lg flex-wrap justify-center">
              {Object.keys(destinations).map((key) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={cn(
                    "px-4 py-2 m-1 rounded-full text-sm font-medium transition-all duration-300",
                    activeTab === key
                      ? "bg-blue-600 text-white shadow-md transform -translate-y-1"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {destinations[key].name}
                </button>
              ))}
            </div>

            <div className="absolute -left-4 -top-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
          </div>

          {Object.keys(destinations).map((key) => (
            <div
              key={key}
              className={cn(
                "transition-all duration-300",
                activeTab === key ? "opacity-100" : "hidden opacity-0",
                isAnimating && "opacity-0 transform scale-95"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div 
                  className="lg:col-span-2 relative rounded-2xl overflow-hidden h-64 md:h-72 lg:h-auto shadow-xl group"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={destinations[key].gallery[currentImageIndex]}
                      alt={destinations[key].name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Show navigation buttons only on desktop */}
                  <button 
                    onClick={handlePrevImage}
                    className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={handleNextImage}
                    className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Show swipe indicator on mobile */}
                  <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-xs bg-black/40 px-2 py-1 rounded-full">
                    Swipe to navigate
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {destinations[key].gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGalleryImageClick(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === index 
                            ? "bg-white w-4" 
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg font-bold shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform text-sm">
                    {destinations[key].discount}
                  </div>

                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-2 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                    <span>{destinations[key].rating}</span>
                  </div>

                  <div className="absolute bottom-10 left-0 w-full p-4 text-white">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-3 w-3 text-blue-400" />
                      <span className="text-xs">{destinations[key].location}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                      {destinations[key].name}
                    </h3>
                    <p className="text-sm text-blue-300">{destinations[key].tagline}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        About This Destination
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {destinations[key].description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Top Activities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {destinations[key].activities.map((activity) => (
                          <span
                            key={activity}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-xs hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors cursor-pointer"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Gallery
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {destinations[key].gallery.map((img, i) => (
                          <div
                            key={i}
                            className={`relative h-16 sm:h-20 md:h-24 rounded-lg overflow-hidden cursor-pointer ${
                              currentImageIndex === i ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => handleGalleryImageClick(i)}
                          >
                            <Image
                              src={img}
                              alt={`${destinations[key].name} gallery ${i + 1}`}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                            />
                            {currentImageIndex === i && (
                              <div className="absolute inset-0 bg-blue-500/20"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            Starting from
                          </span>
                          <div className="flex items-center">
                            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {destinations[key].price}
                            </span>
                            <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                              / {destinations[key].duration}
                            </span>
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                          <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                            Best Value
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1 text-blue-500" />
                          <span>Best time: {destinations[key].bestTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                          <span>No hidden fees</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <CalendarClock className="h-3 w-3 mr-1 text-blue-500" />
                          <span>Free cancellation up to 48h before</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/destinations/${key}`}>
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all">
                          Book Now <ChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <BenefitsSection/>

      <section className="py-8 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <UserExperienceGrid />
        </div>
      </section>
    </>
  )
}