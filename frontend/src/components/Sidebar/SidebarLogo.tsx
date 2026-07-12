export default function SidebarLogo() {
  return (
    <div className="p-6 flex items-center space-x-3">
      <div className="w-8 h-8 bg-[#0C0D0D] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">T</span>
      </div>
      <span className="text-xl font-bold text-[#111111] hidden md:block tracking-tight">TransitOps</span>
    </div>
  );
}
