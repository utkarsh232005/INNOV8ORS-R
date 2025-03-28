'use client';

import { useState } from 'react';
import { Bell, Droplet, Heart, Users, LayoutDashboard, User, Settings, LogOut, UserCircle, MapPin, Calendar, Clock, Filter, Search, ChevronDown, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BloodRequest {
  id: string;
  bloodType: string;
  urgency: 'critical' | 'high' | 'medium' | 'standard';
  hospital: string;
  location: string;
  requiredBy: string;
  postedOn: string;
  distance: string;
  units: number;
}

export default function BloodRequestsPage() {
  const [open, setOpen] = useState(false);
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'nearby'
  
  // Sample blood requests data
  const bloodRequests: BloodRequest[] = [
    {
      id: 'req-001',
      bloodType: 'O+',
      urgency: 'critical',
      hospital: 'City General Hospital',
      location: 'Downtown, City Center',
      requiredBy: '24 hours',
      postedOn: '2 hours ago',
      distance: '3.2 miles',
      units: 3
    },
    {
      id: 'req-002',
      bloodType: 'AB-',
      urgency: 'high',
      hospital: 'Memorial Medical Center',
      location: 'Westside, Lincoln Road',
      requiredBy: '48 hours',
      postedOn: '6 hours ago',
      distance: '1.5 miles',
      units: 2
    },
    {
      id: 'req-003',
      bloodType: 'B+',
      urgency: 'medium',
      hospital: 'Northern Regional Hospital',
      location: 'Hillside, North Avenue',
      requiredBy: '72 hours',
      postedOn: '1 day ago',
      distance: '5.8 miles',
      units: 1
    },
    {
      id: 'req-004',
      bloodType: 'A+',
      urgency: 'standard',
      hospital: 'Children\'s Hospital',
      location: 'Riverside, South Street',
      requiredBy: '5 days',
      postedOn: '2 days ago',
      distance: '4.3 miles',
      units: 4
    },
    {
      id: 'req-005',
      bloodType: 'O-',
      urgency: 'critical',
      hospital: 'University Medical Center',
      location: 'College Area, University Blvd',
      requiredBy: '24 hours',
      postedOn: '3 hours ago',
      distance: '2.7 miles',
      units: 2
    },
  ];

  // Filter blood requests based on selected filters and search query
  const filteredRequests = bloodRequests.filter(request => {
    // Apply blood type filter
    if (bloodTypeFilter !== 'all' && request.bloodType !== bloodTypeFilter) {
      return false;
    }
    
    // Apply urgency filter
    if (urgencyFilter !== 'all' && request.urgency !== urgencyFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.hospital.toLowerCase().includes(query) ||
        request.location.toLowerCase().includes(query) ||
        request.bloodType.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort by urgency and distance if in nearby mode
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, standard: 3 };
    
    // First sort by urgency
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // If in nearby mode, also sort by distance
    if (viewMode === 'nearby') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    
    return 0;
  });

  const renderUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-semibold">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600 font-semibold">High</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600 font-semibold">Medium</span>;
      case 'standard':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-semibold">Standard</span>;
      default:
        return null;
    }
  };

  const handleResponseClick = (request: BloodRequest) => {
    alert(`You are responding to a request for ${request.bloodType} blood type at ${request.hospital}. Thank you for your help!`);
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#1E88E5]" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5 shrink-0 text-[#1E88E5]" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-[#1E88E5]" />,
    },
    {
      label: "Blood Requests",
      href: "/blood-requests",
      icon: <Droplet className="h-5 w-5 shrink-0 text-[#1E88E5]" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <LogOut className="h-5 w-5 shrink-0 text-[#1E88E5]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#2C3E50]">
      <div className="flex h-screen">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "John Doe",
                  href: "/profile",
                  icon: (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-[#1E88E5]/30 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-[#1E88E5]" />
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#2C3E50]">
                Blood <span className="text-[#1E88E5]">Requests</span>
              </h2>
              <p className="mt-2 text-[#7F8C8D]">Find and respond to blood donation requests in your area</p>
            </div>
            
            {/* Emergency Alert */}
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-600">Emergency Blood Shortage</h3>
                <p className="text-sm text-red-700">There is a critical shortage of O- blood type in your area. If you are eligible to donate, please consider responding to these requests urgently.</p>
              </div>
            </div>
            
            {/* Filters and Search */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Blood Type Filter */}
                <div className="relative">
                  <select 
                    value={bloodTypeFilter}
                    onChange={(e) => setBloodTypeFilter(e.target.value)}
                    className="appearance-none pl-8 pr-10 py-2 bg-white border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                  >
                    <option value="all">All Blood Types</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <Droplet className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1E88E5]" />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7F8C8D]" />
                </div>
                
                {/* Urgency Filter */}
                <div className="relative">
                  <select 
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                    className="appearance-none pl-8 pr-10 py-2 bg-white border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                  >
                    <option value="all">All Urgency Levels</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="standard">Standard</option>
                  </select>
                  <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1E88E5]" />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7F8C8D]" />
                </div>
                
                {/* View Toggle */}
                <div className="flex rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewMode('all')}
                    className={`px-4 py-2 text-sm font-medium ${viewMode === 'all' ? 
                      'bg-[#1E88E5] text-white' : 
                      'bg-white text-[#2C3E50] border border-[#E1E8ED] hover:bg-[#F8FAFC]'}`}
                  >
                    All Requests
                  </button>
                  <button 
                    onClick={() => setViewMode('nearby')}
                    className={`px-4 py-2 text-sm font-medium ${viewMode === 'nearby' ? 
                      'bg-[#1E88E5] text-white' : 
                      'bg-white text-[#2C3E50] border border-[#E1E8ED] hover:bg-[#F8FAFC]'}`}
                  >
                    Nearby First
                  </button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search hospital or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-[#E1E8ED] rounded-md text-[#2C3E50] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7F8C8D]" />
              </div>
            </div>
            
            {/* Requests List */}
            <div className="space-y-4">
              {sortedRequests.length > 0 ? (
                sortedRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-[#E1E8ED] rounded-lg p-4 shadow-sm">
                    <div className="flex flex-wrap gap-4 items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-[#1E88E5]">{request.bloodType}</span>
                          {renderUrgencyBadge(request.urgency)}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[#2C3E50]">{request.hospital}</h3>
                        <div className="mt-1 flex items-center text-[#7F8C8D]">
                          <MapPin className="h-4 w-4 mr-1 text-[#7F8C8D]" />
                          <span className="text-sm">{request.location} • {request.distance}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <button 
                          onClick={() => handleResponseClick(request)}
                          className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md flex items-center"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Respond
                        </button>
                        <div className="mt-2 text-sm text-[#7F8C8D]">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{request.units} units needed</span>
                          </span>
                          <span className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" /> 
                            <span>Required by: {request.requiredBy}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-[#E1E8ED] flex justify-between items-center">
                      <span className="text-xs text-[#7F8C8D]">Posted {request.postedOn}</span>
                      <button className="text-xs text-[#1E88E5] hover:underline flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        More Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white border border-[#E1E8ED] rounded-lg">
                  <Filter className="h-12 w-12 mx-auto text-[#7F8C8D] mb-3" />
                  <h3 className="text-lg font-semibold text-[#2C3E50]">No matching requests found</h3>
                  <p className="text-[#7F8C8D] mt-1">Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-[#2C3E50]"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#1E88E5]" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-[#2C3E50]"
      >
        BloodConnect
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-[#2C3E50]"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#1E88E5]" />
    </Link>
  );
}; 