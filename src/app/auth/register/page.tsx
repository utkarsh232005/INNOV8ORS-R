'use client';

import { useState } from 'react';
import { Droplet, UserPlus, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Register() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Prepare user data for registration
    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      bloodType: formData.get('bloodType') as string,
      role: 'DONOR' // Default role
    };
    
    try {
      await register(userData);
      
      // Show success message
      setShowAlert(true);
      setAlertType('success');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      // Show error message
      setShowAlert(true);
      setAlertType('error');
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-[#E0E0E0] flex flex-col">
      {/* Header */}
      <header className="bg-[#132F4C] shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-[#FFFFFF]">
            <Droplet className="h-6 w-6 text-[#007FFF]" />
            <span className="text-xl font-semibold">BloodConnect</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center space-x-1 text-[#B0B0B0] hover:text-[#FFFFFF] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-lg bg-[#132F4C] border border-[#255D9A] shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Create Account</h1>
            <p className="text-[#B0B0B0] mt-2">Join our blood donation community</p>
          </div>
          
          {/* Alert section */}
          {showAlert && (
            <div className="mb-6">
              <div className={`rounded-lg p-4 border ${
                alertType === 'success' 
                  ? 'bg-green-900/20 border-green-500 text-green-400' 
                  : 'bg-[#B71C1C]/20 border-[#B71C1C] text-[#EF5350]'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>
                    {alertType === 'success' 
                      ? 'Registration successful! Redirecting to login...' 
                      : errorMessage || 'Registration failed. Please try again.'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-[#E0E0E0]">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF] placeholder-[#718096]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-[#E0E0E0]">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last Name"
                  className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF] placeholder-[#718096]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#E0E0E0]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF] placeholder-[#718096]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#E0E0E0]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF] placeholder-[#718096]"
              />
              <p className="text-xs text-[#B0B0B0]">Must be at least 8 characters</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bloodType" className="block text-sm font-medium text-[#E0E0E0]">
                Blood Type
              </label>
              <select
                id="bloodType"
                name="bloodType"
                required
                className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF]"
              >
                <option value="" disabled>Select your blood type</option>
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
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#007FFF] bg-[#0A1929] border-[#255D9A] rounded focus:ring-[#007FFF]"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#B0B0B0]">
                I agree to the <Link href="/terms" className="text-[#007FFF] hover:text-[#0059B2]">Terms of Service</Link> and <Link href="/privacy" className="text-[#007FFF] hover:text-[#0059B2]">Privacy Policy</Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-[#007FFF] hover:bg-[#0059B2] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-[#B0B0B0]">Already have an account?</span>
            <Link href="/auth/login" className="ml-1 text-[#007FFF] hover:text-[#0059B2]">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}