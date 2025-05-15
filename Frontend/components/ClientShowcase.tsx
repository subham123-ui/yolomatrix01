"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

// Sample client data - replace with your actual clients
const clientsData = [
  { id: 1, name: "Company One", logo: "/images/clinet/logo-1-color.png" },
  { id: 2, name: "Company Two", logo: "/images/clinet/logo-2-color.png" },
  { id: 3, name: "Company Three", logo: "/images/clinet/logo-3-color.png" },
  { id: 4, name: "Company Four", logo: "/images/clinet/logo-4-color.png"},
  { id: 5, name: "Company Five", logo: "/images/clinet/logo-5-color.png" },
  { id: 6, name: "Company Six", logo: "/images/clinet/logo-6-color.png"},
];

export default function ClientShowcase() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Handle theme changes
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  // Create duplicate data for seamless infinite scroll
  const duplicatedClients = [...clientsData, ...clientsData];
  
  // Add custom CSS for the marquee animation with faster scroll speed
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-marquee {
        animation: scroll 15s linear infinite;
      }
      
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Our Trusted <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">Clients</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Partnering with industry leaders to deliver exceptional luxury experiences worldwide
          </p>
        </div>
        
        {/* Single row with continuous horizontal scrolling logos */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 w-48 md:w-64 mx-6 flex items-center justify-center"
              >
                <div className="h-24 md:h-28 w-48 md:w-56 relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md border-b-2 border-blue-900">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2 opacity-90 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/180/90";
                    }}
                    style={{
                      filter: "brightness(0.6) contrast(1.2) saturate(1.1) hue-rotate(210deg)"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}