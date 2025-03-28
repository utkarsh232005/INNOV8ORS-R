'use client';

import { Bell, Droplet, Heart, Users, LayoutDashboard, User, Settings, LogOut, UserCircle, Calendar, Edit, Mail, Phone, MapPin, Save, X, Shield, Clock, Laptop } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { userAPI } from '@/lib/api';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bloodType: '',
    isAvailable: true,
    phone: '',
    address: '',
    lastLoginTime: '',
    lastLoginDevice: '',
    loginCount: 0
  });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const userData = await userAPI.getProfile();
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            bloodType: userData.bloodType || '',
            isAvailable: userData.isAvailable !== undefined ? userData.isAvailable : true,
            phone: userData.phone || '',
            address: userData.address || '',
            lastLoginTime: userData.lastLoginTime || '',
            lastLoginDevice: userData.lastLoginDevice || '',
            loginCount: userData.loginCount || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setProfileData({
        ...profileData,
        [name]: checkbox.checked
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await userAPI.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bloodType: profileData.bloodType,
        isAvailable: profileData.isAvailable,
        phone: profileData.phone,
        address: profileData.address
      });
      
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

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

  // Parse device info
  const getDeviceInfo = () => {
    try {
      if (!profileData.lastLoginDevice) return null;
      
      const deviceInfo = JSON.parse(profileData.lastLoginDevice);
      return {
        browser: deviceInfo.browser || 'Unknown',
        os: deviceInfo.os || 'Unknown',
        device: deviceInfo.device || 'Unknown',
        time: deviceInfo.time ? new Date(deviceInfo.time).toLocaleString() : 'Unknown'
      };
    } catch (e) {
      return {
        browser: 'Unknown',
        os: 'Unknown',
        device: 'Unknown',
        time: 'Unknown'
      };
    }
  };
  
  const deviceInfo = getDeviceInfo();
  const formattedLastLogin = profileData.lastLoginTime ? 
    new Date(profileData.lastLoginTime).toLocaleString() : 'Never';

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
                  label: `${profileData.firstName} ${profileData.lastName}`,
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Your <span className="text-[#9C27B0]">Profile</span>
              </h2>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-transparent border border-[#9C27B0] text-[#9C27B0] py-2 px-4 rounded-md transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white py-2 px-4 rounded-md transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1">
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-[#9C27B0]/20 flex items-center justify-center mb-4">
                      <UserCircle className="h-16 w-16 text-[#9C27B0]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{profileData.firstName} {profileData.lastName}</h3>
                    <p className="text-gray-400 mt-1">{profileData.email}</p>
                    
                    <div className="mt-4 px-3 py-1 rounded-full bg-[#9C27B0]/20 text-[#9C27B0] text-sm font-medium">
                      {profileData.bloodType} Blood Type
                    </div>
                    
                    <div className="mt-4 w-full border-t border-[#333333] pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Donor Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          profileData.isAvailable
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {profileData.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Login Information */}
                <div className="mt-6 p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-[#9C27B0] mr-2" />
                    Login Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Last Login</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-[#9C27B0] mr-2" />
                        <p className="text-white">{formattedLastLogin}</p>
                      </div>
                    </div>
                    
                    {deviceInfo && (
                      <div>
                        <p className="text-gray-400 text-sm">Last Device</p>
                        <div className="flex items-center mt-1">
                          <Laptop className="h-4 w-4 text-[#9C27B0] mr-2" />
                          <p className="text-white">{deviceInfo.browser} on {deviceInfo.os} ({deviceInfo.device})</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-gray-400 text-sm">Login Count</p>
                      <div className="flex items-center mt-1">
                        <UserCircle className="h-4 w-4 text-[#9C27B0] mr-2" />
                        <p className="text-white">{profileData.loginCount} times</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="md:col-span-2">
                <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
                  <h3 className="text-xl font-semibold text-white mb-6">Profile Details</h3>
                  
                  {isEditing ? (
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                          <input 
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleChange}
                            className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9C27B0] focus:border-[#9C27B0]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                          <input 
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleChange}
                            className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9C27B0] focus:border-[#9C27B0]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input 
                          type="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-gray-500 focus:outline-none cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Blood Type</label>
                          <select
                            name="bloodType"
                            value={profileData.bloodType}
                            onChange={handleChange}
                            className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9C27B0] focus:border-[#9C27B0]"
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div className="flex items-center h-full pt-6">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="isAvailable"
                              checked={profileData.isAvailable}
                              onChange={(e) => setProfileData({
                                ...profileData,
                                isAvailable: e.target.checked
                              })}
                              className="sr-only"
                            />
                            <div className={`relative w-10 h-5 rounded-full transition-colors ${
                              profileData.isAvailable ? 'bg-[#9C27B0]' : 'bg-[#333333]'
                            }`}>
                              <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                profileData.isAvailable ? 'translate-x-5' : 'translate-x-0'
                              }`}></div>
                            </div>
                            <span className="ml-2 text-white">Available as Donor</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input 
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9C27B0] focus:border-[#9C27B0]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <textarea 
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-[#262626] border border-[#333333] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#9C27B0] focus:border-[#9C27B0]"
                        ></textarea>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">First Name</h4>
                          <p className="text-white mt-1">{profileData.firstName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">Last Name</h4>
                          <p className="text-white mt-1">{profileData.lastName}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Email Address</h4>
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 text-[#9C27B0] mr-2" />
                          <p className="text-white">{profileData.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">Blood Type</h4>
                          <div className="flex items-center mt-1">
                            <Droplet className="h-4 w-4 text-[#9C27B0] mr-2" />
                            <p className="text-white">{profileData.bloodType}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400">Donor Status</h4>
                          <div className="flex items-center mt-1">
                            <Heart className="h-4 w-4 text-[#9C27B0] mr-2" />
                            <p className="text-white">{profileData.isAvailable ? 'Available' : 'Unavailable'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Phone Number</h4>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 text-[#9C27B0] mr-2" />
                          <p className="text-white">{profileData.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Address</h4>
                        <div className="flex mt-1">
                          <MapPin className="h-4 w-4 text-[#9C27B0] mr-2 shrink-0 mt-0.5" />
                          <p className="text-white">{profileData.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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