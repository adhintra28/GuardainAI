"use client";

import React, { useState } from 'react';
import { ComplianceIssue } from '@/types';
import { AlertCircle, ChevronDown, ChevronUp, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface IssuesListProps {
  issues: ComplianceIssue[];
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!issues || issues.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-slate-700/50">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Perfect Compliance</h3>
        <p className="text-slate-400 mt-1 text-sm">No issues detected in the analyzed documents.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'CRITICAL': return <AlertCircle className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5" />;
      case 'LOW': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  }

  const getColorClass = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'border-rose-500/40 bg-rose-500/5 text-rose-400';
      case 'HIGH': return 'border-orange-500/40 bg-orange-500/5 text-orange-400';
      case 'MEDIUM': return 'border-amber-500/40 bg-amber-500/5 text-amber-400';
      case 'LOW': return 'border-blue-500/40 bg-blue-500/5 text-blue-400';
      default: return 'border-slate-500/40 bg-slate-500/5 text-slate-400';
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-2">Detected Issues</h2>
      <div className="flex flex-col gap-3">
        {issues.map((issue, idx) => {
          const isExpanded = expandedIndex === idx;
          const colorClass = getColorClass(issue.type);
          
          return (
            <div 
              key={idx} 
              className={`rounded-xl border transition-all duration-300 overflow-hidden bg-slate-900/40 ${isExpanded ? 'border-slate-600/60 shadow-lg' : 'border-slate-700/40 hover:border-slate-600'}`}
            >
              <button
                className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${isExpanded ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg border ${colorClass}`}>
                    {getIcon(issue.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${colorClass.split(' ')[2]}`}>
                        {issue.type}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{issue.message}</div>
                  </div>
                </div>
                <div className="text-slate-500 shrink-0 ml-4">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 p-5 pt-4' : 'max-h-0 opacity-0 px-5 pt-0'} overflow-hidden border-t ${isExpanded ? 'border-slate-700/50' : 'border-transparent'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 rounded-lg p-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Why this matters</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{issue.explanation}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">How to fix</h4>
                    <p className="text-sm text-indigo-300 leading-relaxed font-medium bg-indigo-500/10 p-3 rounded-md border border-indigo-500/20">{issue.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
