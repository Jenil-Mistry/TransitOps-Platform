import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../types';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// Maps backend role enums to frontend display role names
const backendToFrontendRole = (backendRole: string): Role => {
  const map: Record<string, Role> = {
    'FLEET_MANAGER': 'Fleet Manager',
    'DISPATCHER': 'Driver',
    'SAFETY_OFFICER': 'Safety Officer',
    'FINANCIAL_ANALYST': 'Financial Analyst',
  };
  return map[backendRole] || 'Fleet Manager';
};

const frontendToBackendRole = (role: Role): string => {
  const map: Record<string, string> = {
    'Fleet Manager': 'FLEET_MANAGER',
    'Driver': 'DISPATCHER',
    'Safety Officer': 'SAFETY_OFFICER',
    'Financial Analyst': 'FINANCIAL_ANALYST',
  };
  return map[role] || 'FLEET_MANAGER';
};

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Toggle between Sign In and Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up only
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick fill for demo accounts
  const handleQuickFill = (selectedRole: Role) => {
    setRole(selectedRole);
    const emailMap: Record<string, string> = {
      'Fleet Manager': 'manager@transitops.com',
      'Driver': 'dispatcher@transitops.com',
      'Safety Officer': 'safety@transitops.com',
      'Financial Analyst': 'finance@transitops.com',
    };
    setEmail(emailMap[selectedRole] || 'manager@transitops.com');
    setPassword('password123');
    setIsSignUp(false);
    setError('');
    setSuccessMsg('');
  };

  // ─── Sign In Handler ──────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const token = res.data?.data?.token;
      const backendUser = res.data?.data?.user;

      if (token && backendUser) {
        localStorage.setItem('transitops_token', token);
        login({
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendToFrontendRole(backendUser.role),
        });
        navigate('/dashboard');
      } else {
        setError('Unexpected server response. Please try again.');
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      if (err?.response?.status === 401) {
        setError('Invalid email or password. If you are new, click "Create Account" below.');
      } else {
        setError(serverMsg || 'Login failed. Please ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up Handler ──────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
        name,
        role: frontendToBackendRole(role),
      });
      const token = res.data?.data?.token;
      const backendUser = res.data?.data?.user;

      if (token && backendUser) {
        localStorage.setItem('transitops_token', token);
        login({
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendToFrontendRole(backendUser.role),
        });
        navigate('/dashboard');
      } else {
        setSuccessMsg('Account created! You can now sign in.');
        setIsSignUp(false);
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      if (err?.response?.status === 409) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(serverMsg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#ECF4EE] font-sans">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="bg-white p-8 rounded-[24px] border border-[#ECECEC] card-shadow">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-[#0C0D0D] rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-xl">T</span>
              </div>
              <span className="text-2xl font-extrabold text-[#111111] tracking-tight">TransitOps</span>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-1 mb-6">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  !isSignUp ? 'bg-[#0C0D0D] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isSignUp ? 'bg-[#0C0D0D] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111111]'
                }`}
              >
                Create Account
              </button>
            </div>

            <h2 className="text-xl font-bold text-[#111111] tracking-tight">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              {isSignUp ? 'Enter your details to get started' : 'Enter your credentials or try a demo role'}
            </p>

            {/* Quick Fill — only in Sign In mode */}
            {!isSignUp && (
              <div className="mt-5">
                <label className="block text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">
                  Quick Demo Login
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleQuickFill(r)}
                      className={`text-[11px] py-2 px-3 rounded-xl font-semibold border transition-all ${
                        !isSignUp && email.includes(r === 'Driver' ? 'dispatcher' : r.split(' ')[0].toLowerCase())
                          ? 'bg-[#0C0D0D] text-white border-[#0C0D0D]'
                          : 'bg-[#FAFAFA] text-[#6B7280] border-[#ECECEC] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                {/* Sign Up: Username */}
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                      required
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? 'Create a strong password (min 6 chars)' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                    required
                  />
                </div>

                {/* Sign Up: Confirm Password */}
                {isSignUp && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 px-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                      required
                    />
                  </div>
                )}

                {/* Sign Up: Role Selection */}
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5 uppercase tracking-wide">
                      Your Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`text-[11px] py-2.5 px-3 rounded-xl font-semibold border transition-all ${
                            role === r
                              ? 'bg-[#0C0D0D] text-white border-[#0C0D0D]'
                              : 'bg-[#FAFAFA] text-[#6B7280] border-[#ECECEC] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
                    {error}
                  </div>
                )}

                {/* Success Display */}
                {successMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-2xl">
                    {successMsg}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200 flex justify-center items-center disabled:opacity-50"
                  >
                    {loading
                      ? (isSignUp ? 'Creating Account...' : 'Signing in...')
                      : (isSignUp ? 'Create Account & Enter' : 'Sign in to Dashboard')
                    }
                  </button>
                </div>
              </form>

              {/* Toggle prompt */}
              <p className="mt-5 text-center text-xs text-[#6B7280]">
                {isSignUp ? (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => { setIsSignUp(false); setError(''); }} className="font-bold text-[#111111] hover:underline">
                      Sign In
                    </button>
                  </>
                ) : (
                  <>First time here?{' '}
                    <button type="button" onClick={() => { setIsSignUp(true); setError(''); }} className="font-bold text-[#111111] hover:underline">
                      Create Account
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (decorative) */}
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
