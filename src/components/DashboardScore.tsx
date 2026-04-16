"use client";

import React from 'react';
import { ComplianceReport } from '@/types';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface DashboardScoreProps {
  report: ComplianceReport;
}

export default function DashboardScore({ report }: DashboardScoreProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'HIGH': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case 'MEDIUM': return <AlertTriangle className="w-8 h-8 text-amber-400" />;
      case 'HIGH': return <ShieldAlert className="w-8 h-8 text-rose-400" />;
      default: return null;
    }
  };

  const dashOffset = 440 - (440 * report.compliance_score) / 100;
  
  // Choose stroke color based on score directly
  const strokeColor = report.compliance_score > 85 ? '#34d399' : report.compliance_score > 60 ? '#fbbf24' : '#fb7185';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm gap-8 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full point-events-none" />

      {/* Left side: Score Circle */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1e293b" strokeWidth="12" />
          <circle 
            cx="80" cy="80" r="70" 
            fill="transparent" 
            stroke={strokeColor} 
            strokeWidth="12" 
            strokeDasharray="440" 
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-white tracking-tighter">{report.compliance_score}</span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Score</span>
        </div>
      </div>

      {/* Right side: Info */}
      <div className="flex-1 flex flex-col items-start gap-4 z-10 w-full">
        <div className={`px-4 py-2 rounded-lg flex items-center gap-3 border ${getRiskColor(report.risk_level)}`}>
          {getRiskIcon(report.risk_level)}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Risk Level</div>
            <div className="text-xl font-black tracking-wide">{report.risk_level} RISK</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{report.summary}</h3>
          <p className="text-slate-400 mt-1 text-sm leading-relaxed">{report.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
