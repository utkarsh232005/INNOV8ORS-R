'use client';

import { Bell, Droplet, Heart, Users, LayoutDashboard, User, Settings, LogOut, UserCircle, Calendar, Lock, Globe, Eye, EyeOff, Volume2, VolumeX, Save, Download, Trash2, Shield, Mail, Phone, RefreshCcw, Languages, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UserProfile {
  email: string;
  phone: string;
  language: string;
  firstName: string;
  lastName: string;
  bloodType: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [donationReminders, setDonationReminders] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [locationSharing, setLocationSharing] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showDonationHistory, setShowDonationHistory] = useState(true);
  
  // Account settings
  const [profile, setProfile] = useState<UserProfile>({
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    firstName: 'John',
    lastName: 'Doe',
    bloodType: 'O+'
  });
  
  // Security settings
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-15'
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('bloodconnect_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Notification settings
        if (parsedSettings.notifications) {
          setEmailNotifications(parsedSettings.notifications.email);
          setSmsNotifications(parsedSettings.notifications.sms);
          setEmergencyAlerts(parsedSettings.notifications.emergency);
          setAppointmentReminders(parsedSettings.notifications.appointments);
          setDonationReminders(parsedSettings.notifications.donations);
          setAppNotifications(parsedSettings.notifications.app);
        }
        
        // Privacy settings
        if (parsedSettings.privacy) {
          setProfileVisibility(parsedSettings.privacy.profileVisibility);
          setLocationSharing(parsedSettings.privacy.locationSharing);
          setShowContactInfo(parsedSettings.privacy.showContactInfo);
          setShowDonationHistory(parsedSettings.privacy.showDonationHistory);
        }
        
        // Profile settings
        if (parsedSettings.profile) {
          setProfile(parsedSettings.profile);
        }
        
        // Security settings
        if (parsedSettings.security) {
          setSecurity(parsedSettings.security);
        }
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

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

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(prev => !prev);
    };
  };

  const handleProfileVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileVisibility(e.target.value);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const submitPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate password
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // In a real app, you would call an API to change the password
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    
    // Update last password change date
    setSecurity(prev => ({
      ...prev,
      lastPasswordChange: new Date().toISOString().split('T')[0]
    }));
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const toggleTwoFactor = () => {
    setSecurity(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    
    alert(security.twoFactorEnabled ? 
      'Two-factor authentication disabled.' : 
      'Two-factor authentication enabled.'
    );
  };
  
  const exportUserData = () => {
    setExportingData(true);
    
    // In a real app, you would call an API to generate the export
    setTimeout(() => {
      setExportingData(false);
      
      // Create a downloadable object with the user's data
      const userData = {
        profile,
        notifications: {
          email: emailNotifications,
          sms: smsNotifications,
          emergency: emergencyAlerts,
          appointments: appointmentReminders,
          donations: donationReminders,
          app: appNotifications
        },
        privacy: {
          profileVisibility,
          locationSharing,
          showContactInfo,
          showDonationHistory
        },
        security: {
          twoFactorEnabled: security.twoFactorEnabled,
          lastPasswordChange: security.lastPasswordChange
        }
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "bloodconnect_user_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }, 1500);
  };
  
  const deleteAccount = () => {
    // In a real app, you would call an API to delete the account
    alert('Account deletion initiated. You will receive a confirmation email.');
    setShowDeleteModal(false);
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  // Save Settings function
  const saveSettings = () => {
    // Gather all settings into a single object
    const allSettings = {
      notifications: {
        email: emailNotifications,
        sms: smsNotifications,
        emergency: emergencyAlerts,
        appointments: appointmentReminders,
        donations: donationReminders,
        app: appNotifications
      },
      privacy: {
        profileVisibility,
        locationSharing,
        showContactInfo,
        showDonationHistory
      },
      profile,
      security
    };
    
    // Save to localStorage (in a real app, you'd save to a database via API)
    localStorage.setItem('bloodconnect_settings', JSON.stringify(allSettings));
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#2C3E50]">
                Your <span className="text-[#1E88E5]">Settings</span>
              </h2>
              
              {/* Save button */}
              <button 
                onClick={saveSettings}
                className={`flex items-center px-4 py-2 rounded-md text-white transition-colors ${
                  saveSuccess ? 'bg-green-500' : 'bg-[#1E88E5] hover:bg-[#1976D2]'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Settings Navigation */}
              <div className="col-span-1">
                <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm sticky top-8">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Settings Menu</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        activeTab === 'notifications' 
                          ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-medium' 
                          : 'hover:bg-[#F8FAFC] text-[#2C3E50]'
                      }`}
                    >
                      <Bell className={`h-5 w-5 ${activeTab === 'notifications' ? 'text-[#1E88E5]' : 'text-[#7F8C8D]'}`} />
                      <span>Notification Preferences</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('account')}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        activeTab === 'account' 
                          ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-medium' 
                          : 'hover:bg-[#F8FAFC] text-[#2C3E50]'
                      }`}
                    >
                      <User className={`h-5 w-5 ${activeTab === 'account' ? 'text-[#1E88E5]' : 'text-[#7F8C8D]'}`} />
                      <span>Account Settings</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('privacy')}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        activeTab === 'privacy' 
                          ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-medium' 
                          : 'hover:bg-[#F8FAFC] text-[#2C3E50]'
                      }`}
                    >
                      <Shield className={`h-5 w-5 ${activeTab === 'privacy' ? 'text-[#1E88E5]' : 'text-[#7F8C8D]'}`} />
                      <span>Privacy Controls</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('security')}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        activeTab === 'security' 
                          ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-medium' 
                          : 'hover:bg-[#F8FAFC] text-[#2C3E50]'
                      }`}
                    >
                      <Lock className={`h-5 w-5 ${activeTab === 'security' ? 'text-[#1E88E5]' : 'text-[#7F8C8D]'}`} />
                      <span>Security</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('data')}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        activeTab === 'data' 
                          ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-medium' 
                          : 'hover:bg-[#F8FAFC] text-[#2C3E50]'
                      }`}
                    >
                      <Download className={`h-5 w-5 ${activeTab === 'data' ? 'text-[#1E88E5]' : 'text-[#7F8C8D]'}`} />
                      <span>Data Management</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Settings Content */}
              <div className="col-span-3 space-y-6">
                {/* Notification Preferences */}
                {activeTab === 'notifications' && (
                  <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Email Notifications</span>
                            <p className="text-[#7F8C8D] text-sm">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emailNotifications}
                            onChange={handleToggle(setEmailNotifications)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${emailNotifications ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">SMS Notifications</span>
                            <p className="text-[#7F8C8D] text-sm">Receive updates via text message</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={smsNotifications}
                            onChange={handleToggle(setSmsNotifications)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${smsNotifications ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">App Notifications</span>
                            <p className="text-[#7F8C8D] text-sm">Receive in-app notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={appNotifications}
                            onChange={handleToggle(setAppNotifications)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${appNotifications ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Heart className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Emergency Blood Alerts</span>
                            <p className="text-[#7F8C8D] text-sm">Urgent notifications for blood needs</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emergencyAlerts}
                            onChange={handleToggle(setEmergencyAlerts)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${emergencyAlerts ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Appointment Reminders</span>
                            <p className="text-[#7F8C8D] text-sm">Get reminded about upcoming appointments</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={appointmentReminders}
                            onChange={handleToggle(setAppointmentReminders)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${appointmentReminders ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Droplet className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Donation Reminders</span>
                            <p className="text-[#7F8C8D] text-sm">Get reminded when you're eligible to donate again</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={donationReminders}
                            onChange={handleToggle(setDonationReminders)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${donationReminders ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[#7F8C8D]">First Name</label>
                          <input 
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-[#7F8C8D]">Last Name</label>
                          <input 
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[#7F8C8D]">Email Address</label>
                        <input 
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[#7F8C8D]">Phone Number</label>
                        <input 
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[#7F8C8D]">Blood Type</label>
                          <select 
                            name="bloodType"
                            value={profile.bloodType}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                          >
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
                        
                        <div className="space-y-2">
                          <label className="block text-[#7F8C8D]">Language Preference</label>
                          <select 
                            name="language"
                            value={profile.language}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => setShowPasswordModal(true)}
                          className="bg-[#1E88E5] hover:bg-[#1976D2] text-white py-2 px-4 rounded-md flex items-center space-x-2"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Change Password</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Controls */}
                {activeTab === 'privacy' && (
                  <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Privacy Controls</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <p className="text-[#2C3E50] font-medium mb-3">Profile Visibility</p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="public" 
                              name="visibility"
                              value="public"
                              checked={profileVisibility === 'public'}
                              onChange={handleProfileVisibilityChange}
                              className="text-[#1E88E5] focus:ring-0"
                            />
                            <label htmlFor="public" className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-[#1E88E5]" />
                              <div>
                                <span className="text-[#2C3E50]">Public</span>
                                <p className="text-[#7F8C8D] text-sm">Anyone can view your profile</p>
                              </div>
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="donors-only" 
                              name="visibility"
                              value="donors-only"
                              checked={profileVisibility === 'donors-only'}
                              onChange={handleProfileVisibilityChange}
                              className="text-[#1E88E5] focus:ring-0"
                            />
                            <label htmlFor="donors-only" className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-[#1E88E5]" />
                              <div>
                                <span className="text-[#2C3E50]">Donors Only</span>
                                <p className="text-[#7F8C8D] text-sm">Only verified donors can view your profile</p>
                              </div>
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="private" 
                              name="visibility"
                              value="private"
                              checked={profileVisibility === 'private'}
                              onChange={handleProfileVisibilityChange}
                              className="text-[#1E88E5] focus:ring-0"
                            />
                            <label htmlFor="private" className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-[#1E88E5]" />
                              <div>
                                <span className="text-[#2C3E50]">Private</span>
                                <p className="text-[#7F8C8D] text-sm">Only you can view your profile</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Location Sharing</span>
                            <p className="text-[#7F8C8D] text-sm">Allow sharing your approximate location</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={locationSharing}
                            onChange={handleToggle(setLocationSharing)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${locationSharing ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Show Contact Information</span>
                            <p className="text-[#7F8C8D] text-sm">Allow others to see your contact details</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showContactInfo}
                            onChange={handleToggle(setShowContactInfo)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${showContactInfo ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex items-center space-x-3">
                          <Droplet className="h-5 w-5 text-[#1E88E5]" />
                          <div>
                            <span className="text-[#2C3E50] font-medium">Show Donation History</span>
                            <p className="text-[#7F8C8D] text-sm">Allow others to see your donation history</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showDonationHistory}
                            onChange={handleToggle(setShowDonationHistory)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-[#E1E8ED] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${showDonationHistory ? 'bg-[#1E88E5]' : ''}`}></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2C3E50] font-medium">Password</p>
                            <p className="text-[#7F8C8D] text-sm">Last changed: {security.lastPasswordChange}</p>
                          </div>
                          <button 
                            onClick={() => setShowPasswordModal(true)}
                            className="px-3 py-1 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md text-sm flex items-center space-x-1"
                          >
                            <RefreshCcw className="h-3 w-3" />
                            <span>Change</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2C3E50] font-medium">Two-Factor Authentication</p>
                            <p className="text-[#7F8C8D] text-sm">
                              {security.twoFactorEnabled 
                                ? 'Enabled - Your account is more secure' 
                                : 'Disabled - Enable for additional security'}
                            </p>
                          </div>
                          <button 
                            onClick={toggleTwoFactor}
                            className={`px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${
                              security.twoFactorEnabled 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-[#1E88E5] hover:bg-[#1976D2] text-white'
                            }`}
                          >
                            {security.twoFactorEnabled ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Disable</span>
                              </>
                            ) : (
                              <>
                                <Shield className="h-3 w-3" />
                                <span>Enable</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2C3E50] font-medium">Account Deletion</p>
                            <p className="text-[#7F8C8D] text-sm">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Management */}
                {activeTab === 'data' && (
                  <div className="p-6 rounded-lg bg-white border border-[#E1E8ED] shadow-sm">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2C3E50] font-medium">Export Your Data</p>
                            <p className="text-[#7F8C8D] text-sm">Download a copy of your personal data</p>
                          </div>
                          <button 
                            onClick={exportUserData}
                            className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md flex items-center space-x-2"
                            disabled={exportingData}
                          >
                            {exportingData ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                <span>Export Data</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-[#E1E8ED] rounded-md bg-[#F8FAFC]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2C3E50] font-medium">Delete Your Data</p>
                            <p className="text-[#7F8C8D] text-sm">Permanently remove all your personal data</p>
                          </div>
                          <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Data</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-[#E1E8ED]">
              <h3 className="text-xl font-semibold text-[#2C3E50]">Change Password</h3>
            </div>
            <form onSubmit={submitPasswordChange} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-[#7F8C8D]">Current Password</label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[#7F8C8D]">New Password</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[#7F8C8D]">Confirm New Password</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </div>
              
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-transparent border border-[#E1E8ED] text-[#2C3E50] hover:bg-[#F8FAFC] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-[#E1E8ED]">
              <h3 className="text-xl font-semibold text-red-500">Delete Account</h3>
            </div>
            <div className="p-4">
              <div className="text-[#2C3E50]">
                <p className="mb-2">Are you sure you want to delete your account? This action cannot be undone.</p>
                <p className="mb-2">All your personal data, donation history, and account information will be permanently deleted.</p>
                <p>If you proceed, you will receive a confirmation email with further instructions.</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-transparent border border-[#E1E8ED] text-[#2C3E50] hover:bg-[#F8FAFC] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteAccount}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Logo />
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