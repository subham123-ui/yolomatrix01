"use client"

import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific car
const carData = {
  id: "lamborghini-aventador",
  title: "Lamborghini Aventador SVJ",
  description: "Flagship V12 supercar with 770 horsepower, scissor doors, and breathtaking performance.",
  longDescription:
    "Experience automotive perfection with the Lamborghini Aventador SVJ, the most extreme version of Lamborghini's flagship V12 supercar and a true masterpiece of engineering and design. The SVJ (Super Veloce Jota) represents the pinnacle of Lamborghini's technology, featuring the iconic naturally-aspirated 6.5-liter V12 engine that produces an astonishing 770 horsepower and 531 lb-ft of torque. This power is delivered to all four wheels through a 7-speed ISR (Independent Shifting Rod) transmission, propelling the car from 0 to 60 mph in just 2.8 seconds and to a top speed of over 217 mph. The SVJ incorporates Lamborghini's patented ALA 2.0 (Aerodinamica Lamborghini Attiva) active aerodynamics system, which dynamically adjusts airflow over and under the car to maximize downforce or minimize drag as needed. The aggressive exterior design is not just for show – every line, vent, and surface has been engineered to optimize performance. Inside, the cockpit combines luxury with a race-inspired environment, featuring carbon fiber sports seats, Alcantara upholstery, and a digital instrument cluster. The iconic scissor doors add to the theatrical experience that is quintessentially Lamborghini. With only a limited number produced worldwide, the Aventador SVJ is not just a supercar; it's an exclusive work of automotive art that delivers an unparalleled driving experience.",
  price: 2500,
  priceUnit: "hour",
  location: "Miami, FL",
  rating: 4.9,
  reviews: 32,
  images: [
    "/images/carsdemo/2020-lamborghini-aventador-svj-roadster-drive-118-1576871373.avif",
    "/images/carsdemo/1599791635906-photos.jpg",
    "/images/carsdemo/images.jpeg",
    "/images/carsdemo/lamborghini-aventador-dashboard-view-348215.avif",
    "/images/carsdemo/paris-france-oct-04-2018-metallic-green-lamborghini-aventador-svj-roadster-mondial-paris-motor-show-supercar-manufactured-by-italian-lamborghini-TWRN9W.jpg",

  ],
  amenities: ["ac", "parking"],
  features: [
    "Iconic scissor doors",
    "Carbon fiber monocoque chassis",
    "ALA 2.0 active aerodynamics system",
    "Four-wheel drive system",
    "Carbon ceramic brakes",
    "Magnetorheological suspension",
    "Drive mode selector (Strada, Sport, Corsa, Ego)",
    "Carbon fiber sports seats",
    "Alcantara and leather interior",
    "Digital instrument cluster",
  ],
  specifications: {
    Engine: "6.5L naturally-aspirated V12",
    Power: "770 hp @ 8,500 rpm",
    Torque: "531 lb-ft @ 6,750 rpm",
    Transmission: "7-speed ISR automated manual",
    Drive: "All-wheel drive",
    "0-60 mph": "2.8 seconds",
    "Top Speed": "217+ mph",
    Weight: "3,362 lbs (dry)",
    Production: "Limited to 900 units worldwide",
    Year: "2023",
  },
  categoryType: "cars",
}

export default function CarDetailPage() {
  const params = useParams()
  const carId = params.id as string

  // In a real application, you would fetch the data based on the ID
  // For this example, we're using the mock data

  return (
    <main className="min-h-screen pt-16">
      <CategoryDetail {...carData} />
      <FloatingActions />
    </main>
  )
}
