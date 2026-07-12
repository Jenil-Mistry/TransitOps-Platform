import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateTripButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/trips')}
      className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white text-sm font-semibold rounded-2xl hover:scale-[1.02] transition-all duration-200"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create New Trip
    </button>
  );
}
