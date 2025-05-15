"use client"
import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific concierge service
export const conciergeData = {
  id: "private-events",
  title: "Private Event Planning",
  description: "Bespoke event planning service for exclusive parties, celebrations, and corporate gatherings.",
  longDescription:
    "Elevate your special occasions with our bespoke Private Event Planning service, designed to create unforgettable experiences tailored to your exact specifications. Our team of elite event planners brings decades of combined experience in organizing high-profile events for celebrities, royalty, and discerning clients worldwide. From intimate birthday celebrations to lavish wedding receptions, product launches, or corporate retreats, we handle every aspect of your event with meticulous attention to detail. The process begins with a personal consultation to understand your vision, preferences, and requirements. Our planners then curate a completely customized concept, sourcing the perfect venue, world-class catering, entertainment, decor, and any other elements needed to bring your vision to life. We maintain relationships with exclusive venues not available to the public, from historic castles and private islands to contemporary architectural masterpieces. Our network includes Michelin-starred chefs, internationally acclaimed performers, and the finest service providers in every category. Throughout the planning process, you'll have a dedicated event manager as your single point of contact, ensuring seamless communication and flawless execution. On the day of your event, our on-site team manages all logistics, allowing you to relax and enjoy the occasion with your guests. For those seeking absolute privacy, we offer comprehensive security planning and can arrange for NDAs from all vendors and staff. Whether you're celebrating a milestone, impressing clients, or simply gathering loved ones for an extraordinary experience, our Private Event Planning service delivers perfection down to the smallest detail.",
  price: 5000,
  priceUnit: "day",
  location: "Global",
  rating: 4.9,
  reviews: 42,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["staff", "security"],
  features: [
    "Dedicated event planning team",
    "Access to exclusive venues worldwide",
    "Michelin-starred catering options",
    "World-class entertainment booking",
    "Custom decor and floral design",
    "Professional photography and videography",
    "VIP transportation arrangements",
    "Comprehensive security planning",
    "On-site event management",
    "Post-event services and follow-up",
  ],
  specifications: {
    "Planning Time": "1-6 months (depending on event scale)",
    "Team Size": "3-15 dedicated professionals",
    "Guest Capacity": "10-1000+",
    "Service Areas": "Worldwide",
    Languages: "English, French, Spanish, Italian, Arabic, Mandarin",
    Available: "24/7, 365 days a year",
    Insurance: "Comprehensive event insurance available",
    Payment: "Customized payment schedules available",
  },
  categoryType: "concierge",
}

export default function ConciergeDetailPage() {
  const params = useParams()
  const conciergeId = params.id as string

  // In a real application, you would fetch the data based on the ID
  // For this example, we're using the mock data

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryDetail 
        data={conciergeData}
        categoryBaseUrl="https://yolo-matrix.onrender.com/concierge"
        categoryName="Concierge Services"
      />
      <FloatingActions 
        item={conciergeData}
        actionType="book"
        actionText="Book This Service"
      />
    </div>
  )
}