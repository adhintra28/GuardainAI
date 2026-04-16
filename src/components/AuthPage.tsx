'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'otp';

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get('authError');

    if (!callbackError) {
      return;
    }

    setAuthError(callbackError);
    window.history.replaceState({}, '', '/auth');
  }, []);

  const resetAuthFlow = () => {
    setPassword('');
    setOtp('');
    setChallengeId(null);
    setOtpSent(false);
    setAuthError(null);
  };

  const handleSignup = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setAuthMode('login');
    setAuthError('Account created. You can log in now.');
    setPassword('');
  };

  const finishLogin = async () => {
    router.replace('/');
    router.refresh();
  };

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.mfaRequired) {
      setChallengeId(data.challengeId);
      setAuthError(null);
      return;
    }

    resetAuthFlow();
    await finishLogin();
  };

  const handleOtpStart = async () => {
    const res = await fetch('/api/auth/otp/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    setOtpSent(true);
    setAuthError('OTP sent to your email. Enter it below to continue.');
  };

  const handleVerifyOtp = async () => {
    const endpoint = challengeId ? '/api/auth/verify-mfa' : '/api/auth/otp/verify';
    const payload = challengeId ? { challengeId, otp } : { email, otp };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'OTP verification failed');
    }

    resetAuthFlow();
    await finishLogin();
  };

  const handleAuthSubmit = async () => {
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      if (challengeId) {
        await handleVerifyOtp();
      } else if (authMode === 'otp') {
        if (otpSent) {
          await handleVerifyOtp();
        } else {
          await handleOtpStart();
        }
      } else if (authMode === 'signup') {
        await handleSignup();
      } else {
        await handleLogin();
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 backdrop-blur-md">
            <Shield className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
            Compliance Auditor
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-400">
            Sign in first to access the compliance dashboard and start analyzing invoice and bill of lading documents.
          </p>
        </header>

        <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex rounded-xl bg-slate-800/70 p-1">
            <button
              onClick={() => {
                setAuthMode('login');
                resetAuthFlow();
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                authMode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                resetAuthFlow();
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                authMode === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setAuthMode('otp');
                resetAuthFlow();
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                authMode === 'otp' ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}
            >
              Email OTP
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Google
              </button>
              <button
                onClick={() => handleOAuth('github')}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                GitHub
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">or continue with email</span>
              </div>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />

            {!challengeId && authMode !== 'otp' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            )}

            {(challengeId || (authMode === 'otp' && otpSent)) && (
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              />
            )}

            {authError && (
              <p className={`text-sm ${authError.includes('created') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {authError}
              </p>
            )}

            <button
              onClick={handleAuthSubmit}
              disabled={
                authSubmitting ||
                !email ||
                ((authMode === 'login' || authMode === 'signup') && !challengeId && !password) ||
                ((challengeId !== null || (authMode === 'otp' && otpSent)) && !otp)
              }
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {authSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </span>
              ) : challengeId ? (
                'Verify OTP'
              ) : authMode === 'otp' ? (
                otpSent ? 'Verify Email OTP' : 'Send Email OTP'
              ) : authMode === 'login' ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
