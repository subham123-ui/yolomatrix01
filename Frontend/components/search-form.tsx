"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Search, Users, X, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export default function SearchForm() {
  const { t } = useLanguage()
  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false)

  // Simple toggle with logging to debug
  const toggleMobileForm = () => {
    console.log("Toggle clicked, current state:", isMobileFormOpen)
    setIsMobileFormOpen(!isMobileFormOpen)
    console.log("New state will be:", !isMobileFormOpen)
  }

  // For CSS transition to work properly, we need to handle overflow differently
  useEffect(() => {
    const formElement = document.getElementById("search-form-container");
    if (formElement) {
      if (isMobileFormOpen) {
        // First set max-height, then after a small delay set overflow to visible
        setTimeout(() => {
          formElement.style.overflow = "visible";
        }, 300); // Match this to your transition duration
      } else {
        // When closing, immediately set overflow to hidden
        formElement.style.overflow = "hidden";
      }
    }
  }, [isMobileFormOpen]);

  return (
    <section id="search-section" className="relative z-10 px-4 py-12 md:py-16 bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl">
        {/* Mobile Search Bar (only visible on small screens) */}
        <div className="md:hidden flex justify-center -mt-20">
          <div 
            className={cn(
              "flex items-center w-full max-w-md relative rounded-full shadow-lg border",
              isMobileFormOpen 
                ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
                : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
            )}
          >
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <div className="w-full pl-9 pr-12 py-2.5 flex items-center" onClick={toggleMobileForm}>
              <span className="text-xs text-gray-500 dark:text-gray-400">Search</span>
            </div>
            <button
              onClick={toggleMobileForm}
              className="absolute right-3 p-1 rounded-full"
            >
              {isMobileFormOpen ? (
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-blue-500" />
              )}
            </button>
          </div>
        </div>

        {/* Search Form - Always visible on desktop, conditionally visible on mobile */}
        <div 
          id="search-form-container"
          className={cn(
            "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 md:p-8 border border-gray-100 dark:border-gray-800 transition-all duration-300",
            "md:-mt-20", // Only apply negative margin on desktop
            "md:opacity-100 md:max-h-screen md:visible", // Always visible on desktop
            isMobileFormOpen 
              ? "opacity-100 max-h-screen -mt-2 visible" // Adjusted margin for better positioning
              : "opacity-0 max-h-0 invisible md:visible" // Hide on mobile when closed, but always visible on desktop
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {/* Location */}
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                {t("search.location")}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder={t("search.location.placeholder")}
                  className="pl-9 rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-1 md:space-y-2 lg:col-span-2">
              <Label className="text-sm font-medium">{t("search.date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border-gray-200 dark:border-gray-700",
                      !date.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      t("search.date.placeholder")
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="guests" className="text-sm font-medium">
                {t("search.guests")}
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select>
                  <SelectTrigger className="pl-9 rounded-lg border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder={t("search.guests.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? t("search.guest") : t("search.guests")}
                      </SelectItem>
                    ))}
                    <SelectItem value="10+">10+ {t("search.guests")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                {t("search.category")}
              </Label>
              <Select>
                <SelectTrigger className="rounded-lg border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder={t("search.category.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mansions">{t("category.mansions")}</SelectItem>
                  <SelectItem value="yachts">{t("category.yachts")}</SelectItem>
                  <SelectItem value="jets">{t("category.jets")}</SelectItem>
                  <SelectItem value="cars">{t("category.cars")}</SelectItem>
                  <SelectItem value="apartments">{t("category.apartments")}</SelectItem>
                  <SelectItem value="concierge">{t("category.concierge")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 md:mt-6 flex justify-center w-full">
            <Button
              size="lg" 
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium w-full max-w-xs md:max-w-md lg:max-w-lg transition-all"
              type="submit"
            >
              <Search className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4 flex-shrink-0" />
              <span className="text-sm md:text-base truncate">Discover Exclusive Experiences</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}