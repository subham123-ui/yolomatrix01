"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Star, 
  Plus, 
  Edit2, 
  Trash, 
  Search,
  Upload,
  CheckCircle,
  XCircle,
  Flag,
  Download,
  Send,
  ChevronDown,
  Filter
} from "lucide-react";

// Mock data for demonstration
const MOCK_PROPERTIES = [
  { id: 1, name: "Luxury Mansion", beds: 4, baths: 3, status: "Available", address: "123 Palm St" },
  { id: 2, name: "Beach Villa", beds: 3, baths: 2, status: "Booked", address: "456 Ocean Blvd" },
  { id: 3, name: "Mountain Cabin", beds: 2, baths: 1, status: "Available", address: "789 Pine Ridge" },
  { id: 4, name: "Downtown Apartment", beds: 2, baths: 2, status: "Maintenance", address: "101 City Ave" },
  { id: 5, name: "Lake House", beds: 5, baths: 4, status: "Available", address: "222 Lakeview Dr" },
];

const MOCK_BOOKINGS = [
  { id: 1, user: "John Doe", property: "Luxury Mansion", dates: "May 15-18, 2025", nights: 3, status: "pending" },
  { id: 2, user: "Jane Smith", property: "Beach Villa", dates: "June 2-9, 2025", nights: 7, status: "pending" },
  { id: 3, user: "Robert Johnson", property: "Mountain Cabin", dates: "May 20-22, 2025", nights: 2, status: "pending" },
  { id: 4, user: "Emily Davis", property: "Lake House", dates: "July 1-8, 2025", nights: 7, status: "approved" },
];

const MOCK_MESSAGES = [
  { id: 1, user: "John Doe", message: "Can I visit the property?", time: "10:30 AM", conversation: [
    { sender: "admin", text: "How can I help you?", time: "10:25 AM" },
    { sender: "user", text: "Can I visit the property?", time: "10:30 AM" },
  ]},
  { id: 2, user: "Sarah Jones", message: "Is parking available?", time: "11:45 AM", conversation: [
    { sender: "admin", text: "Hello! How may I assist you today?", time: "11:40 AM" },
    { sender: "user", text: "Is parking available at the property?", time: "11:45 AM" },
  ]},
  { id: 3, user: "Michael Brown", message: "What's the check-in process?", time: "09:15 AM", conversation: [
    { sender: "admin", text: "Good morning! What can I do for you?", time: "09:10 AM" },
    { sender: "user", text: "What's the check-in process like?", time: "09:15 AM" },
  ]},
];

const MOCK_REVIEWS = [
  { id: 1, user: "Michael Brown", text: "The location was convenient, but the place needed some maintenance. The staff was responsive but slow to fix issues.", rating: 3, property: "Downtown Apartment" },
  { id: 2, user: "Lisa Wong", text: "Amazing view and facilities! We loved our stay and will definitely be back soon. The sunset views were incredible!", rating: 5, property: "Luxury Beachfront Villa" },
  { id: 3, user: "James Peterson", text: "Terrible service! The property was not as advertised and communication was poor.", rating: 1, property: "Mountain Cabin" },
  { id: 4, user: "Anna Martinez", text: "Clean, comfortable, and exactly as described. Great value for the price.", rating: 4, property: "Beach Villa" },
];

const MOCK_REPORTS = [
  { id: 1, name: "Booking Summary", date: "May 5, 2025", type: "PDF" },
  { id: 2, name: "Revenue Report", date: "May 3, 2025", type: "Excel" },
  { id: 3, name: "Occupancy Analysis", date: "April 30, 2025", type: "PDF" },
];

const SubAdminDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("Booking Summary");

  // Effects
  useEffect(() => {
    // Initialize the dashboard with the first chat selected
    if (messages.length > 0 && !selectedChat) {
      setSelectedChat(messages[0]);
    }
  }, [messages, selectedChat]);

  // Handlers
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const updatedMessages = messages.map(msg => {
      if (msg.id === selectedChat.id) {
        return {
          ...msg,
          conversation: [
            ...msg.conversation,
            { sender: "admin", text: messageInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    setSelectedChat(updatedMessages.find(msg => msg.id === selectedChat.id));
    setMessageInput("");
  };

  const handlePropertySearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveBooking = (id) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: "approved" } : booking
    );
    setBookings(updatedBookings);
  };

  const handleRejectBooking = (id) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: "rejected" } : booking
    );
    setBookings(updatedBookings);
  };

  const handleFlagReview = (id) => {
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, flagged: !review.flagged } : review
    );
    setReviews(updatedReviews);
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate) return;
    
    const newReport = {
      id: reports.length + 1,
      name: reportType,
      date: new Date().toLocaleDateString(),
      type: "PDF"
    };
    
    setReports([newReport, ...reports]);
  };

  const getStatusBadgeColor = (status) => {
    switch(status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "fill-current" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sub-Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Filter size={16} /> Filter
          </Button>
          <div className="relative">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              Admin <ChevronDown size={14} />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building size={16} /> Properties
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar size={16} /> Bookings
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle size={16} /> Messages
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText size={16} /> Reports
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star size={16} /> Reviews
          </TabsTrigger>
        </TabsList>

        {/* Property Management */}
        <TabsContent value="properties">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Property Listings</h2>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus size={16} /> Add New
                    </Button>
                    <div className="relative">
                      <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        placeholder="Search properties..." 
                        className="pl-8 max-w-xs"
                        value={searchTerm}
                        onChange={handlePropertySearch}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProperties.map(property => (
                    <div key={property.id} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium">{property.name}</h3>
                        <p className="text-sm text-gray-500">{property.beds} beds • {property.baths} baths • 
                          <span className={`inline-flex items-center px-2 py-0.5 ml-2 text-xs font-medium rounded-full ${getStatusBadgeColor(property.status)}`}>
                            {property.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">{property.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full flex items-center gap-2 justify-start">
                    <Upload size={16} /> Upload Property Media
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <FileText size={16} /> Property Analytics
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <Calendar size={16} /> View Calendar
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <MessageCircle size={16} /> Contact Owner
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Property Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded border border-blue-100">
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-lg font-bold">{properties.filter(p => p.status === "Available").length}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded border border-green-100">
                      <p className="text-sm text-gray-600">Booked</p>
                      <p className="text-lg font-bold">{properties.filter(p => p.status === "Booked").length}</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded border border-orange-100">
                      <p className="text-sm text-gray-600">Maintenance</p>
                      <p className="text-lg font-bold">{properties.filter(p => p.status === "Maintenance").length}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-100">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-lg font-bold">{properties.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Booking Oversight */}
        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Booking Requests</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Filter size={16} /> Filter
                  </Button>
                  <div className="relative">
                    <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input placeholder="Search bookings..." className="pl-8 max-w-xs" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{booking.property}</h3>
                      <p className="text-sm">Guest: {booking.user}</p>
                      <p className="text-sm text-gray-500">{booking.dates} • {booking.nights} nights</p>
                      <Badge 
                        className={`mt-1 ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveBooking(booking.id)}
                        >
                          <CheckCircle size={16} /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1 text-red-500"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          <XCircle size={16} /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messaging */}
        <TabsContent value="messages">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border rounded p-2">
                  <div className="relative mb-2">
                    <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input placeholder="Search conversations..." className="pl-8" />
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`p-2 border-b last:border-0 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === msg.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleChatSelect(msg)}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{msg.user}</p>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 border rounded p-3">
                  {selectedChat ? (
                    <>
                      <div className="border-b pb-2 mb-3">
                        <h3 className="font-medium">{selectedChat.user}</h3>
                      </div>
                      <div className="h-64 overflow-y-auto mb-3 p-2">
                        {selectedChat.conversation.map((message, idx) => (
                          <div 
                            key={idx} 
                            className={`mb-2 ${message.sender === 'admin' ? 'text-right' : ''}`}
                          >
                            <div 
                              className={`inline-block p-2 rounded-lg ${
                                message.sender === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Type your message..." 
                          rows={2} 
                          className="flex-grow"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        />
                        <Button className="self-end" onClick={handleSendMessage}>
                          <Send size={16} />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Select a conversation to start messaging
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-medium">Date Range</p>
                    <div className="flex gap-2">
                      <Input 
                        type="date" 
                        className="w-full" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input 
                        type="date" 
                        className="w-full" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Report Type</p>
                    <select 
                      className="w-full p-2 border rounded"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option>Booking Summary</option>
                      <option>Revenue Report</option>
                      <option>Occupancy Analysis</option>
                      <option>Guest Demographics</option>
                      <option>Property Performance</option>
                    </select>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Format</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">PDF</Button>
                      <Button size="sm" variant="outline" className="flex-1">Excel</Button>
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={!startDate || !endDate}
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {reports.map(report => (
                    <div key={report.id} className="p-2 border rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-500">Generated on {report.date}</p>
                        <Badge className="mt-1 bg-blue-100 text-blue-800">{report.type}</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download size={16} /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Review Moderation */}
        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Review Moderation</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input placeholder="Search reviews..." className="pl-8 max-w-xs" />
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.map(review => (
                  <div key={review.id} className={`p-3 border rounded ${review.flagged ? 'bg-red-50' : ''}`}>
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          {renderStarRating(review.rating)}
                        </div>
                        <p className="my-1">{review.text}</p>
                        <p className="text-sm text-gray-500">For: {review.property}</p>
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant={review.flagged ? "default" : "outline"} 
                          className={`flex items-center gap-1 ${review.flagged ? 'bg-red-600' : 'text-red-500'}`}
                          onClick={() => handleFlagReview(review.id)}
                        >
                          <Flag size={16} /> {review.flagged ? 'Flagged' : 'Flag'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubAdminDashboard;
