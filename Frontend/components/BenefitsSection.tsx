import { useEffect, useState, useRef } from "react";
import { Sparkles, Gift, Globe, CalendarClock, Headphones } from "lucide-react";
import { useTheme } from "next-themes";

const benefits = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Huge savings with every booking",
    description: "Unlock exclusive offers you won't find elsewhere."
  },
  {
    icon: <Gift className="h-5 w-5" />,
    title: "Bonus inclusions",
    description: "Curated experiences tailored just for you."
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Thousands of options",
    description: "Flights, hotels, tours, cruises and more."
  },
  {
    icon: <CalendarClock className="h-5 w-5" />,
    title: "Flexible booking",
    description: "Change plans with ease for peace of mind."
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: "24/7 Customer Service",
    description: "Our dedicated team is always ready to help."
  }
];

// Particle component for floating particles
const Particle = ({ index, isDarkMode }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${index * 0.2}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
  };
  
  return (
    <div 
      className={`absolute w-2 h-2 rounded-full animate-float ${
        isDarkMode ? 'bg-blue-400/30' : 'bg-blue-300/30'
      }`}
      style={style}
    />
  );
};

const BenefitsSection = () => {
  const [inView, setInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const playTimeoutRef = useRef(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    let lastScroll = window.scrollY;
    
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const video = videoRef.current;
      
      if (video) {
        // Check if we're scrolling and the section is in view
        if (currentScroll !== lastScroll && inView) {
          // Clear any existing timeout
          if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
          }

          // Start playing the video
          video.play();

          // Stop the video after 5 seconds
          playTimeoutRef.current = setTimeout(() => {
            video.pause();
          }, 5000);
        }

        // Restart video from beginning if we're at the end
        if (video.ended) {
          video.currentTime = 0;
        }
      }

      lastScroll = currentScroll;
    };

    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (sectionRef.current) {
      sectionRef.current.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
        sectionRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className={`py-8 md:py-10 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Video at the top of the section - Full Width */}
      <div className="mb-8">
        <div className="relative w-full h-72 md:h-64 lg:h-80">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/Video/bg-video.mp4"
            loop
            muted
            playsInline
          >
            Your browser does not support the video tag.
          </video>
          {/* Optional gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50" />
        </div>
      </div>

      {/* Background effects (now behind the content) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <Particle key={i} index={i} isDarkMode={isDarkMode} />
          ))}
        </div>

        {/* Dynamic Gradient Overlay */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDarkMode 
              ? "bg-gradient-to-br from-gray-900/40 via-transparent to-blue-900/40" 
              : "bg-gradient-to-br from-white/30 via-transparent to-blue-200/30"
          }`}
          style={{
            opacity: inView ? 0.3 : 0.2,
          }}
        />

        {/* Moving Gradient based on mouse position */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${
              isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'
            } 0%, transparent 50%)`,
          }}
        />

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-20 left-10 w-32 h-32 border-2 rounded-full ${
            isDarkMode ? 'border-blue-500' : 'border-blue-400'
          } animate-spin-slow`} />
          <div className={`absolute bottom-20 right-10 w-48 h-48 border-2 ${
            isDarkMode ? 'border-purple-500' : 'border-purple-400'
          } animate-pulse`} />
          <div className={`absolute top-1/2 left-1/3 w-24 h-24 border-2 rotate-45 ${
            isDarkMode ? 'border-cyan-400' : 'border-cyan-400'
          } animate-bounce-slow`} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          className={`text-center mb-6 transform transition-all duration-500 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            Experience Premium Service
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-3 rounded-full"></div>
          <p className={`text-sm md:text-base ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Enjoy exclusive benefits with every booking
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 ${
                isDarkMode 
                  ? "bg-gray-800/90 border border-gray-700 hover:bg-gray-800 hover:border-blue-500/30" 
                  : "bg-white border border-gray-100 shadow-sm hover:border-blue-400/30"
              } ${
                inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 75}ms`
              }}
            >
              <div className={`rounded-full p-2 inline-flex mb-3 transition-transform duration-300 group-hover:scale-110 ${
                isDarkMode 
                  ? "bg-blue-900/50 text-blue-300" 
                  : "bg-blue-50 text-blue-600"
              }`}>
                {benefit.icon}
              </div>
              <h3 className={`text-base font-semibold mb-1 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}>
                {benefit.title}
              </h3>
              <p className={`text-xs md:text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {benefit.description}
              </p>
              
              {/* Hover effect indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                isDarkMode ? "bg-blue-500/50" : "bg-blue-400/50"
              }`} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-10px) rotate(45deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BenefitsSection;