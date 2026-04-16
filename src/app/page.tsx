"use client";

import React, { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import DashboardScore from '@/components/DashboardScore';
import IssuesList from '@/components/IssuesList';
import { ComplianceReport } from '@/types';
import { Shield, Loader2 } from 'lucide-react';

export default function Home() {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [blFile, setBlFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);

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
        <header className="flex flex-col items-center justify-center mb-16 text-center">
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

        {!report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
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
              <button 
                onClick={() => { setReport(null); setInvoiceFile(null); setBlFile(null); }}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer"
              >
                Analyze New Documents
              </button>
            </div>
            
            <DashboardScore report={report} />
            <IssuesList issues={report.issues} />
          </div>
        )}
      </div>
    </div>
  );
}
