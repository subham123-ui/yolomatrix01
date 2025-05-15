"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  getHeaderTexts: () => string[]
  getButtonTexts: () => string[]
}

const defaultLanguageContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  getHeaderTexts: () => [],
  getButtonTexts: () => []
}

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext)

export const useLanguage = () => useContext(LanguageContext)

type LanguageProviderProps = {
  children: ReactNode
}

export const translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.rentals": "Rentals",
    "nav.concierge": "Concierge",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "language": "Language",
    "back": "Back",

    // Hero
    "hero.title": "Your Gateway to Exclusive Experiences",
    "hero.subtitle":
      "Discover handpicked luxury rentals—from opulent mansions to private yachts—tailored for the discerning traveler",
    "hero.tagline": "Now featuring Exclusive Packages Services",
    "hero.explore": "Explore Now",
    "hero.book": "Book a Ride",
    
    // Rotating Button Texts
    "hero.buttons": [
      "Start Your Luxury Journey",
      "Unlock Exclusive Experiences",
      "Reserve Your Escape Now"
    ],

    // Search Form
    "search.location": "Location",
    "search.location.placeholder": "Where to?",
    "search.date": "Date Range",
    "search.date.placeholder": "Check-in / Check-out",
    "search.guests": "Guests",
    "search.guests.placeholder": "Select guests",
    "search.category": "Category",
    "search.category.placeholder": "Select category",
    "search.button": "Search",
    "search.guest": "Guest",
    "search.guests": "Guests",

    // Categories
    "category.mansions": "Mansions",
    "category.apartments": "Apartments",
    "category.yachts": "Yachts",
    "category.jets": "Jets",
    "category.cars": "Cars",
    "category.concierge": "Packages",
    "category.viewDetails": "View Details",
    "category.viewAll": "View All Rentals",

    // Luxury Collection
    "luxury.title": "Explore Our Luxury Collection",
    "luxury.subtitle":
      "Discover the finest selection of luxury rentals tailored to your exclusive lifestyle and preferences.",

    // Category Pages
    "category.filter": "Filter",
    "category.sort": "Sort",
    "category.price": "Price",
    "category.amenities": "Amenities",
    "category.features": "Features",
    "category.location": "Location",
    "category.apply": "Apply Filters",
    "category.reset": "Reset",
    "category.results": "results found",
    "category.perNight": "per night",
    "category.perDay": "per day",
    "category.perWeek": "per week",
    "category.bookNow": "Book Now",
    "category.viewMore": "View More",
    "category.noResults": "No results found. Please try different filters.",

    // Amenities
    "amenity.pool": "Swimming Pool",
    "amenity.spa": "Spa",
    "amenity.gym": "Gym",
    "amenity.wifi": "WiFi",
    "amenity.parking": "Parking",
    "amenity.ac": "Air Conditioning",
    "amenity.kitchen": "Kitchen",
    "amenity.bar": "Bar",
    "amenity.staff": "Staff",
    "amenity.security": "Security",
    "amenity.helipad": "Helipad",
    "amenity.beach": "Beach Access",

    // About Page
    "about.title": "About YoloMatrix",
    "about.subtitle": "Redefining luxury experiences since 2020",
    "about.story": "Our Story",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.team": "Meet Our Team",
    "about.values": "Our Values",
    "about.cta": "Ready to Experience Luxury?",
    "about.contact": "Contact Us Today",

        "forgotPassword.title": "Forgot Password?",
    "forgotPassword.description": "Enter your email address and we'll send you a link to reset your password.",
    "forgotPassword.email": "Email Address",
    "forgotPassword.emailPlaceholder": "Enter your email",
    "forgotPassword.resetButton": "Reset Password",
    "forgotPassword.backToLogin": "Back to Login",
    "forgotPassword.rememberedPassword": "Remembered your password?",
    "forgotPassword.signIn": "Sign in",
    "forgotPassword.needHelp": "Need help?",
    "forgotPassword.contactSupport": "Contact support",
    "forgotPassword.checkEmail": "Check Your Email",
    "forgotPassword.emailSent": "We've sent a password reset link to {email}",
    "forgotPassword.tryDifferentEmail": "Try a different email",

    // Contact Page
    "contact.title": "Contact Us",
    "contact.subtitle": "Our concierge team is available 24/7 to assist you",
    "contact.form.title": "Send Us a Message",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "contact.form.phone": "Phone Number",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.info.title": "Contact Information",
    "contact.info.description":
      "Our luxury concierge team is available 24/7 to assist with any inquiries or to help you plan your next extraordinary experience.",
    "contact.info.headquarters": "Our Headquarters",
    "contact.info.phone": "Phone",
    "contact.info.email": "Email",
    "contact.info.offices": "Global Offices",

    // Login Page
    "login.welcome": "Welcome Back",
    "login.email": "Email Address",
    "login.emailPlaceholder": "Enter your email",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.forgotPassword": "Forgot Password?",
    "login.rememberMe": "Remember me",
    "login.signIn": "Sign In",
    "login.noAccount": "Don't have an account?",
    "login.createAccount": "Create Account",
    "login.orContinueWith": "Or continue with",

    // Signup Page
    "signup.createAccount": "Create Account",
    "signup.firstName": "First Name",
    "signup.lastName": "Last Name",
    "signup.email": "Email Address",
    "signup.password": "Password",
    "signup.confirmPassword": "Confirm Password",
    "signup.passwordsDoNotMatch": "Passwords don't match",
    "signup.passwordWeak": "Weak",
    "signup.passwordMedium": "Medium",
    "signup.passwordGood": "Good",
    "signup.passwordStrong": "Strong",
    "signup.agreeToTermsPrefix": "I agree to the",
    "signup.termsOfService": "Terms of Service",
    "signup.and": "and",
    "signup.privacyPolicy": "Privacy Policy",
    "signup.agreeToMarketing": "I want to receive updates about products, services and promotional offers",
    "signup.alreadyHaveAccount": "Already have an account?",
    "signup.login": "Login",
    "signup.orContinueWith": "Or continue with",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy",
  },
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.rentals": "Alquileres",
    "nav.concierge": "Conserjería",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "language": "Idioma",
    "back": "Atrás",

    // Hero
    "hero.title": "Experimenta el Lujo, Vive Yolo",
    "hero.subtitle":
      "Descubre alquileres de lujo seleccionados a mano, desde mansiones opulentas hasta yates privados, diseñados para el viajero más exigente.",
    "hero.tagline": "Ahora con Servicios Exclusivos de Conserjería",
    "hero.explore": "Explorar Ahora",
    "hero.book": "Reservar un Viaje",
    
    // Rotating Header Texts
    "hero.headers": [
      "Experimenta el Lujo, Vive Yolo",
      "Eleva Cada Viaje",
      "Donde el Lujo Encuentra la Aventura",
      "Más Allá del Viaje—Experimenta lo Extraordinario",
      "Creando Escapadas Inolvidables",
      "Tu Puerta de Entrada a Experiencias Exclusivas"
    ],
    
    // Rotating Button Texts
    "hero.buttons": [
      "Inicia Tu Viaje de Lujo",
      "Desbloquea Experiencias Exclusivas",
      "Reserva Tu Escape Ahora"
    ],

    // Search Form
    "search.location": "Ubicación",
    "search.location.placeholder": "¿A dónde vas?",
    "search.date": "Rango de Fechas",
    "search.date.placeholder": "Entrada / Salida",
    "search.guests": "Huéspedes",
    "search.guests.placeholder": "Seleccionar huéspedes",
    "search.category": "Categoría",
    "search.category.placeholder": "Seleccionar categoría",
    "search.button": "Buscar",
    "search.guest": "Huésped",
    "search.guests": "Huéspedes",

    // Categories
    "category.mansions": "Mansiones",
    "category.apartments": "Apartamentos",
    "category.yachts": "Yates",
    "category.jets": "Jets",
    "category.cars": "Coches",
    "category.concierge": "Conserjería",
    "category.viewDetails": "Ver Detalles",
    "category.viewAll": "Ver Todos los Alquileres",

    // Luxury Collection
    "luxury.title": "Explora Nuestra Colección de Lujo",
    "luxury.subtitle":
      "Descubre la mejor selección de alquileres de lujo adaptados a tu estilo de vida y preferencias exclusivas.",

    // Category Pages
    "category.filter": "Filtrar",
    "category.sort": "Ordenar",
    "category.price": "Precio",
    "category.amenities": "Comodidades",
    "category.features": "Características",
    "category.location": "Ubicación",
    "category.apply": "Aplicar Filtros",
    "category.reset": "Restablecer",
    "category.results": "resultados encontrados",
    "category.perNight": "por noche",
    "category.perDay": "por día",
    "category.perWeek": "por semana",
    "category.bookNow": "Reservar Ahora",
    "category.viewMore": "Ver Más",
    "category.noResults": "No se encontraron resultados. Intente con diferentes filtros.",

    // Amenities
    "amenity.pool": "Piscina",
    "amenity.spa": "Spa",
    "amenity.gym": "Gimnasio",
    "amenity.wifi": "WiFi",
    "amenity.parking": "Estacionamiento",
    "amenity.ac": "Aire Acondicionado",
    "amenity.kitchen": "Cocina",
    "amenity.bar": "Bar",
    "amenity.staff": "Personal",
    "amenity.security": "Seguridad",
    "amenity.helipad": "Helipuerto",
    "amenity.beach": "Acceso a la Playa",

    // About Page
    "about.title": "Sobre YoloMatrix",
    "about.subtitle": "Redefiniendo experiencias de lujo desde 2020",
    "about.story": "Nuestra Historia",
    "about.mission": "Nuestra Misión",
    "about.vision": "Nuestra Visión",
    "about.team": "Conoce a Nuestro Equipo",
    "about.values": "Nuestros Valores",
    "about.cta": "¿Listo para Experimentar el Lujo?",
    "about.contact": "Contáctanos Hoy",

    // Contact Page
    "contact.title": "Contáctanos",
    "contact.subtitle": "Nuestro equipo de conserjería está disponible 24/7 para ayudarte",
    "contact.form.title": "Envíanos un Mensaje",
    "contact.form.name": "Nombre Completo",
    "contact.form.email": "Correo Electrónico",
    "contact.form.phone": "Número de Teléfono",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",
    "contact.info.title": "Información de Contacto",
    "contact.info.description":
      "Nuestro equipo de conserjería de lujo está disponible 24/7 para ayudar con cualquier consulta o para ayudarte a planificar tu próxima experiencia extraordinaria.",
    "contact.info.headquarters": "Nuestra Sede",
    "contact.info.phone": "Teléfono",
    "contact.info.email": "Correo Electrónico",
    "contact.info.offices": "Oficinas Globales",

    // Login Page
    "login.welcome": "Bienvenido de nuevo",
    "login.email": "Correo electrónico",
    "login.emailPlaceholder": "Ingresa tu correo electrónico",
    "login.password": "Contraseña",
    "login.passwordPlaceholder": "Ingresa tu contraseña",
    "login.forgotPassword": "¿Olvidaste tu contraseña?",
    "login.rememberMe": "Recordarme",
    "login.signIn": "Iniciar Sesión",
    "login.noAccount": "¿No tienes una cuenta?",
    "login.createAccount": "Crear Cuenta",
    "login.orContinueWith": "O continuar con",

    

    // Signup Page
    "signup.createAccount": "Crear Cuenta",
    "signup.firstName": "Nombre",
    "signup.lastName": "Apellido",
    "signup.email": "Correo electrónico",
    "signup.password": "Contraseña",
    "signup.confirmPassword": "Confirmar contraseña",
    "signup.passwordsDoNotMatch": "Las contraseñas no coinciden",
    "signup.passwordWeak": "Débil",
    "signup.passwordMedium": "Medio",
    "signup.passwordGood": "Bueno",
    "signup.passwordStrong": "Fuerte",
    "signup.agreeToTermsPrefix": "Acepto los",
    "signup.termsOfService": "Términos de Servicio",
    "signup.and": "y",
    "signup.privacyPolicy": "Política de Privacidad",
    "signup.agreeToMarketing": "Quiero recibir actualizaciones sobre productos, servicios y ofertas promocionales",
    "signup.alreadyHaveAccount": "¿Ya tienes una cuenta?",
    "signup.login": "Iniciar Sesión",
    "signup.orContinueWith": "O continuar con",

       "forgotPassword.title": "¿Olvidaste tu contraseña?",
    "forgotPassword.description": "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    "forgotPassword.email": "Correo electrónico",
    "forgotPassword.emailPlaceholder": "Ingresa tu correo electrónico",
    "forgotPassword.resetButton": "Restablecer Contraseña",
    "forgotPassword.backToLogin": "Volver a Iniciar Sesión",
    "forgotPassword.rememberedPassword": "¿Recordaste tu contraseña?",
    "forgotPassword.signIn": "Iniciar sesión",
    "forgotPassword.needHelp": "¿Necesitas ayuda?",
    "forgotPassword.contactSupport": "Contacta a soporte",
    "forgotPassword.checkEmail": "Revisa Tu Correo",
    "forgotPassword.emailSent": "Hemos enviado un enlace para restablecer tu contraseña a {email}",
    "forgotPassword.tryDifferentEmail": "Intentar con otro correo",


    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.terms": "Términos de Servicio",
    "footer.privacy": "Privacidad",
  },
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const t = (key: string): string => {
    const lang = translations[language as keyof typeof translations]
    return lang && lang[key as keyof typeof lang] ? lang[key as keyof typeof lang] : key
  }

  const getHeaderTexts = (): string[] => {
    const lang = translations[language as keyof typeof translations]
    return lang && lang["hero.headers"] ? lang["hero.headers"] : []
  }

  const getButtonTexts = (): string[] => {
    const lang = translations[language as keyof typeof translations]
    return lang && lang["hero.buttons"] ? lang["hero.buttons"] : []
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getHeaderTexts, getButtonTexts }}>
      {children}
    </LanguageContext.Provider>
  )
}