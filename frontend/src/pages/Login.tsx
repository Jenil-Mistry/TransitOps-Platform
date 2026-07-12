import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../types';

export default function Login() {
  const { login } = useAuthStore();
  const [role, setRole] = useState<Role>('Fleet Manager');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      name: 'Demo User',
      email: 'demo@transitops.com',
      role,
    });
  };

  return (
    <div className="min-h-screen flex bg-[#ECF4EE] font-sans">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="bg-white p-8 rounded-[24px] border border-[#ECECEC] card-shadow">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-[#0C0D0D] rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-xl">T</span>
              </div>
              <span className="text-2xl font-extrabold text-[#111111] tracking-tight">TransitOps</span>
            </div>
            <h2 className="mt-6 text-xl font-bold text-[#111111] tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Manage your fleet operations efficiently
            </p>

            <div className="mt-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="role" className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">
                    Select Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
                    >
                      <option value="Fleet Manager">Fleet Manager</option>
                      <option value="Driver">Driver</option>
                      <option value="Safety Officer">Safety Officer</option>
                      <option value="Financial Analyst">Financial Analyst</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-4">
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#111111]">Note:</span> This is a demo. No password required. Just select a role and sign in to explore the dashboard.
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200 flex justify-center items-center"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-[#FAFAFA]">
        <div className="absolute inset-0 flex items-center justify-center p-20">
           <div className="w-full h-full border border-[#ECECEC] rounded-[32px] bg-white flex flex-col items-center justify-center text-center p-12">
             <div className="w-24 h-24 bg-[#FAFAFA] rounded-3xl border border-[#ECECEC] flex items-center justify-center mb-8">
               <svg className="w-12 h-12 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h3 className="text-4xl font-extrabold text-[#111111] mb-4 tracking-tight">Premium Fleet Intelligence.</h3>
             <p className="text-[#6B7280] text-lg max-w-lg">
               Take control of your logistics with minimal effort. Our operations platform is built for speed, reliability, and enterprise scale.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
