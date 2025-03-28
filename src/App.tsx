import React, { useState } from 'react';
import { Bell, Droplet, Heart, Search, Users } from 'lucide-react';
import Image from 'next/image';

type BloodRequest = {
  id: string;
  bloodType: string;
  location: string;
  urgency: 'normal' | 'emergency';
  timestamp: string;
};

function App() {
  const [activeTab, setActiveTab] = useState<'donate' | 'request'>('donate');
  
  const emergencyRequests: BloodRequest[] = [
    {
      id: '1',
      bloodType: 'A+',
      location: 'Central Hospital',
      urgency: 'emergency',
      timestamp: '10 minutes ago'
    },
    {
      id: '2',
      bloodType: 'O-',
      location: 'City Medical Center',
      urgency: 'emergency',
      timestamp: '15 minutes ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Droplet className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">BloodConnect</h1>
          </div>
          <nav className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Bell className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alerts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="font-bold text-red-600">{request.bloodType}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.location}</p>
                      <p className="text-sm text-gray-500">{request.timestamp}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('donate')}
                className={`${
                  activeTab === 'donate'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                Donate Blood
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`${
                  activeTab === 'request'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                Request Blood
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'donate' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6 flex items-center space-x-4">
                    <Users className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Active Donors</h3>
                      <p className="text-2xl font-bold text-red-600">1,234</p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6 flex items-center space-x-4">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Lives Saved</h3>
                      <p className="text-2xl font-bold text-red-600">5,678</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors">
                  Register as Donor
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by location or blood type..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors">
                  Submit Blood Request
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-lg overflow-hidden shadow-md relative h-64">
          <Image
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80"
            alt="Blood donation center"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;