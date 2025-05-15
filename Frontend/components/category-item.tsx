"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export interface CategoryItemProps {
  id: string
  title: string
  description: string
  price: number
  priceUnit: "night" | "day" | "week" | "destination" | "hour"
  location: string
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  featured?: boolean
  categoryType: "mansions" | "apartments" | "yachts" | "jets" | "cars" | "concierge"
}

export default function CategoryItem({
  id,
  title,
  description,
  price,
  priceUnit,
  location,
  rating,
  reviews,
  images,
  amenities,
  featured,
  categoryType,
}: CategoryItemProps) {
  const { t } = useLanguage()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceUnit = () => {
    switch (priceUnit) {
      case "night":
        return t("per Night")
      case "day":
        return t("per Day")
      case "week":
        return t("per Week")
      case "destination":
        return t("per Destination")
      case "hour":
        return t("per Hour")
      default:
        return t("per Night")
    }
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${
        featured ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
      }`}
    >
      <div className="relative h-64 w-full">
        <Image src={images[0] || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {featured && <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">Featured</Badge>}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {rating} <span className="text-gray-500 dark:text-gray-400">({reviews})</span>
            </span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{location}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="bg-gray-100 dark:bg-gray-800 font-normal">
              {t(`amenity.${amenity}`)}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 font-normal">
              +{amenities.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold">{formatPrice(price)}</span>{" "}
            <span className="text-gray-500 dark:text-gray-400 text-sm">{getPriceUnit()}</span>
          </div>
          <Link href={`/${categoryType}/${id}`}>
            <Button className="rounded-full">{t("category.viewMore")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
