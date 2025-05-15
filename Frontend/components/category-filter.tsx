"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"

export type CategoryFilters = {
  priceRange: number[]
  amenities: string[]
  locations: string[]
  sortBy: "recommended" | "price-low" | "price-high" | "rating"
}

interface CategoryFilterProps {
  categoryType: "mansions" | "apartments" | "yachts" | "jets" | "cars" | "concierge"
  onFilterChange: (filters: CategoryFilters) => void
  initialFilters?: CategoryFilters
}

export default function CategoryFilter({ categoryType, onFilterChange, initialFilters }: CategoryFilterProps) {
  const { t } = useLanguage()
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || [0, 100])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters?.amenities || [])
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialFilters?.locations || [])
  const [sortBy, setSortBy] = useState<CategoryFilters["sortBy"]>(initialFilters?.sortBy || "recommended")

  // Different price ranges based on category
  const getPriceRange = () => {
    switch (categoryType) {
      case "mansions":
        return [1000, 50000]
      case "apartments":
        return [500, 10000]
      case "yachts":
        return [2000, 100000]
      case "jets":
        return [5000, 200000]
      case "cars":
        return [500, 5000]
      case "concierge":
        return [200, 10000]
      default:
        return [0, 10000]
    }
  }

  const maxPrice = getPriceRange()[1]

  // Get amenities based on category
  const getAmenities = () => {
    const commonAmenities = [
      { id: "wifi", label: t("amenity.wifi") },
      { id: "ac", label: t("amenity.ac") },
    ]

    switch (categoryType) {
      case "mansions":
      case "apartments":
        return [
          ...commonAmenities,
          { id: "pool", label: t("amenity.pool") },
          { id: "spa", label: t("amenity.spa") },
          { id: "gym", label: t("amenity.gym") },
          { id: "parking", label: t("amenity.parking") },
          { id: "kitchen", label: t("amenity.kitchen") },
          { id: "staff", label: t("amenity.staff") },
          { id: "security", label: t("amenity.security") },
          { id: "helipad", label: t("amenity.helipad") },
          { id: "beach", label: t("amenity.beach") },
        ]
      case "yachts":
        return [
          ...commonAmenities,
          { id: "bar", label: t("amenity.bar") },
          { id: "staff", label: t("amenity.staff") },
          { id: "kitchen", label: t("amenity.kitchen") },
        ]
      case "jets":
        return [...commonAmenities, { id: "bar", label: t("amenity.bar") }, { id: "staff", label: t("amenity.staff") }]
      case "cars":
        return [
          { id: "ac", label: t("amenity.ac") },
          { id: "parking", label: t("amenity.parking") },
        ]
      case "concierge":
        return [
          { id: "staff", label: t("amenity.staff") },
          { id: "security", label: t("amenity.security") },
        ]
      default:
        return commonAmenities
    }
  }

  // Get locations based on category
  const getLocations = () => {
    return ["New York", "Los Angeles", "Miami", "London", "Paris", "Dubai", "Tokyo", "Sydney", "Monaco", "Ibiza"]
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleLocationChange = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, locationId])
    } else {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    }
  }

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      amenities: selectedAmenities,
      locations: selectedLocations,
      sortBy,
    })
  }

  const resetFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedAmenities([])
    setSelectedLocations([])
    setSortBy("recommended")
    onFilterChange({
      priceRange: [0, maxPrice],
      amenities: [],
      locations: [],
      sortBy: "recommended",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Desktop filter
  const DesktopFilter = () => (
    <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{t("category.filter")}</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          {t("category.reset")}
        </Button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">{t("category.price")}</h4>
        <Slider value={priceRange} min={0} max={maxPrice} step={100} onValueChange={setPriceRange} className="mb-2" />
        <div className="flex justify-between text-sm">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Amenities */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h4 className="font-medium">{t("category.amenities")}</h4>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {getAmenities().map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
              />
              <Label htmlFor={`desktop-${amenity.id}`} className="text-sm">
                {amenity.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Location */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h4 className="font-medium">{t("category.location")}</h4>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {getLocations()
            .slice(0, 6)
            .map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`desktop-${location}`}
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                />
                <Label htmlFor={`desktop-${location}`} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>

      <Button onClick={applyFilters} className="w-full rounded-full">
        {t("category.apply")}
      </Button>
    </div>
  )

  // Mobile filter
  const MobileFilter = () => (
    <div className="lg:hidden flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mr-2">
              <Filter className="h-4 w-4 mr-2" />
              {t("category.filter")}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>{t("category.filter")}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("category.price")}</h4>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={100}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Amenities */}
              <Collapsible defaultOpen className="mb-6">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <h4 className="font-medium">{t("category.amenities")}</h4>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-2">
                  {getAmenities().map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-${amenity.id}`}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                      />
                      <Label htmlFor={`mobile-${amenity.id}`} className="text-sm">
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Location */}
              <Collapsible defaultOpen className="mb-6">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <h4 className="font-medium">{t("category.location")}</h4>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-2">
                  {getLocations().map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-${location}`}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                      />
                      <Label htmlFor={`mobile-${location}`} className="text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <div className="flex space-x-2">
                <Button onClick={applyFilters} className="flex-1">
                  {t("category.apply")}
                </Button>
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  {t("category.reset")}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={value => setSortBy(value as CategoryFilters["sortBy"]) }>
          <SelectTrigger className="w-[160px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("category.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <>
      <MobileFilter />
      <DesktopFilter />
    </>
  )
}
