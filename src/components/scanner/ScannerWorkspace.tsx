'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SCANNER_DOMAINS, type ScannerDomain } from '@/lib/scannerDomains';
import type { ComplianceScanReport } from '@/types/complianceScan';

type JobStatus = 'idle' | 'uploading' | 'polling' | 'done' | 'error';

export default function ScannerWorkspace() {
  const [domains, setDomains] = useState<ScannerDomain[]>(SCANNER_DOMAINS);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [domainsError, setDomainsError] = useState<string | null>(null);
  const [domainId, setDomainId] = useState(SCANNER_DOMAINS[0]?.id ?? '');
  const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
  const [jobError, setJobError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [report, setReport] = useState<ComplianceScanReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/compliance-domains');
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? res.statusText);
        }
        const data = (await res.json()) as ScannerDomain[];
        if (!cancelled && data.length > 0) {
          setDomains(data);
          setDomainId((id) => (data.some((d) => d.id === id) ? id : data[0].id));
        }
      } catch (e) {
        if (!cancelled) {
          setDomainsError(e instanceof Error ? e.message : 'Failed to load domains');
        }
      } finally {
        if (!cancelled) setDomainsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => domains.find((d) => d.id === domainId) ?? domains[0],
    [domains, domainId],
  );

  const pollJob = useCallback(async (jobId: string) => {
    const terminal = new Set(['COMPLETED', 'FAILED']);
    for (let i = 0; i < 120; i++) {
      const res = await fetch(`/api/scans/${jobId}`);
      if (!res.ok) {
        setJobStatus('error');
        setJobError('Could not load scan status');
        return;
      }
      const data = await res.json();
      if (terminal.has(data.status)) {
        if (data.status === 'FAILED') {
          setJobStatus('error');
          setJobError(data.errorMessage ?? 'Scan failed');
          setReport(null);
        } else {
          setJobStatus('done');
          setJobError(null);
          setReport(data.report ?? null);
        }
        return;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    setJobStatus('error');
    setJobError('Scan is taking longer than expected. Refresh and check reports later.');
  }, []);

  const submitFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      setJobError(null);
      setReport(null);
      setJobStatus('uploading');

      const form = new FormData();
      form.set('domainId', domainId);
      for (const f of list) {
        form.append('files', f);
      }

      const res = await fetch('/api/scans', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setJobStatus('error');
        setJobError((data as { error?: string }).error ?? 'Upload failed');
        return;
      }

      const jobId = (data as { jobId?: string }).jobId;
      if (!jobId) {
        setJobStatus('error');
        setJobError('Invalid response');
        return;
      }

      setActiveJobId(jobId);

      if ((data as { status?: string }).status === 'COMPLETED') {
        setJobStatus('polling');
        await pollJob(jobId);
        return;
      }

      setJobStatus('polling');
      await pollJob(jobId);
    },
    [domainId, pollJob],
  );

  function resetParams() {
    setDomainId(domains[0]?.id ?? '');
    setJobStatus('idle');
    setJobError(null);
    setReport(null);
    setActiveJobId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-6 rounded-xl bg-surface-container-low p-6">
        <div>
          <h3 className="mb-4 font-headline text-sm font-semibold text-on-surface">Scan Parameters</h3>
          {domainsError && (
            <p className="mb-3 rounded-md border border-error-container/50 bg-error-container/10 px-3 py-2 font-body text-xs text-on-error-container">
              Using offline catalog. {domainsError}
            </p>
          )}
          <div className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="scanner-target-domain"
                className="font-label text-[0.6875rem] font-medium uppercase tracking-wider text-on-surface-variant"
              >
                Target Domain
              </label>
              <div className="relative">
                <select
                  id="scanner-target-domain"
                  value={domainId}
                  disabled={domainsLoading}
                  onChange={(e) => setDomainId(e.target.value)}
                  className="w-full appearance-none rounded-md border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 font-body text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container/50 focus:outline-none disabled:opacity-60"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-outline">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-label text-[0.6875rem] font-medium uppercase tracking-wider text-on-surface-variant">
                Compliance framework
              </p>
              <p className="font-body text-xs text-on-surface-variant">
                The scan will evaluate your documents against the following areas for{' '}
                <span className="font-medium text-on-surface">{selected?.label}</span>.
              </p>
              <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 border-b border-outline-variant/15 pb-3">
                  <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                  <span className="font-headline text-sm font-semibold text-on-surface">Compliance coverage</span>
                </div>
                <ul className="max-h-[280px] space-y-2 overflow-y-auto pr-1 font-body text-sm text-on-surface-variant">
                  {selected?.compliances.map((item) => (
                    <li key={item} className="flex gap-2 leading-snug">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      <span className="text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-outline-variant/10 pt-4">
          <button
            type="button"
            onClick={resetParams}
            className="w-full rounded-md bg-surface-container-highest py-2.5 px-4 font-headline text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant"
          >
            Reset Parameters
          </button>
        </div>
      </div>

      <div className="col-span-1 space-y-4 lg:col-span-2">
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            void submitFiles(e.dataTransfer.files);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('scanner-file-input')?.click();
            }
          }}
          className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/20 bg-surface-container-lowest p-12 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary-container/20' : 'hover:bg-surface-container-low/30'
          } ${jobStatus === 'uploading' || jobStatus === 'polling' ? 'pointer-events-none opacity-70' : ''}`}
        >
          <input
            id="scanner-file-input"
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.txt,.json,.md,text/plain,application/pdf,application/json"
            onChange={(e) => {
              const fl = e.target.files;
              if (fl) void submitFiles(fl);
              e.target.value = '';
            }}
          />
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-low transition-all group-hover:scale-105 group-hover:bg-surface-container">
            <span className="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
          </div>
          <h3 className="mb-2 font-headline text-lg font-semibold text-on-surface">Drag & Drop Assets</h3>
          <p className="mb-6 max-w-sm font-body text-sm text-on-surface-variant">
            Upload PDF, plain text, or JSON. Analysis runs against the compliance areas for your selected domain.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-on-surface-variant">or</span>
            <button
              type="button"
              onClick={() => document.getElementById('scanner-file-input')?.click()}
              className="rounded-md bg-primary py-2 px-5 font-headline text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-dim"
            >
              Browse Files
            </button>
          </div>
          <p className="mt-6 font-label text-[0.6875rem] text-outline">
            Max file size: 50MB. Sign in required.
          </p>
        </div>

        {(jobStatus === 'uploading' || jobStatus === 'polling') && (
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 font-body text-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">
              {jobStatus === 'uploading' ? 'Uploading…' : 'Analyzing…'}
            </span>
            {activeJobId && (
              <span className="mt-1 block font-mono text-xs text-outline">Job {activeJobId}</span>
            )}
          </div>
        )}

        {jobError && (
          <div className="rounded-lg border border-error-container/40 bg-error-container/10 px-4 py-3 font-body text-sm text-on-error-container">
            {jobError}
          </div>
        )}

        {report && jobStatus === 'done' && (
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 text-left shadow-sm">
            <h4 className="font-headline text-base font-semibold text-on-surface">Scan results</h4>
            <p className="mt-1 font-body text-sm text-on-surface-variant">
              Score:{' '}
              <span className="font-semibold text-on-surface">{report.compliance_score}%</span>
              {' · '}
              Risk: <span className="font-semibold text-on-surface">{report.risk_level}</span>
            </p>
            <p className="mt-3 font-body text-sm text-on-surface">{report.summary}</p>
            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto border-t border-outline-variant/15 pt-4">
              {report.findings.map((f) => (
                <li key={f.actTitle} className="font-body text-sm">
                  <span className="font-medium text-on-surface">{f.actTitle}</span>
                  <span
                    className={`ml-2 rounded px-1.5 py-0.5 text-[0.6875rem] font-medium uppercase ${
                      f.status === 'pass'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : f.status === 'fail'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    {f.status}
                  </span>
                  <p className="mt-1 text-on-surface-variant">{f.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
