import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../types';
import axios from 'axios';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('Fleet Manager');
  const [email, setEmail] = useState('manager@transitops.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
    const emailMap: Record<string, string> = {
      'Fleet Manager': 'manager@transitops.com',
      'Driver': 'dispatcher@transitops.com',
      'Safety Officer': 'safety@transitops.com',
      'Financial Analyst': 'finance@transitops.com',
    };
    setEmail(emailMap[selectedRole] || 'manager@transitops.com');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      const token = res.data?.data?.token;
      const backendUser = res.data?.data?.user;

      if (token && backendUser) {
        localStorage.setItem('transitops_token', token);
        login({
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: role,
        });
        navigate('/dashboard');
      } else {
        setError('Invalid response from server during login.');
      }
    } catch (err: any) {
      console.error('⚠️ Login error:', err?.response?.data || err.message);
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      setError(serverMsg || 'Login failed. Please check your email and password or ensure backend is running.');
    } finally {
      setLoading(false);
    }
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
              Enter credentials directly or select a quick role
            </p>

            <div className="mt-6">
              <label className="block text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">
                Quick Role Fill
              </label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`text-xs py-2 px-3 rounded-xl font-semibold border transition-all ${
                      role === r
                        ? 'bg-[#0C0D0D] text-white border-[#0C0D0D]'
                        : 'bg-[#FAFAFA] text-[#6B7280] border-[#ECECEC] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {r === 'Driver' ? 'Dispatcher / Driver' : r}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200 flex justify-center items-center disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign in to Dashboard'}
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
