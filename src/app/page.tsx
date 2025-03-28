'use client';

import { useState, useEffect } from 'react';
import { Bell, Droplet, Heart, Users, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LampDemo } from '@/components/ui/lamp';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { error } = useAuth();
  const [serverError, setServerError] = useState(false);

  // Check for backend connection errors
  useEffect(() => {
    if (error && error.includes('Backend server connection failed')) {
      setServerError(true);
    }
  }, [error]);
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] backdrop-blur-lg border-b border-[#333333] fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Droplet className="h-8 w-8 text-[#9C27B0] animate-pulse" />
            <h1 className="text-2xl font-bold text-white">
              Blood<span className="text-[#9C27B0]">Connect</span>
            </h1>
          </div>
          <nav className="flex space-x-4">
            <Link 
              href="/auth/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-transparent border border-[#9C27B0] text-[#9C27B0] hover:bg-[#9C27B0]/10 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link 
              href="/auth/register"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#9C27B0] text-white hover:bg-[#7B1FA2] transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span>Sign Up</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Server Connection Error Alert */}
      {serverError && (
        <div className="fixed top-20 inset-x-0 mx-auto max-w-md z-50 p-4 bg-red-900/80 border border-red-700 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-200">Backend Server Connection Error</h3>
              <p className="text-red-300 text-sm mt-1">
                Unable to connect to the backend server. Please ensure the server is running or try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Lamp Effect */}
      <LampDemo />
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Why Choose <span className="text-[#9C27B0]">Blood</span>Connect?
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Join our mission to ensure blood availability for everyone in need
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-[#9C27B0]/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-[#9C27B0]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-time Matching
              </h3>
              <p className="text-gray-400">
                Instantly connect with compatible donors in your area when blood is needed.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-[#9C27B0]/20 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-[#9C27B0]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Emergency Alerts
              </h3>
              <p className="text-gray-400">
                Receive immediate notifications for urgent blood requirements in your vicinity.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-[#9C27B0]/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#9C27B0]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Community Impact
              </h3>
              <p className="text-gray-400">
                Join thousands of donors making a difference in their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
              <div className="flex flex-col items-center">
                <Heart className="h-8 w-8 text-[#9C27B0] mb-2" />
                <p className="text-gray-400 text-sm">Lives Saved</p>
                <p className="text-2xl font-bold text-white">5,678+</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-[#9C27B0] mb-2" />
                <p className="text-gray-400 text-sm">Active Donors</p>
                <p className="text-2xl font-bold text-white">1,234+</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
              <div className="flex flex-col items-center">
                <Bell className="h-8 w-8 text-[#9C27B0] mb-2" />
                <p className="text-gray-400 text-sm">Hospitals</p>
                <p className="text-2xl font-bold text-white">348+</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1E1E1E] border border-[#333333] shadow-sm">
              <div className="flex flex-col items-center">
                <Droplet className="h-8 w-8 text-[#9C27B0] mb-2" />
                <p className="text-gray-400 text-sm">Blood Units</p>
                <p className="text-2xl font-bold text-white">9,846+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Every donation counts. Join our community today and help save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-4 rounded-lg bg-[#9C27B0] text-white font-semibold hover:bg-[#7B1FA2] transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/about')}
              className="px-8 py-4 rounded-lg bg-transparent border border-[#9C27B0] text-white font-semibold hover:bg-[#9C27B0]/10 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}