"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Define interface for apartment data
interface ApartmentData {
  id: string
  title: string
  description: string
  longDescription: string
  price: number
  priceUnit: string
  location: string
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  features: string[]
  specifications: Record<string, string>
  categoryType: string
}

export default function ApartmentDetailPage() {
  const params = useParams()
  const apartmentId = params.id as string
  
  const [apartment, setApartment] = useState<ApartmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApartmentData() {
      try {
        setIsLoading(true)
        
        // First, fetch all apartments
        const response = await fetch('https://yolo-matrix.onrender.com/appartments')
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const allApartments = await response.json()
        
        // Find the specific apartment by ID
        const foundApartment = allApartments.find((apt: any) => apt.id === apartmentId)
        
        if (!foundApartment) {
          throw new Error(`Apartment with ID "${apartmentId}" not found`)
        }
        
        // Transform the API data to match our expected format
        // This might need adjustment based on the actual API response structure
        const formattedApartment: ApartmentData = {
          id: foundApartment.id,
          title: foundApartment.title || 'Untitled Apartment',
          description: foundApartment.description || '',
          longDescription: foundApartment.longDescription || foundApartment.description || '',
          price: foundApartment.price || 0,
          priceUnit: foundApartment.priceUnit || 'night',
          location: foundApartment.location || 'Unknown location',
          rating: foundApartment.rating || 0,
          reviews: foundApartment.reviews || 0,
          images: foundApartment.images || [
            "/placeholder.svg?height=800&width=1200",
            "/placeholder.svg?height=800&width=1200"
          ],
          amenities: foundApartment.amenities || [],
          features: foundApartment.features || [],
          specifications: foundApartment.specifications || {},
          categoryType: "apartments"
        }
        
        setApartment(formattedApartment)
      } catch (err) {
        console.error('Error fetching apartment data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch apartment data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchApartmentData()
  }, [apartmentId])

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading apartment details...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.href = '/apartments'}
          >
            Back to Apartments
          </button>
        </div>
      </main>
    )
  }

  if (!apartment) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Apartment Not Found</h2>
          <p>We couldn't find an apartment with the ID: {apartmentId}</p>
          <button 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.href = '/apartments'}
          >
            Browse All Apartments
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16">
      <CategoryDetail {...apartment} />
      <FloatingActions />
    </main>
  )
}