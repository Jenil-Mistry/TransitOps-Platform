import { Truck } from 'lucide-react';

export default function SidebarUpgradeCard() {
  return (
    <div className="p-4 hidden md:block">
      <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-[#ECECEC] relative overflow-hidden transition-all duration-200 hover:card-shadow">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <Truck className="w-20 h-20 text-[#111111]" />
        </div>
        <h4 className="font-bold text-[#111111] mb-1">Pro Plan</h4>
        <p className="text-xs text-[#6B7280] mb-4">Unlock more features for your logistics needs.</p>
        <button className="w-full h-10 bg-[#FFFFFF] border border-[#ECECEC] text-[#111111] text-xs font-semibold rounded-2xl hover:border-[#111111] transition-all duration-200">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
