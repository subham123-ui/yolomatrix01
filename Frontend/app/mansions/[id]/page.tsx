"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific mansion (fallback)
const mansionData = {
  id: "beverly-hills-estate",
  title: "Beverly Hills Estate",
  description:
    "Luxurious mansion with panoramic views of Los Angeles, featuring a grand pool, home theater, and wine cellar.",
  longDescription:
    "Experience the epitome of luxury living in this magnificent Beverly Hills estate. Perched high in the hills with breathtaking panoramic views of Los Angeles, this architectural masterpiece offers unparalleled privacy and opulence. The property features meticulously landscaped gardens, a grand infinity pool that seems to merge with the horizon, a state-of-the-art home theater, and an extensive wine cellar housing rare vintages. Each of the seven bedroom suites has been individually designed with the finest materials and furnishings, ensuring absolute comfort and elegance. The mansion includes a fully-equipped gourmet kitchen, formal dining room, multiple living areas, a fitness center with sauna, and a private office. A full staff including a private chef, housekeeping, and security is available to cater to your every need during your stay.",
  price: 15000,
  priceUnit: "night",
  location: "Beverly Hills, CA",
  rating: 4.9,
  reviews: 28,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security", "helipad"],
  features: [
    "7 bedroom suites with en-suite bathrooms",
    "Infinity pool with panoramic views",
    "Home theater with professional sound system",
    "Wine cellar with temperature control",
    "Gourmet kitchen with professional appliances",
    "Multiple outdoor entertainment areas",
    "Helipad for private arrivals and departures",
    "Private gym with latest equipment",
    "Spa with sauna, steam room, and massage area",
    "24/7 security and surveillance system",
  ],
  specifications: {
    "Property Size": "15,000 sq ft",
    "Lot Size": "2 acres",
    Bedrooms: "7",
    Bathrooms: "9",
    Parking: "10 cars",
    "Year Built": "2018",
    Renovated: "2022",
    View: "Panoramic city and ocean views",
  },
  categoryType: "mansions",
}

export default function MansionDetailPage() {
  const params = useParams()
  const mansionId = params.id as string
  
  const [mansion, setMansion] = useState(mansionData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMansionDetails = async () => {
      if (!mansionId) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`https://yolo-matrix.onrender.com/mansions/${mansionId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch mansion details: ${response.status}`)
        }
        
        const data = await response.json()
        setMansion(data)
        
      } catch (err) {
        console.error("Error fetching mansion details:", err)
        setError("Failed to load mansion details from API. Using fallback data.")
        // Keep using the fallback data already set in state
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMansionDetails()
  }, [mansionId])

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
          <CategoryDetail {...mansion} />
        </>
      )}
      <FloatingActions />
    </main>
  )
}