"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import Logo from "@/components/logo"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const [heroHeight, setHeroHeight] = useState(0)

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true)
    
    // Set default theme to light on initial load only once
    // This is important - we only want to force light mode on the initial page load
    if (!localStorage.getItem('theme-initialized')) {
      setTheme('light')
      localStorage.setItem('theme-initialized', 'true')
    }
    
    // Calculate 70vh in pixels
    const calculateHeroHeight = () => {
      const viewportHeight = window.innerHeight
      return viewportHeight * 0.7 // 70% of viewport height
    }
    
    // Set initial height
    setHeroHeight(calculateHeroHeight())
    
    // Update height on resize
    const handleResize = () => {
      setHeroHeight(calculateHeroHeight())
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > heroHeight)
    }
    
    // Add event listeners
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    
    // Call once to set initial state
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [heroHeight, setTheme])

  const toggleMenu = () => setIsOpen(!isOpen)
  
  // Enhanced theme toggle function with explicit handling
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  // Don't render until after hydration to avoid mismatch
  if (!mounted) return null

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.rentals"), href: "/rentals" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  // Determine current theme for icon display
  const currentTheme = theme || "light"
  const isDark = currentTheme === "dark"

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/90 backdrop-blur-md shadow-md h-16" 
          : "bg-transparent h-20"
      )}
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between transition-all">
        {/* Balanced approach to logo sizing - smaller but still visible */}
        <div className="flex items-center">
        <Logo className="w-[120px] h-auto" />

        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 transition-all">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-neutral-900 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}

          <Link href="/login">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-6 ml-2 border-blue-600 text-blue-700 hover:bg-blue-100 hover:text-blue-900 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-all"
            >
              {t("nav.login")}
            </Button>
          </Link>

          <div className="flex items-center space-x-1 ml-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-9 w-9 text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English {language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")}>
                  Español {language === "es" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle Button - Properly wired */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9 text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9 text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className="rounded-full h-9 w-9 text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900 shadow-lg divide-y divide-gray-100 dark:divide-gray-800 backdrop-blur-sm transition-all">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-900 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 py-3 font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800 mt-2">
              <Link 
                href="/login"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Button 
                  variant="outline" 
                  className="w-full rounded-full border-blue-600 text-blue-700 hover:bg-blue-100 hover:text-blue-900 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-all"
                >
                  {t("nav.login")}
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-3 py-3 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-neutral-700 dark:text-gray-400">{t("language")}:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("en")}
                className={cn("rounded-full transition-all",
                  language === "en" 
                    ? "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300" 
                    : "text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                EN
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("es")}
                className={cn("rounded-full transition-all",
                  language === "es" 
                    ? "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300" 
                    : "text-neutral-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                ES
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}