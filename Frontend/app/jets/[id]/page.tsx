"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific jet (fallback)
const jetData = {
  id: "gulfstream-g700",
  title: "Gulfstream G700",
  description:
    "The ultimate in business jet luxury with the industry's largest cabin and range of 7,500 nautical miles.",
  longDescription:
    "Experience unparalleled luxury and performance with the Gulfstream G700, the flagship of the Gulfstream fleet and one of the most advanced business jets in the world. The G700 features the industry's largest cabin, meticulously designed to provide maximum comfort and functionality for long-range travel. The aircraft is configured with five distinct living areas, including a master suite with a private bathroom and shower, a formal dining area that seats six, and a dedicated entertainment zone. The cabin is flooded with natural light from 20 panoramic windows and features the Gulfstream Cabin Experience with 100% fresh air replenished every 2-3 minutes, the lowest cabin altitude in the industry, and whisper-quiet noise levels. The G700 is equipped with state-of-the-art avionics, including the award-winning Symmetry Flight Deck with active control sidesticks and extensive use of touchscreen technology. With a range of 7,500 nautical miles at Mach 0.85, the G700 can connect major global business centers without stopping, such as New York to Tokyo or Los Angeles to Sydney. Your flight will be operated by a highly experienced crew, including two pilots and a cabin attendant dedicated to providing exceptional service throughout your journey.",
  price: 15000,
  priceUnit: "destination",
  location: "Global",
  rating: 4.9,
  reviews: 14,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["wifi", "bar", "staff", "ac"],
  features: [
    "Five distinct living areas",
    "Master suite with private bathroom and shower",
    "Formal dining area seating six",
    "Dedicated entertainment zone",
    "20 panoramic windows",
    "100% fresh air replenished every 2-3 minutes",
    "Lowest cabin altitude in the industry",
    "Whisper-quiet noise levels",
    "High-speed Ka-band Wi-Fi",
    "Gourmet galley with full-size appliances",
  ],
  specifications: {
    Range: "7,500 nautical miles",
    "Maximum Speed": "Mach 0.925",
    "Cruising Speed": "Mach 0.85",
    "Maximum Altitude": "51,000 feet",
    Passengers: "Up to 19",
    "Sleeping Capacity": "Up to 10",
    "Baggage Capacity": "195 cubic feet",
    Engines: "2x Rolls-Royce Pearl 700",
    Avionics: "Gulfstream Symmetry Flight Deck",
    Year: "2023",
  },
  categoryType: "jets",
}

export default function JetDetailPage() {
  const params = useParams()
  const jetId = params.id as string
  
  const [jet, setJet] = useState(jetData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJetDetails = async () => {
      if (!jetId) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`https://yolo-matrix.onrender.com/jets/${jetId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jet details: ${response.status}`)
        }
        
        const data = await response.json()
        setJet(data)
        
      } catch (err) {
        console.error("Error fetching jet details:", err)
        setError("Failed to load jet details from API. Using fallback data.")
        // Keep using the fallback data already set in state
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchJetDetails()
  }, [jetId])

  return (
    <main className="min-h-screen pt-16">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="container mx-auto px-4 mb-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300">
                <p>{error}</p>
              </div>
            </div>
          )}
          <CategoryDetail {...jet} />
        </>
      )}
      <FloatingActions />
    </main>
  )
}