import { Droplet, Users } from 'lucide-react';

interface UserTypeSelectorProps {
  userType: 'donor' | 'recipient';
  setUserType: (type: 'donor' | 'recipient') => void;
}

export default function UserTypeSelector({ userType, setUserType }: UserTypeSelectorProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setUserType('donor')}
        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
          userType === 'donor'
            ? 'bg-[#9C27B0] text-white'
            : 'bg-[#262626] border border-[#333333] text-white hover:bg-[#333333]'
        }`}
      >
        <Droplet className="h-5 w-5" />
        <span>Donor Dashboard</span>
      </button>
      
      <button
        onClick={() => setUserType('recipient')}
        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
          userType === 'recipient'
            ? 'bg-[#9C27B0] text-white'
            : 'bg-[#262626] border border-[#333333] text-white hover:bg-[#333333]'
        }`}
      >
        <Users className="h-5 w-5" />
        <span>Recipient Dashboard</span>
      </button>
    </div>
  );
} 