'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, Shield } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import DashboardScore from '@/components/DashboardScore';
import IssuesList from '@/components/IssuesList';
import { ComplianceReport } from '@/types';
import { CurrentUser } from '@/lib/currentUser';

type ComplianceDashboardProps = {
  authUser: CurrentUser;
};

export default function ComplianceDashboard({ authUser }: ComplianceDashboardProps) {
  const router = useRouter();
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [blFile, setBlFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setReport(null);
    setInvoiceFile(null);
    setBlFile(null);
    router.replace('/auth');
    router.refresh();
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
            AI-powered document analysis for Invoices and Bills of Lading. Detect risks, validate data, and ensure smooth customs clearing.
          </p>
        </header>

        {!report ? (
          <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl md:grid-cols-2">
            <div className="col-span-1 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 md:col-span-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{authUser.email}</p>
                <p className="text-xs text-slate-400">{authUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <UploadZone label="Upload Invoice (GST)" selectedFile={invoiceFile} onFileSelect={setInvoiceFile} />
            <UploadZone label="Upload Bill of Lading" selectedFile={blFile} onFileSelect={setBlFile} />

            <div className="col-span-1 mt-6 flex justify-center md:col-span-2">
              <button
                onClick={handleAnalyze}
                disabled={(!invoiceFile && !blFile) || isAnalyzing}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56" />
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  'Run Validation checks'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 space-y-8 fade-in duration-700">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2 className="text-2xl font-bold tracking-tight text-white">Analysis Results</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setReport(null);
                    setInvoiceFile(null);
                    setBlFile(null);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                >
                  Analyze New Documents
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
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
