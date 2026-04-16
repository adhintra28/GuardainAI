"use client";

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';

interface UploadZoneProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function UploadZone({ label, onFileSelect, selectedFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-300 ml-1 tracking-wide">{label}</label>
      <div
        className={`relative w-full h-40 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden
          ${isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'}
          ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-lg max-w-full truncate border border-slate-700">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
                className="ml-2 p-1 hover:bg-slate-800 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle className="w-3 h-3" /> Ready for analysis
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400 pointer-events-none px-4 text-center">
            <div className={`p-3 rounded-full transition-colors duration-300 ${isDragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-500 mt-1">PDF, PNG, or JPG (max. 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
