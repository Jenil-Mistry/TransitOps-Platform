import { ArrowLeft, User, Mail, Phone, Hash, Building2, MapPin, Shield, Calendar, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BaseCard from '../components/Cards/BaseCard';
import { mockUser } from '../data/mockUser';

// TODO: Replace mockUser with authenticated user data from backend API.

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white border border-transparent hover:border-[#ECECEC] transition-all card-shadow hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
        </button>
        <h1 className="text-2xl font-bold text-[#111111]">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Avatar & Quick Info */}
        <div className="space-y-6">
          <BaseCard>
            <div className="flex flex-col items-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center text-[#111111] font-bold text-2xl mb-4">
                {mockUser.avatarUrl ? (
                  <img src={mockUser.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>AF</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#111111]">{mockUser.name}</h2>
              <p className="text-sm font-medium text-[#6B7280] mb-4">{mockUser.role}</p>
              
              <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider bg-[#DCFCE7] text-[#16A34A]">
                {mockUser.status}
              </span>
            </div>
          </BaseCard>

          <BaseCard title="Actions" bodyClassName="p-4 space-y-2">
             <button className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-[#111111] bg-white rounded-xl hover:bg-[#FAFAFA] transition-colors border border-[#ECECEC]">
               <User className="w-4 h-4 mr-3 text-[#6B7280]" /> Edit Profile
             </button>
             <button className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-[#111111] bg-white rounded-xl hover:bg-[#FAFAFA] transition-colors border border-[#ECECEC]">
               <Key className="w-4 h-4 mr-3 text-[#6B7280]" /> Change Password
             </button>
          </BaseCard>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <BaseCard title="Personal Information" bodyClassName="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              <InfoField icon={User} label="Full Name" value={mockUser.name} />
              <InfoField icon={Mail} label="Email Address" value={mockUser.email} />
              <InfoField icon={Phone} label="Phone Number" value={mockUser.phone} />
              <InfoField icon={Hash} label="Employee ID" value={mockUser.employeeId} />
              <InfoField icon={Building2} label="Department" value={mockUser.department} />
              <InfoField icon={MapPin} label="Location" value={mockUser.location} />
            </div>
          </BaseCard>

          {/* Account Information */}
          <BaseCard title="Account Information" bodyClassName="p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
               <InfoField icon={Shield} label="Role" value={mockUser.role} />
               <InfoField icon={Calendar} label="Member Since" value={mockUser.memberSince} />
             </div>
          </BaseCard>

        </div>
      </div>
    </div>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start">
      <div className="mt-0.5 flex-shrink-0 text-[#9CA3AF]">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3.5">
        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#111111]">{value}</p>
      </div>
    </div>
  );
}
