import { Plus } from 'lucide-react';

interface AddDriverButtonProps {
  onClick?: () => void;
}

export default function AddDriverButton({ onClick }: AddDriverButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center px-6 h-12 bg-[var(--color-1)] text-white font-semibold text-sm rounded-[var(--radius-sm)] hover:scale-[1.02] transition-all duration-200"
    >
      <Plus className="w-4 h-4 mr-2" /> Add Driver
    </button>
  );
}
