// Base API URL
const API_BASE_URL = 'http://localhost:8082';

// Auth token management
const TOKEN_KEY = 'auth_token';

// Store auth token in localStorage
const storeToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Remove auth token from localStorage
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Add auth header to requests
const getAuthHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API request helper
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  requiresAuth: boolean = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(requiresAuth ? getAuthHeader() : {})
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
    mode: 'cors',
    credentials: 'omit'
  };

  try {
    const response = await fetch(url, options);
    
    // Handle unauthorized (token expired or invalid)
    if (response.status === 401 && requiresAuth) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized - Please log in again');
    }
    
    // Process response
    if (response.status === 204) {
      // No content
      return null;
    }
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      throw new Error(
        typeof responseData === 'object' && responseData.message 
          ? responseData.message 
          : `Request failed with status: ${response.status}`
      );
    }
    
    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    
    // Enhance error messages for network failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Server connection failed. Please ensure the backend server is running at ${API_BASE_URL}. Error: ${error.message}`);
    }
    
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  const token = getToken();
  return token ? apiRequest('/users/me') : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Authentication API
export const authAPI = {
  register: (userData: any) => 
    apiRequest('/auth/register', 'POST', userData, false),
  
  login: async (credentials: { email: string; password: string }) => {
    // Add device info to the login request
    const deviceInfo = {
      ...credentials,
      deviceInfo: getBrowserInfo()
    };
    
    const response = await apiRequest('/auth/login', 'POST', deviceInfo, false);
    if (response && response.token) {
      storeToken(response.token);
    }
    return response;
  },
  
  logout: () => {
    removeToken();
  }
};

// Helper function to get browser and device information
const getBrowserInfo = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  const userAgent = window.navigator.userAgent;
  const browserInfo = {
    userAgent,
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    device: detectDevice(userAgent),
    time: new Date().toISOString()
  };
  
  return JSON.stringify(browserInfo);
};

// Simple browser detection
const detectBrowser = (userAgent: string): string => {
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "Internet Explorer";
  return "Unknown";
};

// Simple OS detection
const detectOS = (userAgent: string): string => {
  if (userAgent.indexOf("Windows") > -1) return "Windows";
  if (userAgent.indexOf("Mac") > -1) return "MacOS";
  if (userAgent.indexOf("Linux") > -1) return "Linux";
  if (userAgent.indexOf("Android") > -1) return "Android";
  if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) return "iOS";
  return "Unknown";
};

// Simple device detection
const detectDevice = (userAgent: string): string => {
  if (userAgent.indexOf("Mobile") > -1) return "Mobile";
  if (userAgent.indexOf("Tablet") > -1) return "Tablet";
  return "Desktop";
};

// User API
export const userAPI = {
  getProfile: () => 
    apiRequest('/users/me'),
  
  getAllUsers: () => 
    apiRequest('/users/all'),
  
  getDonorsByBloodType: (bloodType: string) => 
    apiRequest(`/users/donors/${bloodType}`),
  
  updateProfile: (userData: any) =>
    apiRequest('/users/profile', 'PUT', userData)
};

// Blood Request API
export const bloodRequestAPI = {
  getAllRequests: () => 
    apiRequest('/requests'),
  
  createRequest: (requestData: any) => 
    apiRequest('/requests/create', 'POST', requestData),
  
  acceptRequest: (requestId: number, donorId: number) => 
    apiRequest(`/users/blood-request/${requestId}/accept/${donorId}`, 'POST'),
  
  getMyRequests: () =>
    apiRequest('/users/my-requests')
};

// Donation API
export const donationAPI = {
  // Get all available donations
  getAvailableDonations: () => 
    apiRequest('/donations/available'),
  
  // Get all donations (admin only)
  getAllDonations: () => 
    apiRequest('/donations'),
  
  // Get donations by blood type
  getDonationsByBloodType: (bloodType: string) => 
    apiRequest(`/donations/blood-type/${bloodType}`),
  
  // Get current user's donations (as donor)
  getMyDonations: () => 
    apiRequest('/donations/my-donations'),
  
  // Get current user's donation requests (as recipient)
  getMyRequests: () => 
    apiRequest('/donations/my-requests'),
  
  // Create a new donation listing
  createDonation: (donationData: any) => 
    apiRequest('/donations/create', 'POST', donationData),
  
  // Request a donation as a recipient
  requestDonation: (donationId: number) => 
    apiRequest(`/donations/${donationId}/request`, 'POST'),
  
  // Confirm a donation (donor confirms)
  confirmDonation: (donationId: number) => 
    apiRequest(`/donations/${donationId}/confirm`, 'POST'),
  
  // Cancel a donation request (recipient cancels)
  cancelRequest: (donationId: number) => 
    apiRequest(`/donations/${donationId}/cancel-request`, 'POST'),
  
  // Remove a donation listing (donor removes)
  removeDonation: (donationId: number) => 
    apiRequest(`/donations/${donationId}`, 'DELETE')
}; 