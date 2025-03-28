import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Users, Droplet } from 'lucide-react';

interface DonationScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DonationFormData) => void;
  initialData?: DonationFormData;
  isRescheduling?: boolean;
}

export interface DonationFormData {
  date: string;
  time: string;
  location: string;
  donationType: string;
  specialNotes: string;
}

export default function DonationScheduleModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isRescheduling = false 
}: DonationScheduleModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [donationType, setDonationType] = useState('whole_blood');
  const [specialNotes, setSpecialNotes] = useState('');

  // Set initial values if provided
  useEffect(() => {
    if (initialData && isOpen) {
      // Convert date from "Month Day, Year" to YYYY-MM-DD for the date input
      if (initialData.date) {
        try {
          const dateObj = new Date(initialData.date);
          if (!isNaN(dateObj.getTime())) {
            const formattedDate = dateObj.toISOString().split('T')[0];
            setDate(formattedDate);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          setDate('');
        }
      }
      
      setTime(initialData.time || '');
      setLocation(initialData.location || '');
      setDonationType(initialData.donationType || 'whole_blood');
      setSpecialNotes(initialData.specialNotes || '');
    } else if (isOpen && !isRescheduling) {
      // Reset form when opening for a new appointment
      setDate('');
      setTime('');
      setLocation('');
      setDonationType('whole_blood');
      setSpecialNotes('');
    }
  }, [initialData, isOpen, isRescheduling]);

  const donationTypes = [
    { id: 'whole_blood', label: 'Whole Blood', description: 'Standard donation (30-45 minutes)' },
    { id: 'platelets', label: 'Platelets', description: 'Longer process (2-3 hours)' },
    { id: 'plasma', label: 'Plasma', description: 'Medium length process (1-2 hours)' },
    { id: 'double_red', label: 'Double Red Cells', description: 'Two units of red cells (1-2 hours)' },
  ];

  const locations = [
    { id: 1, name: 'City Blood Bank', address: '123 Main St, Downtown', distance: '3.2 km' },
    { id: 2, name: 'Memorial Hospital Donation Center', address: '456 West Ave, Westside', distance: '7.5 km' },
    { id: 3, name: 'Community Blood Drive', address: '789 North Blvd, Northside', distance: '12.1 km' },
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      date,
      time,
      location,
      donationType,
      specialNotes
    });
    
    // Form will be reset by the useEffect when the modal closes
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-[#E1E8ED]">
          <h2 className="text-2xl font-bold text-[#2C3E50]">
            {isRescheduling ? 'Reschedule Appointment' : 'Schedule Blood Donation'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[#2C3E50] font-medium">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#1E88E5]" />
                  <span>Date</span>
                </div>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[#2C3E50] font-medium">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-[#1E88E5]" />
                  <span>Time</span>
                </div>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                />
              </label>
            </div>
          </div>
          
          {/* Location Selection */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="h-4 w-4 text-[#1E88E5]" />
                <span>Donation Center</span>
              </div>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              >
                <option value="" className="bg-[#F8FAFC]">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-[#F8FAFC]">
                    {loc.name} ({loc.distance})
                  </option>
                ))}
              </select>
            </label>
            
            {/* Display selected location details */}
            {location && (
              <div className="mt-2 p-3 bg-[#F8FAFC] rounded-md border border-[#E1E8ED]">
                <p className="text-[#2C3E50] font-medium">{location}</p>
                <p className="text-[#7F8C8D] text-sm">
                  {locations.find(loc => loc.name === location)?.address}
                </p>
              </div>
            )}
          </div>
          
          {/* Donation Type */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <Droplet className="h-4 w-4 text-[#1E88E5]" />
                <span>Donation Type</span>
              </div>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {donationTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setDonationType(type.id)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    donationType === type.id 
                      ? 'border-[#1E88E5] bg-[#1E88E5]/10' 
                      : 'border-[#E1E8ED] bg-[#F8FAFC] hover:border-[#1E88E5]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id={type.id}
                      name="donationType"
                      value={type.id}
                      checked={donationType === type.id}
                      onChange={() => setDonationType(type.id)}
                      className="text-[#1E88E5] focus:ring-0"
                    />
                    <label htmlFor={type.id} className="cursor-pointer flex-1">
                      <span className="block text-[#2C3E50]">{type.label}</span>
                      <span className="block text-[#7F8C8D] text-sm">{type.description}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Notes */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-[#1E88E5]" />
                <span>Special Notes (Optional)</span>
              </div>
              <textarea 
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Any health conditions, preferences, or other information we should know?"
                rows={3}
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
            </label>
          </div>
          
          {/* Footer with actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E1E8ED]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-[#E1E8ED] text-[#2C3E50] hover:bg-[#F8FAFC] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md transition-colors"
            >
              {isRescheduling ? 'Reschedule Appointment' : 'Schedule Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 