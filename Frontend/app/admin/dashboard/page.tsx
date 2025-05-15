"use client"
import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, Settings, Users, CreditCard, FileText, 
  Search, Filter, RefreshCw, Download, AlertTriangle
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback data in case the API fails
const fallbackData = {
  revenueData: [
    { name: 'Jan', amount: 125000 },
    { name: 'Feb', amount: 175000 },
    { name: 'Mar', amount: 225000 },
    { name: 'Apr', amount: 300000 },
    { name: 'May', amount: 375000 },
  ],
  userGrowthData: [
    { name: 'Jan', users: 1200 },
    { name: 'Feb', users: 1450 },
    { name: 'Mar', users: 1600 },
    { name: 'Apr', users: 1800 },
    { name: 'May', users: 2100 },
  ],
  bookingData: [
    { name: 'Mon', bookings: 45 },
    { name: 'Tue', bookings: 52 },
    { name: 'Wed', bookings: 49 },
    { name: 'Thu', bookings: 63 },
    { name: 'Fri', bookings: 75 },
    { name: 'Sat', bookings: 82 },
    { name: 'Sun', bookings: 70 },
  ],
  listings: [
    { id: 1, name: "Luxury Villa in Goa", status: "Active", views: 542, createdAt: "2025-04-15" },
    { id: 2, name: "Beachfront Apartment", status: "Pending", views: 321, createdAt: "2025-04-12" },
    { id: 3, name: "Mountain Retreat", status: "Active", views: 421, createdAt: "2025-04-10" },
    { id: 4, name: "City Center Loft", status: "Active", views: 289, createdAt: "2025-04-08" },
    { id: 5, name: "Riverside Cottage", status: "Inactive", views: 176, createdAt: "2025-04-05" },
  ],
  users: [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", status: "Active", joinDate: "2025-03-12" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", status: "Active", joinDate: "2025-03-15" },
    { id: 3, name: "Amit Singh", email: "amit@example.com", status: "Banned", joinDate: "2025-02-28" },
    { id: 4, name: "Sneha Gupta", email: "sneha@example.com", status: "Active", joinDate: "2025-04-05" },
    { id: 5, name: "Karan Malhotra", email: "karan@example.com", status: "Inactive", joinDate: "2025-03-22" },
  ],
  payouts: [
    { id: 1, host: "Vikram Mehta", amount: "₹24,500", status: "Processed", date: "2025-04-15" },
    { id: 2, host: "Neha Gupta", amount: "₹18,750", status: "Pending", date: "2025-04-16" },
    { id: 3, host: "Sunil Patel", amount: "₹32,000", status: "Processing", date: "2025-04-14" },
    { id: 4, host: "Meera Shah", amount: "₹15,800", status: "Processed", date: "2025-04-13" },
    { id: 5, host: "Arjun Nair", amount: "₹21,350", status: "Pending", date: "2025-04-16" },
  ],
  reports: [
    { id: 1, type: "Property Complaint", status: "New", priority: "High", date: "2025-04-15" },
    { id: 2, type: "Payment Issue", status: "In Progress", priority: "Medium", date: "2025-04-14" },
    { id: 3, type: "User Complaint", status: "Resolved", priority: "Low", date: "2025-04-12" },
    { id: 4, type: "Technical Issue", status: "New", priority: "High", date: "2025-04-15" },
    { id: 5, type: "Booking Dispute", status: "In Progress", priority: "Medium", date: "2025-04-13" },
  ],
  stats: {
    totalBookings: 1245,
    bookingGrowth: 12,
    revenue: 375000,
    revenueGrowth: 25,
    userGrowth: 8.5,
    newUsers: 245
  }
};

// API base URL
const API_URL = "https://yolo-matrix.onrender.com";

export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 5;

  // Fetch data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch different data types in parallel
      const [revenueRes, bookingsRes, usersRes, listingsRes, payoutsRes, reportsRes, statsRes] = await Promise.allSettled([
        fetch(`${API_URL}/dashboard/revenue`),
        fetch(`${API_URL}/dashboard/bookings`),
        fetch(`${API_URL}/dashboard/users`),
        fetch(`${API_URL}/dashboard/listings`),
        fetch(`${API_URL}/dashboard/payouts`),
        fetch(`${API_URL}/dashboard/reports`),
        fetch(`${API_URL}/dashboard/stats`)
      ]);
      
      // Process results and use fallbacks where needed
      const revenue = revenueRes.status === 'fulfilled' && revenueRes.value.ok ? await revenueRes.value.json() : fallbackData.revenueData;
      const bookings = bookingsRes.status === 'fulfilled' && bookingsRes.value.ok ? await bookingsRes.value.json() : fallbackData.bookingData;
      const users = usersRes.status === 'fulfilled' && usersRes.value.ok ? await usersRes.value.json() : fallbackData.users;
      const listings = listingsRes.status === 'fulfilled' && listingsRes.value.ok ? await listingsRes.value.json() : fallbackData.listings;
      const payouts = payoutsRes.status === 'fulfilled' && payoutsRes.value.ok ? await payoutsRes.value.json() : fallbackData.payouts;
      const reports = reportsRes.status === 'fulfilled' && reportsRes.value.ok ? await reportsRes.value.json() : fallbackData.reports;
      const stats = statsRes.status === 'fulfilled' && statsRes.value.ok ? await statsRes.value.json() : fallbackData.stats;
      
      setDashboardData({
        revenueData: revenue,
        bookingData: bookings,
        users,
        listings,
        payouts,
        reports,
        stats
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data. Using fallback data.");
      // Keep using fallback data which is already set initially
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh data handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData().finally(() => {
      setRefreshing(false);
    });
  };

  // Filter data based on search and status
  const filterData = (data, type) => {
    if (!data) return [];
    let filteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        if (type === "listings") {
          return item.name?.toLowerCase().includes(searchLower);
        } else if (type === "users") {
          return item.name?.toLowerCase().includes(searchLower) || 
                 item.email?.toLowerCase().includes(searchLower);
        } else if (type === "payouts") {
          return item.host?.toLowerCase().includes(searchLower);
        } else if (type === "reports") {
          return item.type?.toLowerCase().includes(searchLower);
        }
        return true;
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter(item => 
        item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    return filteredData;
  };

  // Get paginated data
  const getPaginatedData = (data, type) => {
    const filteredData = filterData(data, type);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Format currency
  const formatIndianCurrency = (value) => {
    return `₹${value?.toLocaleString('en-IN') || '0'}`;
  };

  // Status badge component
  const StatusBadge = ({ status, type }) => {
    let color = "bg-gray-100 text-gray-800";
    
    if (type === "status") {
      if (status === "Active") color = "bg-green-100 text-green-800";
      else if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
      else if (status === "Inactive" || status === "Banned") color = "bg-red-100 text-red-800";
      else if (status === "Processing") color = "bg-blue-100 text-blue-800";
      else if (status === "New") color = "bg-red-100 text-red-800";
      else if (status === "In Progress") color = "bg-blue-100 text-blue-800";
      else if (status === "Resolved") color = "bg-green-100 text-green-800";
    } else if (type === "priority") {
      if (status === "High") color = "bg-red-100 text-red-800";
      else if (status === "Medium") color = "bg-yellow-100 text-yellow-800";
      else if (status === "Low") color = "bg-green-100 text-green-800";
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {status}
      </span>
    );
  };

  // Loading skeleton component
  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );

  // Render a data table
  const DataTable = ({ data, columns, type }) => {
    if (!data || data.length === 0) {
      return <p className="text-center py-4">No data available</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getPaginatedData(data, type).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {col.render ? col.render(item) : item[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Table column definitions for each tab
  const listingsColumns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Property Name', render: item => (
      <span className="font-medium text-gray-900">{item.name}</span>
    )},
    { field: 'status', header: 'Status', render: item => (
      <StatusBadge status={item.status} type="status" />
    )},
    { field: 'views', header: 'Views' },
    { field: 'createdAt', header: 'Created' },
    { field: 'actions', header: 'Actions', render: () => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
      </div>
    )}
  ];

  const usersColumns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name', render: item => (
      <span className="font-medium text-gray-900">{item.name}</span>
    )},
    { field: 'email', header: 'Email' },
    { field: 'status', header: 'Status', render: item => (
      <StatusBadge status={item.status} type="status" />
    )},
    { field: 'joinDate', header: 'Join Date' },
    { field: 'actions', header: 'Actions', render: () => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm" className="text-red-600">Ban</Button>
      </div>
    )}
  ];

  const payoutsColumns = [
    { field: 'id', header: 'ID' },
    { field: 'host', header: 'Host', render: item => (
      <span className="font-medium text-gray-900">{item.host}</span>
    )},
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status', render: item => (
      <StatusBadge status={item.status} type="status" />
    )},
    { field: 'date', header: 'Date' },
    { field: 'actions', header: 'Actions', render: () => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm" className="text-green-600">Process</Button>
      </div>
    )}
  ];

  const reportsColumns = [
    { field: 'id', header: 'ID' },
    { field: 'type', header: 'Type', render: item => (
      <span className="font-medium text-gray-900">{item.type}</span>
    )},
    { field: 'status', header: 'Status', render: item => (
      <StatusBadge status={item.status} type="status" />
    )},
    { field: 'priority', header: 'Priority', render: item => (
      <StatusBadge status={item.priority} type="priority" />
    )},
    { field: 'date', header: 'Date' },
    { field: 'actions', header: 'Actions', render: () => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm" className="text-blue-600">Assign</Button>
      </div>
    )}
  ];

  const highPriorityReports = dashboardData.reports?.filter(report => 
    report.priority === "High" && report.status === "New"
  ) || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="default" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        </div>
      )}

      {/* Alert for high priority reports */}
      {highPriorityReports.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                You have {highPriorityReports.length} high priority report(s) that need your attention.
              </p>
              <Button variant="link" className="p-0 h-auto text-red-700 hover:text-red-900" onClick={() => setActiveTab("reports")}>
                View Reports
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </>
        ) : (
          <>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <h2 className="text-3xl font-bold mt-1">{dashboardData.stats?.totalBookings}</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> +{dashboardData.stats?.bookingGrowth}% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue (This Month)</p>
                    <h2 className="text-3xl font-bold mt-1">{formatIndianCurrency(dashboardData.stats?.revenue)}</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> +{dashboardData.stats?.revenueGrowth}% from last month
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V23" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User Growth</p>
                    <h2 className="text-3xl font-bold mt-1">+{dashboardData.stats?.userGrowth}%</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> {dashboardData.stats?.newUsers} new users
                    </p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-500">Quick Actions</p>
                    <div className="mt-3 space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Add New User
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Add New Listing
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </>
        ) : (
          <>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Revenue Trend (2025)</h3>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        dot={{ stroke: '#3B82F6', strokeWidth: 2, fill: '#FFF', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Weekly Bookings</h3>
                  <Select defaultValue="thisWeek">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.bookingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="bookings" 
                        fill="#8B5CF6" 
                        barSize={30}radius={4}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Data tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex flex-1 max-w-sm space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    {activeTab === "reports" && (
                      <>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button>
                {activeTab === "listings" ? "Add Property" : 
                 activeTab === "users" ? "Add User" : 
                 activeTab === "payouts" ? "Process All" : 
                 "Export Reports"}
              </Button>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : (
              <TabsContent value="listings">
                <DataTable 
                  data={dashboardData.listings} 
                  columns={listingsColumns} 
                  type="listings"
                />
              </TabsContent>
            )}

            <TabsContent value="users">
              {loading ? (
                <TableSkeleton />
              ) : (
                <DataTable 
                  data={dashboardData.users} 
                  columns={usersColumns} 
                  type="users"
                />
              )}
            </TabsContent>

            <TabsContent value="payouts">
              {loading ? (
                <TableSkeleton />
              ) : (
                <DataTable 
                  data={dashboardData.payouts} 
                  columns={payoutsColumns} 
                  type="payouts"
                />
              )}
            </TabsContent>

            <TabsContent value="reports">
              {loading ? (
                <TableSkeleton />
              ) : (
                <DataTable 
                  data={dashboardData.reports} 
                  columns={reportsColumns} 
                  type="reports"
                />
              )}
            </TabsContent>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {[...Array(3)].map((_, i) => {
                    const page = currentPage + i - (currentPage > 1 ? 1 : 0);
                    if (page > 0) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-6">
        <p>© 2025 YOLO Matrix Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}