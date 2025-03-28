import { DonationListingData } from './DonationListingForm';
import { Droplet, Calendar, MapPin, Phone, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DonationsListProps {
  donations: DonationListingData[];
  userType: 'donor' | 'recipient';
  onStatusChange?: (donationId: string, newStatus: 'available' | 'pending' | 'completed') => void;
  onRequestDonation?: (donationId: string) => void;
}

export default function DonationsList({ 
  donations, 
  userType, 
  onStatusChange,
  onRequestDonation 
}: DonationsListProps) {
  if (donations.length === 0) {
    return (
      <div className="text-center p-8 bg-white border border-[#E1E8ED] rounded-lg">
        <Droplet className="h-12 w-12 mx-auto text-[#7F8C8D] mb-3" />
        <h3 className="text-lg font-semibold text-[#2C3E50]">No donations found</h3>
        <p className="text-[#7F8C8D] mt-1">
          {userType === 'donor' 
            ? 'You haven\'t listed any donations yet. Click "List Donation" to get started.' 
            : 'There are no available blood donations at this time. Please check back later.'}
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-semibold">Available</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600 font-semibold">Pending</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600 font-semibold">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation.id} className="bg-white border border-[#E1E8ED] rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-[#1E88E5]">{donation.bloodType}</span>
                {renderStatusBadge(donation.status)}
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-[#2C3E50]">
                  <User className="h-4 w-4 mr-2 text-[#1E88E5]" />
                  <span>{donation.donorName}</span>
                </div>
                
                <div className="flex items-center text-[#2C3E50]">
                  <Phone className="h-4 w-4 mr-2 text-[#1E88E5]" />
                  <span>{donation.contactNumber}</span>
                </div>
                
                <div className="flex items-center text-[#2C3E50]">
                  <Calendar className="h-4 w-4 mr-2 text-[#1E88E5]" />
                  <span>{donation.availability}</span>
                </div>
                
                <div className="flex items-center text-[#2C3E50]">
                  <MapPin className="h-4 w-4 mr-2 text-[#1E88E5]" />
                  <span>{donation.location}</span>
                </div>
              </div>
              
              {donation.additionalInfo && (
                <div className="mt-3 p-2 bg-[#F8FAFC] rounded border border-[#E1E8ED] text-[#7F8C8D] text-sm">
                  {donation.additionalInfo}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              {userType === 'donor' ? (
                <div className="space-y-2">
                  {donation.status === 'available' && (
                    <button 
                      onClick={() => onStatusChange && onStatusChange(donation.id, 'completed')}
                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </button>
                  )}
                  {donation.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onStatusChange && onStatusChange(donation.id, 'completed')}
                        className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </button>
                      <button 
                        onClick={() => onStatusChange && onStatusChange(donation.id, 'available')}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel Request
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {donation.status === 'available' && (
                    <button 
                      onClick={() => onRequestDonation && onRequestDonation(donation.id)}
                      className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md flex items-center"
                    >
                      <Droplet className="h-4 w-4 mr-2" />
                      Request Donation
                    </button>
                  )}
                  {donation.status === 'pending' && (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Request Pending</span>
                    </div>
                  )}
                  {donation.status === 'completed' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Donation Completed</span>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 text-xs text-[#7F8C8D]">
                Listed on: {donation.listedOn}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 