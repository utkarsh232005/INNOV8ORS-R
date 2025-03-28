'use client';

import { useState, useEffect } from 'react';
import { Droplet, LogIn, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Watch for auth context errors and update UI
  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setAlertType('error');
      setErrorMessage(error);
    }
  }, [error]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await login(email, password);
      
      // Show success message
      setShowAlert(true);
      setAlertType('success');
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      // Error is already handled by the auth context and useEffect above
      console.error('Login error:', err);
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
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Welcome Back</h1>
            <p className="text-[#B0B0B0] mt-2">Sign in to your account</p>
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
                  <div className="flex-1">
                    <p className="font-medium">
                      {alertType === 'success' 
                        ? 'Login successful! Redirecting...' 
                        : errorMessage || 'Invalid credentials. Please try again.'}
                    </p>
                    {alertType === 'error' && errorMessage.includes('Backend server connection failed') && (
                      <p className="text-sm mt-1">
                        Check that the server is running at http://localhost:8082
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#E0E0E0]">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#007FFF] hover:text-[#0059B2]">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#0A1929] border border-[#255D9A] focus:border-[#007FFF] focus:ring-1 focus:ring-[#007FFF] rounded-md text-[#FFFFFF] placeholder-[#718096]"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#007FFF] bg-[#0A1929] border-[#255D9A] rounded focus:ring-[#007FFF]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#B0B0B0]">
                Remember me
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-[#B0B0B0]">Don't have an account?</span>
            <Link href="/auth/register" className="ml-1 text-[#007FFF] hover:text-[#0059B2]">
              Register now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}