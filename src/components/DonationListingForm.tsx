import { useState } from 'react';
import { Calendar, Clock, MapPin, X, Droplet, User, Phone, FileText } from 'lucide-react';
import { donationAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface DonationListingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DonationListingData) => void;
}

export interface DonationListingData {
  id: string;
  donorName: string;
  bloodType: string;
  contactNumber: string;
  availability: string;
  location: string;
  additionalInfo: string;
  listedOn: string;
  status: 'available' | 'pending' | 'completed';
}

export default function DonationListingForm({ isOpen, onClose, onSubmit }: DonationListingFormProps) {
  const [donorName, setDonorName] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create data to send to API
      const donationData = {
        bloodType,
        contactNumber,
        availability,
        location, 
        additionalInfo
      };
      
      // Submit to API
      const response = await donationAPI.createDonation(donationData);
      
      // Create local display data for UI
      const newDonation: DonationListingData = {
        id: `donation-${response.id || Date.now()}`,
        donorName,
        bloodType,
        contactNumber,
        availability,
        location,
        additionalInfo,
        listedOn: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        status: 'available'
      };
      
      // Notify success
      toast.success('Donation listed successfully!');
      
      onSubmit(newDonation);
      
      // Reset form
      setDonorName('');
      setBloodType('');
      setContactNumber('');
      setAvailability('');
      setLocation('');
      setAdditionalInfo('');
      
      onClose();
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to list donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-[#E1E8ED]">
          <h2 className="text-2xl font-bold text-[#2C3E50]">List Your Blood Donation</h2>
          <button 
            onClick={onClose}
            className="text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Donor Name */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-[#1E88E5]" />
                <span>Your Name</span>
              </div>
              <input 
                type="text" 
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
            </label>
          </div>
          
          {/* Blood Type */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <Droplet className="h-4 w-4 text-[#1E88E5]" />
                <span>Blood Type</span>
              </div>
              <select 
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              >
                <option value="" className="bg-[#F8FAFC]">Select your blood type</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#F8FAFC]">
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
          
          {/* Contact Number */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <Phone className="h-4 w-4 text-[#1E88E5]" />
                <span>Contact Number</span>
              </div>
              <input 
                type="tel" 
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="Enter your contact number"
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
            </label>
          </div>
          
          {/* Availability */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-[#1E88E5]" />
                <span>Availability</span>
              </div>
              <input 
                type="text" 
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                required
                placeholder="e.g., Weekdays 9AM-5PM, Weekends only, etc."
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
            </label>
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="h-4 w-4 text-[#1E88E5]" />
                <span>Preferred Donation Location</span>
              </div>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Enter your preferred donation location"
                className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E1E8ED] rounded-md text-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
            </label>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="h-4 w-4 text-[#1E88E5]" />
                <span>Additional Information (Optional)</span>
              </div>
              <textarea 
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'List Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 