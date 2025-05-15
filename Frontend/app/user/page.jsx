"use client"

import { useState } from "react";
import { 
  Calendar, CreditCard, Heart, User, LifeBuoy, Star, Bell, ChevronRight,
  Package, Clock, CheckCircle, XCircle, Download, Settings, LogOut, Home,
  Menu, X, Phone, Tag, RefreshCcw
} from "lucide-react";

// Navigation options and mock data consolidated
const data = {
  nav: [
    { id: "bookings", label: "My Bookings", icon: <Calendar size={20} /> },
    { id: "payments", label: "Payment History", icon: <CreditCard size={20} /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "support", label: "Support", icon: <LifeBuoy size={20} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
  ],
  bookings: [
    { id: 1, title: "Elite Escape", location: "Maldives", status: "upcoming", date: "May 15 - May 18, 2025", price: "$12,500", image: "/images/santorini-2.jpeg" },
    { id: 2, title: "Luxury Trio", location: "French Riviera", status: "active", date: "Current Stay: Until May 13, 2025", price: "$18,000", image: "/images/Cartagena/Cartagena-2.avif" },
    { id: 3, title: "Yacht & Mansion", location: "Amalfi Coast", status: "completed", date: "April 10 - April 14, 2025", price: "$25,000", image: "/images/yachts.webp" }
  ],
  payments: [
    { id: 101, title: "Elite Escape", date: "April 28, 2025", amount: "$12,500", status: "paid", invoice: "INV-28042025" },
    { id: 102, title: "Luxury Trio", date: "April 15, 2025", amount: "$18,000", status: "paid", invoice: "INV-15042025" },
    { id: 103, title: "Yacht & Mansion", date: "March 25, 2025", amount: "$25,000", status: "paid", invoice: "INV-25032025" }
  ],
  wishlist: [
    { id: 201, title: "Royal Experience", location: "Dubai", price: "$30,000", image: "/images/santorini-1.webp" },
    { id: 202, title: "Island Paradise", location: "Bora Bora", price: "$22,000", image: "/images/Car_img/car_img3.webp" },
    { id: 203, title: "Mountain Retreat", location: "Swiss Alps", price: "$15,000", image: "/images/Guatapé/Guatapé-2.jpeg" }
  ],
  reviews: [
    { id: 301, title: "Yacht & Mansion", date: "April 15, 2025", rating: 5, comment: "Exceptional service and stunning locations." },
    { id: 302, title: "Luxury Trio", date: "March 18, 2025", rating: 4, comment: "Amazing experience overall, though the concierge service could be more attentive." }
  ],
  notifications: [
    { id: 401, type: "info", message: "Your Elite Escape booking is confirmed!", date: "2 days ago", read: false },
    { id: 402, type: "promo", message: "Exclusive 15% discount on your next luxury booking!", date: "1 week ago", read: true },
    { id: 403, type: "update", message: "Your Luxury Trio booking details have been updated", date: "2 weeks ago", read: true }
  ]
};

// Component for status badges used in multiple places
const StatusBadge = ({ status }) => {
  const styles = {
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    active: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    paid: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  };
  
  const icons = {
    upcoming: <Clock size={14} />, active: <CheckCircle size={14} />, 
    completed: <CheckCircle size={14} />, cancelled: <XCircle size={14} />,
    paid: <CheckCircle size={14} />
  };
  
  return (
    <span className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Star rating component
const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} 
        fill={i < rating ? "#fbbf24" : "none"} 
        color={i < rating ? "#fbbf24" : "#d1d5db"} 
      />
    ))}
  </div>
);

// Empty state component to reduce repetition
const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <Icon size={48} className="mx-auto text-indigo-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{message}</p>
  </div>
);

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [activeStatus, setActiveStatus] = useState("all");
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  // Helper text mapping for tab descriptions
  const tabDescriptions = {
    bookings: "Manage your luxury experiences",
    payments: "View your payment history and receipts",
    wishlist: "Your saved luxury experiences",
    profile: "Update your personal information",
    support: "Get help from our concierge team",
    reviews: "Manage your ratings and reviews",
    notifications: "Stay updated with your bookings and offers"
  };
  
  // Filter bookings by status
  const filteredBookings = activeStatus === "all" 
    ? data.bookings 
    : data.bookings.filter(booking => booking.status === activeStatus);

  // Content rendering based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <div className="space-y-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["all", "upcoming", "active", "completed"].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeStatus === status
                      ? "bg-indigo-600 text-white dark:bg-indigo-700"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            
            {filteredBookings.length === 0 ? (
              <EmptyState 
                icon={Package} 
                title="No bookings found" 
                message={`You don't have any ${activeStatus !== "all" ? activeStatus : ""} bookings yet.`} 
              />
            ) : (
              filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                    <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">{booking.title}</h3>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="text-indigo-800 dark:text-indigo-200 mb-4">{booking.location}</p>
                      <p className="text-gray-600 dark:text-gray-300">{booking.date}</p>
                      <p className="font-bold text-indigo-900 dark:text-indigo-100 mt-2">{booking.price}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 text-sm">
                        View Details <ChevronRight size={16} />
                      </button>
                      
                      {booking.status === "upcoming" && (
                        <button className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm">
                          Cancel Booking
                        </button>
                      )}
                      
                      {booking.status === "completed" && (
                        <button className="px-4 py-2 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex items-center gap-1 text-sm">
                          <Star size={16} /> Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
        
      case "payments":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-indigo-600 dark:text-indigo-400 font-medium">{payment.invoice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{payment.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 ml-auto">
                          <Download size={16} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case "wishlist":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.wishlist.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative h-48">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md">
                    <Heart size={20} fill="#ec4899" color="#ec4899" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-1">{item.title}</h3>
                  <p className="text-indigo-800 dark:text-indigo-200 mb-3">{item.location}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-indigo-900 dark:text-indigo-100">{item.price}</p>
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold mb-4">
                    JD
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">John Doe</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 mb-4">Premium Member</p>
                  
                  <div className="w-full mt-4 space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                      <Settings size={18} /> Account Settings
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-2 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <h3 className="text-xl font-semibold mb-6 text-indigo-900 dark:text-indigo-100">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: "First Name", value: "John", type: "text" },
                    { label: "Last Name", value: "Doe", type: "text" },
                    { label: "Email", value: "john.doe@example.com", type: "email" },
                    { label: "Phone", value: "+1 (555) 123-4567", type: "tel" }
                  ].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">{field.label}</label>
                      <input 
                        type={field.type} 
                        value={field.value}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        readOnly
                      />
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-100">Documents</h3>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-dashed border-indigo-300 dark:border-indigo-700 mb-6">
                  <p className="text-center text-indigo-600 dark:text-indigo-300 mb-2">Upload your identification documents for verification</p>
                  <button className="w-full py-2 border border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/50">
                    Upload Document
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "reviews":
        return (
          <div className="space-y-6">
            {data.reviews.length === 0 ? (
              <EmptyState icon={Star} title="No reviews yet" message="You haven't left any reviews yet." />
            ) : (
              data.reviews.map(review => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-1">{review.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{review.date}</p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm">
                      Edit Review
                    </button>
                    <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
        
      case "support":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-6 text-indigo-900 dark:text-indigo-100">Contact Support</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {[
                { 
                  icon: <LifeBuoy size={36} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />,
                  title: "24/7 Support",
                  desc: "Our concierge team is available around the clock for any assistance",
                  btn: "Live Chat"
                },
                {
                  icon: <Phone size={36} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />,
                  title: "Call Us",
                  desc: "Speak directly with our luxury concierge team",
                  btn: "+1 (888) 123-4567"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 text-center">
                  {item.icon}
                  <h4 className="text-lg font-semibold mb-2 text-indigo-900 dark:text-indigo-100">{item.title}</h4>
                  <p className="text-indigo-800 dark:text-indigo-200 mb-4">{item.desc}</p>
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
            
            <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100">Send a Message</h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Subject</label>
                <input type="text" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Message</label>
                <textarea rows="5" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        );
        
      case "notifications":
        return (
          <div className="space-y-4">
            {data.notifications.length === 0 ? (
              <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
            ) : (
              data.notifications.map(notification => (
                <div key={notification.id} className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${!notification.read ? 'border-indigo-300 dark:border-indigo-700' : 'border-gray-100 dark:border-gray-700'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' :
                      notification.type === 'promo' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
                    }`}>
                      {notification.type === 'info' ? <Bell size={20} /> :
                       notification.type === 'promo' ? <Tag size={20} /> :
                       <RefreshCcw size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className={`${!notification.read ? 'font-semibold' : ''} text-indigo-900 dark:text-indigo-100`}>
                        {notification.message}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{notification.date}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2"></div>}
                  </div>
                </div>
              ))
            )}
          </div>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 text-indigo-900 dark:text-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-100">
          Customer Portal
        </h1>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm"
          onClick={() => setShowMobileNav(!showMobileNav)}
        >
          {showMobileNav ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation - hidden on mobile unless toggled */}
        <aside className={`${showMobileNav ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm opacity-80">Premium Member</p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              {data.nav.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setActiveTab(option.id);
                    setShowMobileNav(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left mb-1 ${
                    activeTab === option.id
                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {option.id === "notifications" && data.notifications.some(n => !n.read) && (
                    <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {data.notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              ))}
              </nav>
            
            <div className="p-4 mt-2 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {data.nav.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {tabDescriptions[activeTab]}
                </p>
              </div>
              
              <div className="hidden sm:flex items-center gap-2">
                <button className="p-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg">
                  <Home size={20} />
                </button>
                <div className="text-gray-400 dark:text-gray-500">
                  /
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  {data.nav.find(tab => tab.id === activeTab)?.label}
                </span>
              </div>
            </div>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
}