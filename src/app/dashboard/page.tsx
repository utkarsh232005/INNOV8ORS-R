'use client';

import { Bell, Droplet, Heart, Users, LayoutDashboard, User, Settings, LogOut, UserCircle, Calendar, AlertCircle, Clock, Phone, Mail, Info, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import DonationScheduleModal, { DonationFormData } from '@/components/DonationScheduleModal';
import UserTypeSelector from '@/components/UserTypeSelector';
import DonationListingForm, { DonationListingData } from '@/components/DonationListingForm';
import DonationsList from '@/components/DonationsList';
import { donationAPI, userAPI } from '@/lib/api';
import { Toaster } from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [userType, setUserType] = useState<'donor' | 'recipient'>('donor');
  const [donations, setDonations] = useState<DonationListingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'emergency', message: 'Urgent need for O- blood type in City Hospital', time: '10 min ago' },
    { id: 2, type: 'appointment', message: 'Your donation appointment is confirmed', time: '1 hour ago' },
    { id: 3, type: 'update', message: 'Blood inventory update: A+ type is low', time: '3 hours ago' }
  ]);

  // Load donations from backend API
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        let donationData;
        
        if (userType === 'donor') {
          // Fetch donor's own donations
          donationData = await donationAPI.getMyDonations();
        } else {
          // Fetch available donations for recipients
          donationData = await donationAPI.getAvailableDonations();
        }
        
        // Transform API data to match our frontend model
        const transformedDonations = donationData.map((donation: any) => ({
          id: `donation-${donation.id}`,
          donorName: donation.donor?.firstName + ' ' + donation.donor?.lastName || 'Anonymous',
          bloodType: donation.bloodType,
          contactNumber: donation.contactNumber,
          availability: donation.availability,
          location: donation.location,
          additionalInfo: donation.additionalInfo || '',
          listedOn: new Date(donation.listedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: donation.status.toLowerCase()
        }));
        
        setDonations(transformedDonations);
      } catch (error) {
        console.error('Error fetching donations:', error);
        // Fallback to localStorage if API fails
        const savedDonations = localStorage.getItem('bloodconnect_donations');
        if (savedDonations) {
          setDonations(JSON.parse(savedDonations));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [userType]);

  // Save donations to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bloodconnect_donations', JSON.stringify(donations));
  }, [donations]);

  interface Appointment {
    id: number;
    date: string;
    time: string;
    location: string;
    status: 'confirmed' | 'pending';
  }

  // Load appointments from localStorage if available
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    const savedAppointments = localStorage.getItem('bloodconnect_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save appointments to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bloodconnect_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#9C27B0]" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5 shrink-0 text-[#9C27B0]" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-[#9C27B0]" />,
    },
    {
      label: "Blood Requests",
      href: "/blood-requests",
      icon: <Droplet className="h-5 w-5 shrink-0 text-[#9C27B0]" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <LogOut className="h-5 w-5 shrink-0 text-[#9C27B0]" />,
    },
  ];

  // Function handlers for button clicks
  const handleScheduleDonation = () => {
    setAppointmentToReschedule(null);
    setShowDonationModal(true);
  };

  const handleUpdateProfile = () => {
    router.push('/profile');
  };

  const handleViewBloodRequests = () => {
    router.push('/blood-requests');
  };

  const handleDonateNow = () => {
    setAppointmentToReschedule(null);
    setShowDonationModal(true);
  };

  const handleRescheduleAppointment = (appointment?: Appointment) => {
    if (appointment) {
      setAppointmentToReschedule(appointment);
      setShowDonationModal(true);
    } else if (appointments.length > 0) {
      setAppointmentToReschedule(appointments[0]);
      setShowDonationModal(true);
    } else {
      alert('No appointments to reschedule. Please schedule a donation first.');
    }
  };

  const handleViewBloodBanks = () => {
    alert('Showing nearby blood banks...');
    // In a real app, this would navigate to a page showing nearby blood banks
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear all donation data? This action cannot be undone.')) {
      localStorage.removeItem('bloodconnect_donations');
      localStorage.removeItem('bloodconnect_appointments');
      setDonations([]);
      setAppointments([]);
      alert('All donation data has been cleared.');
    }
  };

  const handleDonationSubmit = (data: DonationFormData) => {
    console.log('Donation scheduled:', data);
    
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    if (appointmentToReschedule) {
      // Update existing appointment
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentToReschedule.id 
            ? { 
                ...apt, 
                date: formattedDate, 
                time: data.time, 
                location: data.location 
              } 
            : apt
        )
      );
      alert(`Appointment rescheduled!\nDate: ${formattedDate}\nTime: ${data.time}\nLocation: ${data.location}`);
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now(),
        date: formattedDate,
        time: data.time,
        location: data.location,
        status: 'pending'
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      alert(`Donation scheduled!\nDate: ${formattedDate}\nTime: ${data.time}\nLocation: ${data.location}`);
    }
    
    setAppointmentToReschedule(null);
  };

  const handleListDonation = () => {
    setShowListingModal(true);
  };

  const handleListingSubmit = async (donationData: DonationListingData) => {
    setDonations([donationData, ...donations]);
    localStorage.setItem('bloodconnect_donations', JSON.stringify([donationData, ...donations]));
  };

  const handleDonationStatusChange = async (donationId: string, newStatus: 'available' | 'pending' | 'completed') => {
    try {
      const id = donationId.split('-')[1]; // Extract numeric ID
      
      if (newStatus === 'completed') {
        await donationAPI.confirmDonation(Number(id));
      } else if (newStatus === 'available' && userType === 'recipient') {
        await donationAPI.cancelRequest(Number(id));
      }
      
      // Update local state
      setDonations(donations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: newStatus } 
          : donation
      ));
      
      // Update localStorage for fallback
      localStorage.setItem('bloodconnect_donations', JSON.stringify(
        donations.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: newStatus } 
            : donation
        )
      ));
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const handleRequestDonation = async (donationId: string) => {
    try {
      const id = donationId.split('-')[1]; // Extract numeric ID
      await donationAPI.requestDonation(Number(id));
      
      // Update local state
      setDonations(donations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: 'pending' } 
          : donation
      ));
      
      // Update localStorage for fallback
      localStorage.setItem('bloodconnect_donations', JSON.stringify(
        donations.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'pending' } 
            : donation
        )
      ));
    } catch (error) {
      console.error('Error requesting donation:', error);
    }
  };

  // Filter donations based on user type
  const userDonations = userType === 'donor' 
    ? donations 
    : donations.filter(donation => donation.status === 'available');

  // Calculate donation stats
  const donorStats = {
    totalDonations: donations.filter(d => d.status === 'completed').length,
    listedDonations: donations.filter(d => d.status === 'available').length
  };
  
  const recipientStats = {
    totalReceived: donations.filter(d => d.status === 'completed').length,
    availableDonors: donations.filter(d => d.status === 'available').length
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
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
                    <div className="h-7 w-7 shrink-0 rounded-full bg-[#9C27B0]/30 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-[#9C27B0]" />
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Welcome to Your <span className="text-[#9C27B0]">Dashboard</span>
              </h2>
              
              {/* Notification Bell */}
              <div className="relative">
                <Bell className="h-6 w-6 text-[#9C27B0] cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-[#9C27B0] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              </div>
            </div>

            {/* User Type Selector */}
            <UserTypeSelector userType={userType} setUserType={setUserType} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-[#9C27B0]" />
                  <div>
                    <p className="text-gray-400 text-sm">
                      {userType === 'donor' ? 'Total Donations' : 'Total Received'}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {userType === 'donor' 
                        ? donorStats.totalDonations
                        : recipientStats.totalReceived}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-[#9C27B0]" />
                  <div>
                    <p className="text-gray-400 text-sm">Lives Impacted</p>
                    <p className="text-2xl font-bold text-white">
                      {donorStats.totalDonations * 3 || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-[#9C27B0]" />
                  <div>
                    <p className="text-gray-400 text-sm">Next Appointment</p>
                    <p className="text-2xl font-bold text-white">
                      {appointments.length > 0 ? appointments[0].date : "None"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-[#9C27B0]" />
                  <div>
                    <p className="text-gray-400 text-sm">
                      {userType === 'donor' 
                        ? 'Listed Donations' 
                        : 'Available Donors'}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {userType === 'donor'
                        ? donorStats.listedDonations
                        : recipientStats.availableDonors}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donations Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {userType === 'donor' ? 'Your Listed Donations' : 'Available Donations'}
                </h3>
                
                {userType === 'donor' && (
                  <button 
                    onClick={handleListDonation}
                    className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white py-2 px-4 rounded-md transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    List Donation
                  </button>
                )}
              </div>
              
              <DonationsList 
                donations={userDonations} 
                userType={userType}
                onStatusChange={handleDonationStatusChange}
                onRequestDonation={handleRequestDonation}
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Call-to-Action Buttons */}
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={userType === 'donor' ? handleScheduleDonation : handleRequestDonation.bind(null, donations.find(d => d.status === 'available')?.id || '')}
                      className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{userType === 'donor' ? 'Schedule Donation' : 'Find Donors'}</span>
                    </button>
                    <button 
                      onClick={handleUpdateProfile}
                      className="bg-transparent border border-[#9C27B0] text-[#9C27B0] hover:bg-[#9C27B0]/10 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Update Profile</span>
                    </button>
                    <button 
                      onClick={handleViewBloodRequests}
                      className="bg-transparent border border-[#9C27B0] text-[#9C27B0] hover:bg-[#9C27B0]/10 py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                      <Droplet className="h-5 w-5" />
                      <span>View Blood Requests</span>
                    </button>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h3>
                  <div className="space-y-4">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start space-x-4 p-4 rounded-md bg-[#262626] border border-[#333333]">
                          <div className="flex-shrink-0 p-2 bg-[#9C27B0]/20 rounded-md">
                            <Calendar className="h-5 w-5 text-[#9C27B0]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{appointment.date}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{appointment.location}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                            <button 
                              onClick={() => handleRescheduleAppointment(appointment)}
                              className="flex items-center text-xs text-[#9C27B0] hover:underline"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 bg-[#262626] border border-[#333333] rounded-md">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-semibold text-white">No upcoming appointments</h3>
                        <p className="text-gray-400 mt-1">
                          {userType === 'donor' 
                            ? 'Schedule a donation to get started' 
                            : 'Request a donation when you need blood'}
                        </p>
                      </div>
                    )}
                    {appointments.length > 0 && (
                      <button className="w-full mt-2 bg-transparent border border-[#333333] text-white hover:bg-[#262626] py-2 rounded-md transition-colors">
                        View All Appointments
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Real-Time Notifications */}
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-4 p-4 rounded-md bg-[#262626] border border-[#333333]">
                        <div className={`flex-shrink-0 p-2 rounded-md ${
                          notification.type === 'emergency' 
                            ? 'bg-red-900' 
                            : notification.type === 'appointment' 
                              ? 'bg-blue-900' 
                              : 'bg-gray-800'
                        }`}>
                          {notification.type === 'emergency' ? (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          ) : notification.type === 'appointment' ? (
                            <Calendar className="h-5 w-5 text-blue-400" />
                          ) : (
                            <Info className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-2 bg-transparent border border-[#333333] text-white hover:bg-[#262626] py-2 rounded-md transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Direct Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={userType === 'donor' ? handleDonateNow : handleRequestDonation.bind(null, donations.find(d => d.status === 'available')?.id || '')}
                      className="w-full bg-[#9C27B0] hover:bg-[#7B1FA2] text-white py-3 rounded-md transition-colors">
                      {userType === 'donor' ? 'Donate Now' : 'Request Blood'}
                    </button>
                    <button 
                      onClick={() => handleRescheduleAppointment()}
                      className="w-full bg-transparent border border-[#9C27B0] text-[#9C27B0] hover:bg-[#9C27B0]/10 py-3 rounded-md transition-colors">
                      {userType === 'donor' ? 'Reschedule Appointment' : 'View Request Status'}
                    </button>
                    <button 
                      onClick={handleViewBloodBanks}
                      className="w-full bg-transparent border border-[#333333] text-white hover:bg-[#262626] py-3 rounded-md transition-colors">
                      View Blood Banks
                    </button>
                    <button 
                      onClick={handleResetData}
                      className="w-full bg-transparent border border-red-900 text-red-400 hover:bg-red-900/10 py-3 rounded-md transition-colors">
                      Reset Donation Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Donation Schedule Modal */}
      <DonationScheduleModal 
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setAppointmentToReschedule(null);
        }}
        onSubmit={handleDonationSubmit}
        initialData={appointmentToReschedule ? {
          date: appointmentToReschedule.date,
          time: appointmentToReschedule.time,
          location: appointmentToReschedule.location,
          donationType: 'whole_blood',
          specialNotes: ''
        } : undefined}
        isRescheduling={!!appointmentToReschedule}
      />

      {/* Donation Listing Modal */}
      <DonationListingForm
        isOpen={showListingModal}
        onClose={() => setShowListingModal(false)}
        onSubmit={handleListingSubmit}
      />
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#9C27B0]" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#9C27B0]" />
    </Link>
  );
};