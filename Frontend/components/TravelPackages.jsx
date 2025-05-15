"use client"

import { useState, useRef, useEffect } from "react";
import { 
  Home, Car, Shield, Plane, Ship, Bookmark, User, Heart, X,
  Star, ChevronLeft, ChevronRight, Calendar, Sparkles, MapPin
} from "lucide-react";

// Package data moved outside component to reduce code size
const packages = [
  {
    id: 1,
    title: "Elite Escape",
    description: "Experience a lavish getaway with our elite package.",
    location: "Maldives",
    fullDescription: "Indulge in the ultimate luxury escape with our Elite package. This exclusive offering includes a stunning mansion rental with private pool, luxury car rental for the duration of your stay, and 24/7 security services to ensure complete privacy and peace of mind throughout your vacation.",
    features: [
      { icon: <Home size={20} />, text: "Mansion rental" },
      { icon: <Car size={20} />, text: "Car rental" },
      { icon: <Shield size={20} />, text: "Security services" }
    ],
    price: 12500,
    priceDisplay: "$12,500",
    duration: "3 Days",
    image: "/images/santorini-2.jpeg",
    gallery: ["/images/Car_img/car_img1.webp","/images/santorini-1.webp","/images/Apartments_img/apartments_hero.jpg"],
    reviews: [
      { name: "James H.", rating: 5, text: "An unforgettable experience from start to finish." },
      { name: "Elizabeth R.", rating: 4, text: "The mansion was spectacular, truly a luxury escape." }
    ]
  },
  {
    id: 2,
    title: "Luxury Trio",
    description: "Indulge in ultimate luxury with our exclusive trio package",
    location: "French Riviera",
    fullDescription: "Our signature Luxury Trio package combines the finest experiences for the discerning traveler. Enjoy a spectacular mansion in an exclusive location, private jet transportation to and from your destination, luxury yacht tours along scenic coastlines, full concierge arrangement for all activities, and personal concierge services available at your beck and call.",
    features: [
      { icon: <Home size={20} />, text: "Mansion rental" },
      { icon: <Plane size={20} />, text: "Jet ride" },
      { icon: <Ship size={20} />, text: "Yacht tour" },
      { icon: <Bookmark size={20} />, text: "Concierge arrangement" },
      { icon: <User size={20} />, text: "Concierge services" }
    ],
    price: 18000,
    priceDisplay: "$18,000",
    duration: "5 Days",
    image: "/images/Cartagena/Cartagena-2.avif",
    gallery: ["/images/Cartagena/Cartagena-3.avif","/images/Car_img/car_img3.webp","/images/Guatapé/Guatapé-2.jpeg"],
    reviews: [
      { name: "Michael T.", rating: 5, text: "The yacht tour was exceptional, and the concierge service anticipated our every need." },
      { name: "Sophie L.", rating: 5, text: "Private jet travel has never been so seamless. Worth every penny." }
    ]
  },
  {
    id: 3,
    title: "Yacht & Mansion Getaway",
    description: "Savor a bespoke journey with our yacht and mansion offering",
    location: "Amalfi Coast",
    fullDescription: "The Yacht & Mansion Getaway represents the pinnacle of luxury travel. This completely customizable experience includes a magnificent mansion stay, private jet transportation, dedicated yacht charter with crew, and personalized concierge service to craft every aspect of your journey according to your desires. Perfect for special occasions or those who demand nothing but the absolute best.",
    features: [
      { icon: <Home size={20} />, text: "Mansion rental" },
      { icon: <Plane size={20} />, text: "Jet ride" },
      { icon: <Ship size={20} />, text: "Yacht charter" },
      { icon: <User size={20} />, text: "Concierge service" }
    ],
    price: 25000,
    priceDisplay: "Price on Request",
    duration: "4 Days",
    image: "/images/yachts.webp",
    gallery: ["/images/Cartagena/Cartagena-3.avif","/images/Car_img/car_img3.webp","/images/Guatapé/Guatapé-2.jpeg"],
    reviews: [
      { name: "Alexander K.", rating: 5, text: "A truly bespoke experience that exceeded all expectations." },
      { name: "Victoria P.", rating: 5, text: "The attention to detail was impeccable. We felt like royalty." }
    ]
  }
];

// Filter options as a constant to make code more readable
const filterOptions = [
  { id: "all", label: "All Packages" },
  { id: "budget", label: "Budget Luxury" },
  { id: "premium", label: "Premium Luxury" },
  { id: "saved", label: "Saved", icon: <Heart size={16} /> },
  
];

export default function LuxuryPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [savedPackages, setSavedPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  
  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Filter packages based on active filter
  const filteredPackages = activeFilter === "all" 
    ? packages 
    : packages.filter(pkg => {
        if (activeFilter === "saved") return savedPackages.includes(pkg.id);
        if (activeFilter === "budget") return pkg.price < 15000;
        if (activeFilter === "premium") return pkg.price >= 15000;
        return true;
      });

  // Toggle save package
  const toggleSavePackage = (id, e) => {
    e?.stopPropagation();
    setSavedPackages(prev => 
      prev.includes(id) ? prev.filter(pkgId => pkgId !== id) : [...prev, id]
    );
  };

  // Carousel navigation
  const carouselNav = {
    next: () => setCurrentSlide(prev => prev < filteredPackages.length - 1 ? prev + 1 : 0),
    prev: () => setCurrentSlide(prev => prev > 0 ? prev - 1 : filteredPackages.length - 1),
    goto: (index) => setCurrentSlide(index)
  };

  // Gallery navigation
  const galleryNav = {
    next: () => selectedPackage && setCurrentGalleryIndex(prev => 
      prev < selectedPackage.gallery.length - 1 ? prev + 1 : 0
    ),
    prev: () => selectedPackage && setCurrentGalleryIndex(prev => 
      prev > 0 ? prev - 1 : selectedPackage.gallery.length - 1
    ),
    goto: (index) => setCurrentGalleryIndex(index)
  };

  // Handle card hover
  const handleCardHover = (id, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [id]: isHovering
    }));
  };

  // Helper components to reduce repetitive JSX
  const HeartButton = ({ id }) => (
    <button 
      onClick={(e) => toggleSavePackage(id, e)}
      className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all transform hover:scale-110 active:scale-95"
      aria-label={savedPackages.includes(id) ? "Remove from saved" : "Save package"}
    >
      <Heart
        size={20}
        fill={savedPackages.includes(id) ? "#ec4899" : "none"}
        color={savedPackages.includes(id) ? "#ec4899" : "#6366f1"}
        className="transition-all duration-300"
      />
    </button>
  );

  const RatingStars = ({ rating = 5, size = 16 }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} 
          fill={i < rating ? "#fbbf24" : "none"} 
          color={i < rating ? "#fbbf24" : "#d1d5db"} 
          className="drop-shadow-sm"
        />
      ))}
    </div>
  );

  const LocationBadge = ({ location }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:bg-indigo-700/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
      <MapPin size={14} className="text-pink-300" />
      <span className="text-sm font-medium">{location}</span>
    </div>
  );

  const DurationBadge = ({ duration }) => (
    <div className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded-full shadow-sm">
      <Calendar size={14} className="text-indigo-600 dark:text-indigo-300" /> 
      <span className="text-sm font-medium">{duration}</span>
    </div>
  );

  const FeatureTag = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 p-2.5 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-700">
      <span className="text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-800 p-1.5 rounded-lg shadow-inner">{icon}</span>
      <span className="text-indigo-900 dark:text-indigo-200 text-sm font-medium">{text}</span>
    </div>
  );

  const FeaturesList = ({ features, limit = 4 }) => (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-xl mb-6 shadow-inner border border-indigo-100 dark:border-indigo-800">
      <div className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
        Package Includes:
      </div>
      <div className="grid grid-cols-2 gap-3">
        {features.slice(0, limit).map((feature, idx) => (
          <FeatureTag key={idx} icon={feature.icon} text={feature.text} />
        ))}
        {features.length > limit && (
          <div className="text-indigo-700 dark:text-indigo-300 text-sm font-medium col-span-2 text-center mt-1">
            +{features.length - limit} more features
          </div>
        )}
      </div>
    </div>
  );

  const ViewDetailsButton = ({ onClick, isHovered }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md font-medium text-sm transition-all duration-300
        ${isHovered ? 'scale-105' : 'scale-100'}
        bg-blue-600 hover:bg-blue-700 text-white
        dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white
        shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
      `}
    >
      View Experience Details
    </button>
  );

  const PriceDisplay = ({ priceDisplay }) => (
    <div>
      <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Starting from</div>
      <div className="font-bold text-2xl text-indigo-800 dark:text-indigo-100">{priceDisplay}</div>
    </div>
  );

  // Enhanced Package Card Component
  const PackageCard = ({ pkg, isMobile = false }) => {
    const isHovered = hoverStates[pkg.id] || false;
    
    return (
      <div 
        className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${
          isMobile ? '' : 'hover:shadow-2xl hover:-translate-y-2'
        }`}
        onMouseEnter={() => handleCardHover(pkg.id, true)}
        onMouseLeave={() => handleCardHover(pkg.id, false)}
      >
        {/* Package Image */}
        <div className="relative h-64 overflow-hidden">
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-900/40 to-indigo-900/70 dark:from-gray-900/90 dark:via-gray-900/60 dark:to-gray-900/80 z-10" />
          <img 
            src={pkg.image} 
            alt={pkg.title} 
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 filter brightness-90' : 'brightness-95'
            }`}
          />
          
          {/* Top badges */}
          <div className="absolute top-4 left-4 z-20">
            <LocationBadge location={pkg.location} />
          </div>
          <div className="absolute top-4 right-4 z-20">
            <HeartButton id={pkg.id} />
          </div>
          
          {/* Title overlay with improved contrast */}
  
          <div className="absolute bottom-0 left-0 w-full p-4 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl">
  <h2 className="text-lg font-semibold text-white px-3 py-2 bg-black/50 backdrop-blur-md dark:bg-white/10 rounded-lg shadow-md inline-block tracking-wide">
    {pkg.title}
  </h2>
</div>

        </div>
        
        {/* Package Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <DurationBadge duration={pkg.duration} />
            <RatingStars rating={5} />
          </div>
          
          <p className="text-indigo-800 dark:text-indigo-200 mb-6 text-lg font-medium">{pkg.description}</p>
          
          <FeaturesList features={pkg.features} />
          
          {/* Price & CTA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <PriceDisplay priceDisplay={pkg.priceDisplay} />
              
              {/* Exclusivity badge - Darker background for better contrast */}
{/* Black background in light mode, purple/pink gradient in dark mode */}
<div className="bg-black dark:bg-gradient-to-r dark:from-purple-700 dark:to-pink-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
  Exclusive
</div>
            </div>
            
            <ViewDetailsButton 
              onClick={() => setSelectedPackage(pkg)} 
              isHovered={isHovered}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 text-indigo-900 dark:text-indigo-100 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-900 dark:text-indigo-100 tracking-tight">
          <span className="text-indigo-800 dark:text-indigo-200">
            Explore Our Signature Packages
          </span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-800 dark:text-indigo-300 max-w-2xl mx-auto">
          Experience unparalleled luxury with our dedicated concierge team ready to fulfill your every request
        </p>
      </div>
      
      {/* Filter  */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`px-6 py-2.5 rounded-full transition-all font-medium ${
              option.icon ? 'flex items-center gap-2' : ''} ${
              activeFilter === option.id
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20"
            }`}
          >
            {option.icon && <span className={activeFilter === option.id ? "text-gray-900 dark:text-white" : "text-violet-400"}>{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Mobile Carousel View */}
      {isMobile && filteredPackages.length > 0 && (
        <div className="mb-12">
      <div 
            className="relative"
            onTouchStart={(e) => {
              const touchStart = e.touches[0].clientX;
              e.currentTarget.setAttribute('data-touch-start', touchStart);
            }}
            onTouchEnd={(e) => {
              const touchStart = parseFloat(e.currentTarget.getAttribute('data-touch-start') || '0');
              const touchEnd = e.changedTouches[0].clientX;
              const diff = touchStart - touchEnd;
              
              if (Math.abs(diff) > 50) {
                diff > 0 ? carouselNav.next() : carouselNav.prev();
              }
            }}
          >
            <PackageCard pkg={filteredPackages[currentSlide]} isMobile={true} />
          
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {filteredPackages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => carouselNav.goto(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === idx ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 scale-125' : 'bg-indigo-200 dark:bg-indigo-700 hover:bg-indigo-300 dark:hover:bg-indigo-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md mx-auto border border-indigo-100 dark:border-indigo-800">
            <div className="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-indigo-400 dark:text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-900 dark:text-indigo-100">No saved packages</h3>
            <p className="text-indigo-700 dark:text-indigo-300">
              You haven't saved any packages yet. Browse our luxury experiences and save your favorites.
            </p>
            <button 
              onClick={() => setActiveFilter("all")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-900 transition transform hover:scale-105 active:scale-95"
            >
              Browse All Packages
            </button>
          </div>
        </div>
      )}
      
      {/* Desktop Grid View */}
      {!isMobile && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
      
      {/* Package detail modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-indigo-900/90 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            {/* Gallery in modal */}
            <div className="relative">
              <div 
                className="relative h-72 md:h-96 overflow-hidden"
                onTouchStart={(e) => {
                  const touchStart = e.touches[0].clientX;
                  e.currentTarget.setAttribute('data-touch-start', touchStart);
                }}
                onTouchEnd={(e) => {
                  const touchStart = parseFloat(e.currentTarget.getAttribute('data-touch-start') || '0');
                  const touchEnd = e.changedTouches[0].clientX;
                  const diff = touchStart - touchEnd;
                  
                  if (Math.abs(diff) > 50) {
                    diff > 0 ? galleryNav.next() : galleryNav.prev();
                  }
                }}
              >
                {/* Enhanced gradient overlay for better text visibility in both modes */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />
                <img 
                  src={selectedPackage.gallery[currentGalleryIndex]} 
                  alt={`${selectedPackage.title} - image ${currentGalleryIndex + 1}`} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <LocationBadge location={selectedPackage.location} />
                  <div className="bg-indigo-700/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Calendar size={14} className="text-pink-200" />
                    <span className="text-sm font-medium">{selectedPackage.duration}</span>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <HeartButton id={selectedPackage.id} />
                  <button 
                    onClick={() => setSelectedPackage(null)}
                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-700 transition transform hover:scale-110 active:scale-95"
                  >
                    <X size={20} className="text-indigo-700 dark:text-indigo-300" />
                  </button>
                </div>
                
                {/* Improved title area with better text visibility */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                    {selectedPackage.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <RatingStars size={20} />
                    <span className="text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {selectedPackage.reviews.length} reviews
                    </span>
                  </div>
                </div>
                
                {/* Gallery navigation - visible on non-mobile only */}
                <button 
                  onClick={galleryNav.prev}
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition z-20 transform hover:scale-110 active:scale-95 hidden md:block"
                >
                  <ChevronLeft size={24} className="text-indigo-700 dark:text-indigo-300" />
                </button>
                
                <button 
                  onClick={galleryNav.next}
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition z-20 transform hover:scale-110 active:scale-95 hidden md:block"
                >
                  <ChevronRight size={24} className="text-indigo-700 dark:text-indigo-300" />
                </button>
                
                {/* Swipe indicator - visible on mobile only */}
                <div className="absolute bottom-24 left-0 right-0 flex justify-center items-center gap-1 md:hidden z-20">
                  <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm shadow-lg">
                    Swipe to navigate
                  </span>
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              <div className="flex justify-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
                {selectedPackage.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => galleryNav.goto(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden transition-all ${
                      currentGalleryIndex === idx ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* FIX: Content layout - Using flex for main content container on larger screens */}
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Left column: Details - Now uses flex-1 to expand properly */}
                <div className="w-full md:w-2/3">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                      <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                      Experience Details
                    </h3>
                    <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">{selectedPackage.fullDescription}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-100">Package Includes:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPackage.features.map((feature, idx) => (
                    <FeatureTag key={idx} icon={feature.icon} text={feature.text} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-100">Guest Reviews</h3>
                <div className="space-y-4">
                  {selectedPackage.reviews.map((review, idx) => (
                    <div key={idx} className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-indigo-900 dark:text-indigo-100">{review.name}</span>
                        <RatingStars rating={review.rating} />
                      </div>
                      <p className="text-white dark:text-indigo-300">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Booking & Price info */}
            <div className="w-full md:w-1/3">
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-800 sticky top-8">
    <h3 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-100">Book This Experience</h3>

    <div className="mb-6">
      <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Starting from</div>
      <div className="font-bold text-3xl text-indigo-800 dark:text-indigo-100 mb-1">{selectedPackage.priceDisplay}</div>
      <div className="text-sm text-indigo-600 dark:text-indigo-400">Per person, all inclusive</div>
    </div>

    {/* --- FORM STARTS HERE --- */}
    <form className="space-y-4 mb-6">
      
      {/* Select Date */}
      <div>
        <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Select Date</label>
        <input 
          type="date" 
          className="w-full p-3 border rounded-lg dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-white"
        />
      </div>

      {/* Number of Guests */}
      <div>
        <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Number of Guests</label>
        <select 
          className="w-full p-3 border rounded-lg dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-white"
        >
          <option>1 Guest</option>
          <option>2 Guests</option>
          <option>3 Guests</option>
          <option>4 Guests</option>
          <option>5+ Guests</option>
        </select>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Special Requests</label>
        <textarea 
          rows="3"
          placeholder="Any special requests?"
          className="w-full p-3 border rounded-lg dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-white resize-none"
        />
      </div>

    </form>
    {/* --- FORM ENDS HERE --- */}

    <button className="w-full mb-4 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition transform hover:scale-105 active:scale-95 font-semibold">
      Request Booking
    </button>

    <button className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition">
      <Heart size={18} /> Save to Wishlist
    </button>

    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
        <Shield size={20} className="text-green-500" />
        <span>Free cancellation up to 14 days before</span>
      </div>
      <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
        <User size={20} className="text-blue-500" />
        <span>Dedicated personal concierge</span>
      </div>
      <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
        <Star size={20} className="text-amber-500" />
        <span>VIP access to exclusive venues</span>
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
}