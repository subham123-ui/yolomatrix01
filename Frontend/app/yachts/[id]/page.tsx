"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific yacht (fallback)
const yachtData = {
  id: "azure-dream",
  title: "Azure Dream",
  description: "Magnificent 180-foot superyacht with 5 luxurious cabins, jacuzzi, and a professional crew of 12.",
  longDescription:
    "Experience the ultimate in maritime luxury aboard the Azure Dream, a magnificent 180-foot superyacht that redefines opulence on the water. This stunning vessel combines sleek, modern design with unparalleled craftsmanship and attention to detail. The yacht features five luxuriously appointed cabins, including a master suite with panoramic views, a private lounge, and an en-suite bathroom with a jacuzzi tub. The main deck houses an elegant salon with floor-to-ceiling windows, a formal dining area that seats 12, and a state-of-the-art entertainment system. On the upper deck, you'll find a sky lounge perfect for relaxation or informal gatherings. The expansive sun deck is equipped with a jacuzzi, bar, and multiple lounging areas for soaking up the sun. Water enthusiasts will appreciate the extensive collection of toys and tenders, including jet skis, seabobs, paddleboards, and a tender for shore excursions. The Azure Dream is operated by a professional crew of 12, including a captain, engineer, chef, stewards, and deckhands, all dedicated to providing an exceptional yachting experience.",
  price: 75000,
  priceUnit: "week",
  location: "Mediterranean",
  rating: 4.9,
  reviews: 18,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
  features: [
    "5 luxurious cabins accommodating 10 guests",
    "Master suite with panoramic views and private lounge",
    "Formal dining area seating 12 guests",
    "Sun deck with jacuzzi and bar",
    "Extensive water toys collection",
    "Professional crew of 12",
    "Stabilizers for comfort at anchor and underway",
    "State-of-the-art entertainment systems throughout",
  ],
  specifications: {
    Length: "180 feet (55 meters)",
    Beam: "32 feet (9.8 meters)",
    Draft: "10 feet (3 meters)",
    "Year Built": "2019",
    Refitted: "2022",
    Builder: "Benetti",
    "Cruising Speed": "14 knots",
    "Maximum Speed": "18 knots",
    Range: "4,000 nautical miles",
    "Fuel Capacity": "20,000 gallons",
  },
  categoryType: "yachts",
}

export default function YachtDetailPage() {
  const params = useParams()
  const yachtId = params.id as string
  
  const [yacht, setYacht] = useState(yachtData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchYachtDetails = async () => {
      if (!yachtId) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`https://yolo-matrix.onrender.com/yachts/${yachtId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch yacht details: ${response.status}`)
        }
        
        const data = await response.json()
        setYacht(data)
        
      } catch (err) {
        console.error("Error fetching yacht details:", err)
        setError("Failed to load yacht details from API. Using fallback data.")
        // Keep using the fallback data already set in state
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchYachtDetails()
  }, [yachtId])

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
          <CategoryDetail {...yacht} />
        </>
      )}
      <FloatingActions />
    </main>
  )
}