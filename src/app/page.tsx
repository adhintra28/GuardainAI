"use client";

import React, { useEffect, useState } from 'react';
import UploadZone from '@/components/UploadZone';
import DashboardScore from '@/components/DashboardScore';
import IssuesList from '@/components/IssuesList';
import { ComplianceReport } from '@/types';
import { Shield, Loader2, LogOut } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'otp';

type AuthUser = {
  id: string;
  email: string;
  role: string;
  mfaEnabled?: boolean;
};

export default function Home() {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [blFile, setBlFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const callbackError = params.get('authError');
      if (callbackError) {
        setAuthError(callbackError);
        window.history.replaceState({}, '', '/');
      }

      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          setAuthUser(null);
          return;
        }

        const data = await res.json();
        setAuthUser(data.user);
      } catch {
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadSession();
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

    setAuthUser(data.user);
    resetAuthFlow();
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

    setAuthUser(data.user);
    resetAuthFlow();
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthUser(null);
    setReport(null);
    setInvoiceFile(null);
    setBlFile(null);
    resetAuthFlow();
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  const handleAnalyze = async () => {
    if (!invoiceFile && !blFile) return;
    
    setIsAnalyzing(true);
    setReport(null);

    const formData = new FormData();
    if (invoiceFile) formData.append('invoice', invoiceFile);
    if (blFile) formData.append('bill_of_lading', blFile);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        return;
      }

      if (data.jobId) {
        for (let attempt = 0; attempt < 120; attempt++) {
          const statusRes = await fetch(`/api/analyze/${data.jobId}`);
          const statusData = await statusRes.json();

          if (!statusRes.ok) {
            throw new Error(statusData.error || 'Analysis failed');
          }

          if (statusData.status === 'COMPLETED' && statusData.report) {
            setReport(statusData.report);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      throw new Error('Analysis timed out');
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please try again or check your API key / server logs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <header className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 backdrop-blur-md">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight">
            Compliance Auditor
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl text-lg">
            AI-powered document analysis for Invoices and Bills of Lading. Detect risks, validate data, and ensure smooth customs clearing.
          </p>
        </header>

        {authLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : !authUser ? (
          <div className="max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex rounded-xl bg-slate-800/70 p-1 mb-6">
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
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
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
        ) : !report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
            <div className="col-span-1 md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">{authUser.email}</p>
                <p className="text-xs text-slate-400">{authUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            <UploadZone 
              label="Upload Invoice (GST)" 
              selectedFile={invoiceFile} 
              onFileSelect={setInvoiceFile} 
            />
            <UploadZone 
              label="Upload Bill of Lading" 
              selectedFile={blFile} 
              onFileSelect={setBlFile} 
            />
            
            <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
              <button
                onClick={handleAnalyze}
                disabled={(!invoiceFile && !blFile) || isAnalyzing}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  'Run Validation checks'
                )}
              </button>
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Analysis Results</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setReport(null); setInvoiceFile(null); setBlFile(null); }}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer"
                >
                  Analyze New Documents
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
            
            <DashboardScore report={report} />
            <IssuesList issues={report.issues} />
          </div>
        )}
      </div>
    </div>
  );
}
