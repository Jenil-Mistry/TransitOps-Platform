import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../types';
import axios from 'axios';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';

const API_BASE = 'http://localhost:3000/api';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // BYPASS FOR DEMO / FRONTEND PREVIEW
    setTimeout(() => {
      login({
        id: '1',
        name: email.split('@')[0],
        email: email,
        role: role,
      });
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-app)] bg-[radial-gradient(ellipse_at_top,_var(--color-bg-secondary),_var(--color-bg-app))] font-[var(--font-sans)] p-4">
      <div ref={containerRef} className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-[var(--color-brand)] border-2 border-[var(--color-brand-foreground)] rounded-[var(--radius-sm)] flex items-center justify-center mb-4 shadow-[4px_4px_0_var(--color-brand-foreground)]">
            <span className="text-[var(--color-brand-foreground)] font-extrabold text-2xl font-mono">T</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-[var(--color-text-primary)] uppercase">TransitOps</h1>
          <p className="text-[var(--color-text-muted)] font-mono text-xs tracking-widest uppercase mt-2">Fleet Intelligence Terminal</p>
        </div>

        <Card className="border-2 border-[var(--color-border-strong)] shadow-[8px_8px_0_var(--color-border-strong)]">
          <CardHeader className="border-b-2 border-[var(--color-border-strong)]">
            <div className="flex bg-[var(--color-bg-app)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] p-1 mb-2">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  !isSignUp ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] ' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                Access Terminal
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSignUp ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] ' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                Request Access
              </button>
            </div>
            <CardDescription className="text-center mt-2">
              {isSignUp ? 'REGISTER NEW OPERATOR CREDENTIALS' : 'ENTER OPERATOR CREDENTIALS'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isSignUp && (
              <div className="mb-6 pb-6 border-b-2 border-dashed border-[var(--color-border-strong)]">
                <label className="block text-[10px] font-bold text-[var(--color-text-muted)] mb-3 uppercase tracking-widest text-center">
                  Quick Access Overrides
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] as Role[]).map((r) => (
                    <Button
                      key={r}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFill(r)}
                      className="text-[10px]"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Operator Name</label>
                  <Input id="name" type="text" placeholder="J. DOE" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Email Address</label>
                <Input id="email" type="email" placeholder="OP@TRANSITOPS.COM" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Security Key</label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Confirm Key</label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              )}

              {error && (
                <div className="p-3 bg-[var(--color-danger-soft)] border-l-4 border-[var(--color-danger)] text-white text-xs font-mono">
                  ERROR: {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-[var(--color-success-soft)] border-l-4 border-[var(--color-success)] text-white text-xs font-mono">
                  SUCCESS: {successMsg}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-sm mt-4" disabled={loading}>
                {loading ? 'AUTHENTICATING...' : (isSignUp ? 'INITIALIZE CREDENTIALS' : 'INITIATE LOGIN')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
