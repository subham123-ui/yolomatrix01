"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Star, MapPin, Calendar, Users, Clock, X, Heart } from "lucide-react"
import { useTheme } from "next-themes"

function UserExperienceSection() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [cardsToShow, setCardsToShow] = useState(3);
  const { theme } = useTheme();
  
  // User reviews data
  const reviews = [
    {
      id: 1,
      name: "Emma Thompson",
      location: "London, UK",
      avatar: "/images/avatar/avatar-1.webp",
      destination: "Maldives",
      rating: 5,
      shortReview: "The overwater bungalow exceeded all our expectations!",
      fullReview: "My husband and I spent our anniversary in the Maldives, and it was truly magical. The overwater bungalow exceeded all our expectations - waking up to that turquoise water every morning was surreal. The staff went above and beyond to make our stay special, from arranging a private dinner on the beach to surprising us with a sunset dolphin cruise. Worth every penny for a once-in-a-lifetime experience!",
      date: "March 2025",
      trip: "Honeymoon Package",
      destinationImages: [
        "/images/maldives-1.avif", 
        "/images/maldives-2.avif", 
        "/images/review_img/WhatsApp Video 2025-04-13 at 08.23.20_056dcc7c.mp4",
        "/images/review_img/WhatsApp Video 2025-04-13 at 08.23.23_23a320d2.mp4"
      ],
      duration: "7 nights",
      travelers: "2 adults",
      hotelName: "Conrad Maldives Rangali Island"
    },
    {
      id: 2,
      name: "James Wilson",
      location: "Sydney, Australia",
      avatar: "/images/avatar/avatar-3.webp",
      destination: "Santorini",
      rating: 5,
      shortReview: "Stunning views, incredible service, unforgettable memories.",
      fullReview: "Santorini has been on my bucket list for years, and this trip made all my dreams come true. We stayed in a cave house with a private infinity pool overlooking the caldera - the sunsets were absolutely spectacular. Our concierge arranged a private yacht tour around the volcanic islands, complete with fresh seafood and local wine. The whole experience was seamless from start to finish. Highly recommend the sunset dinner at Oia - it's touristy but absolutely worth it for those views!",
      date: "February 2025",
      trip: "Romantic Getaway",
      destinationImages: [
        "/images/review_img/Pasadia-en-ponton-Personas-divertiendose-vertical-.jpg", 
        "/images/santorini-2.jpeg", 
        "/images/santorini-3.jpeg"
      ],
      duration: "6 nights",
      travelers: "2 adults",
      hotelName: "Canaves Oia Suites"
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      location: "Miami, USA",
      avatar: "/images/avatar/avatar-2.webp",
      destination: "Bali",
      rating: 4,
      shortReview: "A beautiful cultural experience with amazing accommodations.",
      fullReview: "Bali was the perfect mix of relaxation and adventure. Our villa in Ubud had the most gorgeous view of the rice terraces, and we loved waking up to the sound of nature every morning. The highlight was definitely our private tour of the temples with a local guide who shared the history and cultural significance of each site. My only suggestion would be to spend more time in Ubud and less in the more touristy areas of Kuta. The spa treatments were heavenly - I had the best massage of my life!",
      date: "January 2025",
      trip: "Cultural Exploration",
      destinationImages: [
        "/images/review_img/DSC06534-3-scaled.jpg", 
        "/images/review_img/WhatsApp Video 2025-04-13 at 08.23.20_10a01871.mp4",
        "/images/bali-3.avif"
      ],
      duration: "8 nights",
      travelers: "1 adult",
      hotelName: "Four Seasons Resort Bali at Sayan"
    },
    {
      id: 4,
      name: "Michael Chen",
      location: "Toronto, Canada",
      avatar: "/images/avatar/avatar-4.jpeg",
      destination: "Medellín",
      rating: 5,
      shortReview: "Colombia surprised me in the best possible way!",
      fullReview: "I wasn't sure what to expect from Medellín, but it absolutely blew me away. The eternal spring climate was perfect, and our hotel in El Poblado was luxurious while still having authentic Colombian charm. The private tour of Comuna 13 with our guide Carlos was eye-opening and inspiring - seeing how the city has transformed is incredible. The food scene is amazing (try the bandeja paisa!), and the people are so welcoming. We felt safe the entire time and are already planning our next trip to explore more of Colombia!",
      date: "April 2025",
      trip: "City Exploration",
      destinationImages: [
        "/images/review_img/593025139.jpg", 
        "/images/review_img/WhatsApp Image 2025-04-13 at 8.22.49 AM.jpeg", 
        "/images/review_img/WhatsApp Image 2025-04-13 at 8.22.46 AM.jpeg"
      ],
      duration: "5 nights",
      travelers: "2 adults",
      hotelName: "The Charlee Lifestyle Hotel"
    },
    {
      id: 5,
      name: "Olivia Johnson",
      location: "Berlin, Germany",
      avatar: "/images/avatar/avatar-5.avif",
      destination: "Cartagena",
      rating: 5,
      shortReview: "The colonial charm and Caribbean vibes were magical.",
      fullReview: "Cartagena is like stepping into a colorful dream! The colonial architecture in the walled city is stunning, and our boutique hotel was right in the heart of it all. We loved exploring the narrow streets, shopping for local crafts, and enjoying the amazing seafood. The day trip to the Rosario Islands was a highlight - crystal clear water and white sand beaches. In the evenings, we took salsa lessons and enjoyed the vibrant nightlife. The perfect mix of culture, relaxation, and fun!",
      date: "March 2025",
      trip: "Historical Tour",
      destinationImages: [
        "/images/review_img/cartagena-flying-dress-03.png", 
        "public/images/review_img/WhatsApp Video 2025-04-13 at 08.23.22_25f5c34e.mp4",
        "/images/review_img/WhatsApp Image 2025-04-13 at 8.22.45 AM (1).jpeg", 
        "/images/review_img/WhatsApp Image 2025-04-13 at 8.22.45 AM.jpeg"
      ],
      duration: "6 nights",
      travelers: "1 adult",
      hotelName: "Hotel Casa San Agustín"
    },
    {
      id: 6,
      name: "David Patel",
      location: "Dubai, UAE",
      avatar: "/images/avatar/avatar-6.avif",
      destination: "San Andrés",
      rating: 4,
      shortReview: "A Caribbean paradise with the best snorkeling I've ever experienced.",
      fullReview: "San Andrés was the perfect escape from city life. The water is so clear and blue it looks unreal in photos. We stayed in an all-inclusive beachfront resort which I'd highly recommend for the convenience. The snorkeling at Johnny Cay was incredible - so many colorful fish and coral reefs! The island has a unique mix of Colombian and Caribbean culture that makes it special. My only complaint was that the airport was a bit chaotic, but once we got to our resort, everything was perfect. Don't miss trying the local seafood rondón dish!",
      date: "February 2025",
      trip: "Beach Vacation",
      destinationImages: [
        "/images/review_img/146.png", 
        "/images/review_img/WhatsApp Video 2025-04-13 at 08.23.24_c5fc1ee0.mp4", 
        "/images/review_img/WhatsApp Video 2025-04-13 at 08.23.28_1baadaee.mp4"
      ],
      duration: "5 nights",
      travelers: "2 adults, 1 child",
      hotelName: "Decameron Aquarium"
    }
  ];
  
  // Navigation functions
  const handleNavigation = (direction) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setStartIndex(prev => {
      if (direction === "next") {
        return prev >= reviews.length - cardsToShow ? 0 : prev + 1;
      } else {
        return prev <= 0 ? reviews.length - cardsToShow : prev - 1;
      }
    });
    
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  // Auto-rotate carousel
  useEffect(() => {
    if (showModal) return;
    const timer = setInterval(() => handleNavigation("next"), 6000);
    return () => clearInterval(timer);
  }, [showModal]);
  
  // Update cardsToShow based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get visible reviews
  const visibleReviews = Array.from({length: cardsToShow}, (_, i) => 
    reviews[(startIndex + i) % reviews.length]
  );
  
  // Components
  const ReviewCard = ({ review }) => (
    <div 
      onClick={() => {
        setSelectedReview(review);
        setActiveImageIndex(0);
        setShowModal(true);
      }}
      className={`
        w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
        transition-all duration-500 transform hover:-translate-y-2 cursor-pointer
        border border-blue-50 dark:border-blue-900/20 relative // <-- Add 'relative' here
        ${isTransitioning ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}
      `}
    >
 <div className="relative h-40 sm:h-48 w-full">
  <Image src={review.destinationImages[0]} alt={review.destination} fill className="object-cover" priority />
  <div className="absolute i bg-gray-50 dark:bg-gray-950"></div>
  
  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
      <div className="bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
      </div>
    </div>

    <div className="flex gap-1 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
      <div className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium inline-flex items-center shadow-md">
        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
        {review.destination}
      </div>
      <div className="px-2 py-1 bg-indigo-500 text-white rounded-full text-xs font-medium inline-flex shadow-md">
        {review.trip}
      </div>
    </div>
    <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg drop-shadow-md tracking-tight">{review.hotelName}</h4>
  </div>
</div>

<div className="p-3 sm:p-4 md:p-5">
  <div className="flex items-center justify-between mb-3 sm:mb-4">
    <div className="flex items-center">
      <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden mr-2 sm:mr-3 ring-2 ring-blue-200 dark:ring-blue-900 border-2 border-white dark:border-gray-800">
        <Image src={review.avatar} alt={review.name} fill className="object-cover" />
      </div>
      <div>
        <div className="flex items-center">
          <h4 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">{review.name}</h4>
          {/* Blue verification tick - now on the right side of name */}
          <div className="ml-1.5 bg-blue-500 rounded-full p-0.5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{review.location}</p>
      </div>
    </div>
    
    <div className="flex bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full shadow-sm">
      {/* 5 stars rating */}
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500 fill-yellow-500 mr-0.5 last:mr-0" />
        ))}
      </div>
    </div>
  </div>
  
  <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
    "{review.shortReview}"
  </p>
  
  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
        <span>{review.duration}</span>
      </div>
      <div className="flex items-center">
        <Users className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
        <span>{review.travelers}</span>
      </div>
    </div>
    <div className="flex ml-2">
      <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center text-xs hover:underline">
        Read more
        <ChevronRight className="h-3 w-3 ml-1" />
      </span>
    </div>
  </div>
</div>
</div>
  );

  // QuoteIcon component
  const QuoteIcon = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
  
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-2">
            TRAVELER STORIES
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Our Customers Love Us!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Discover authentic stories from travelers who experienced our premium destinations and services
          </p>
        </div>
        
{/* Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={() => handleNavigation("prev")}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 transform transition-all hover:scale-110"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
            
            {/* Right (Next) Button - Added this button */}
            <button 
              onClick={() => handleNavigation("next")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 transform transition-all hover:scale-110"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
          {/* Review Cards */}
          <div className="flex justify-center mb-6">
            
            <div className={`grid grid-cols-1 ${cardsToShow === 1 ? "" : cardsToShow === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"} gap-4 sm:gap-6`}>
              {visibleReviews.map(review => <ReviewCard key={review.id} review={review} />)}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center space-x-1.5">
            {reviews.slice(0, reviews.length - cardsToShow + 1).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setStartIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  startIndex === index
                    ? "w-6 bg-blue-600 dark:bg-blue-500" 
                    : "w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-800"
                }`}
                aria-label={`Go to review set ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
     {/* Modal */}
      {showModal && selectedReview && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 overflow-y-auto animate-fadeIn">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
           <div className="sticky top-0 z-10 flex justify-between items-center p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center">
               <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
               {selectedReview.destination} Experience
             </h3>
             <button 
               onClick={() => setShowModal(false)}
               className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
             >
               <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
             </button>
           </div>
           
           <div className="overflow-y-auto max-h-[calc(90vh-3rem)]">
             <div className="flex flex-col lg:flex-row">
               {/* Media Gallery */}
               <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-gray-700">
                 <div className="relative h-80 sm:h-96 lg:h-screen lg:max-h-[28rem] w-full">
                   {/* Check if current media is a video based on file extension */}
                   {selectedReview.destinationImages[activeImageIndex].includes('.mp4') ? (
                     <video
                       src={selectedReview.destinationImages[activeImageIndex]}
                       className="absolute inset-0 w-full h-full object-cover"
                       controls
                       autoPlay
                     />
                   ) : (
                     <Image
                       src={selectedReview.destinationImages[activeImageIndex]}
                       alt={selectedReview.destination}
                       fill
                       className="object-cover"
                     />
                   )}
                   
                   {/* Media navigation */}
                   {selectedReview.destinationImages.length > 1 && (
                     <>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveImageIndex(prev => prev === 0 ? selectedReview.destinationImages.length - 1 : prev - 1);
                         }}
                         className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white"
                       >
                         <ChevronLeft className="h-3 w-3" />
                       </button>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveImageIndex(prev => prev === selectedReview.destinationImages.length - 1 ? 0 : prev + 1);
                         }}
                         className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white"
                       >
                         <ChevronRight className="h-3 w-3" />
                       </button>
                     </>
                   )}
                   
                   <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-full text-xs font-medium shadow-lg flex items-center">
                     <MapPin className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                     {selectedReview.destination}
                   </div>
                   
                   {/* Media type indicator */}
                   <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white rounded-full text-xs font-medium">
                     {selectedReview.destinationImages[activeImageIndex].includes('.mp4') ? 'Video' : 'Image'} {activeImageIndex + 1}/{selectedReview.destinationImages.length}
                   </div>
                 </div>
                 
                 {/* Thumbnails */}
                 <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-900 justify-center overflow-x-auto min-h-16">
                   {selectedReview.destinationImages.map((media, idx) => (
                     <div 
                       key={idx} 
                       onClick={() => setActiveImageIndex(idx)}
                       className={`
                         relative h-24 w-36 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0
                         ${activeImageIndex === idx 
                           ? "border-blue-600 dark:border-blue-500 scale-105 shadow-md" 
                           : "border-gray-200 dark:border-gray-700 opacity-80 hover:opacity-100"}
                       `}
                     >
                       {media.includes('.mp4') ? (
                         <>
                           {/* Video thumbnail */}
                           <video 
                             src={media} 
                             className="object-cover w-full h-full"
                             preload="metadata"
                           />
                           {/* Video play icon overlay */}
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                             <div className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600 ml-0.5">
                                 <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                               </svg>
                             </div>
                           </div>
                         </>
                       ) : (
                         <Image src={media} alt={`${selectedReview.destination} ${idx+1}`} fill className="object-cover" />
                       )}
                     </div>
                   ))}
                 </div>
               </div>
          {/* Review Content */}
          <div className="w-full lg:w-1/2">
            <div className="p-3 sm:p-4">
              {/* User Info */}
              <div className="flex items-center mb-6 bg-gray-800/70 dark:bg-gray-800/80 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                      {/* Avatar Section */}
                      <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4 ring-4 ring-blue-300 dark:ring-blue-900 border-2 border-white dark:border-gray-800 transform transition-all hover:scale-110">
                        <Image 
                          src={selectedReview.avatar} 
                          alt={selectedReview.name} 
                          layout="intrinsic" 
                          width={56} 
                          height={56} 
                          className="object-cover" 
                        />
                      </div>
                      
                      {/* Review Content Section */}
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-100 dark:text-white">{selectedReview.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-400 dark:text-gray-500">{selectedReview.location}</span>
                            <span className="text-gray-400 dark:text-gray-600">•</span>
                            {/* Rating Stars */}
                            <div className="flex space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < selectedReview.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                                {/* Trip Details */}
              <div className="mb-4">
                <h4 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {selectedReview.hotelName}
                </h4>
                
                <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                  <div className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">
                    <Calendar className="h-3 w-3 mr-1" /><span>{selectedReview.date}</span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">
                    <Clock className="h-3 w-3 mr-1" /><span>{selectedReview.duration}</span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">
                    <Users className="h-3 w-3 mr-1" /><span>{selectedReview.travelers}</span>
                  </div>
                  <div className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium text-xs">
                    {selectedReview.trip}
                  </div>
                </div>
                
                {/* Testimonial - Fixed for dark mode */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg shadow-inner border border-gray-100 dark:border-gray-700 mb-3">
                  <div className="flex justify-centemb-2">
                    <QuoteIcon className="h-6 w-6 text-blue-400 dark:text-blue-600 opacity-70" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed italic text-xs sm:text-sm text-center">
                    {selectedReview.fullReview}
                  </p>
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
    </section>
  );
}

export default UserExperienceSection;