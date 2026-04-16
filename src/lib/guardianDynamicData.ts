import { db } from '@/lib/db';
import type { ComplianceFinding, ComplianceScanReport } from '@/types/complianceScan';

/** Stable anonymous workspace when Clerk is not used. */
export const ANONYMOUS_SCAN_USER_EMAIL = 'prototype@local.guardian';

/** SVG path for a simple sparkline (viewBox 0 0 100 100). */
export function buildTrendSvgPath(scores: number[]): { line: string; area: string; points: { x: number; y: number }[] } | null {
  if (scores.length < 2) return null;
  const w = 100;
  const h = 100;
  const pad = 6;
  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 100);
  const range = Math.max(max - min, 1e-6);
  const points = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * (w - 2 * pad);
    const y = pad + (1 - (s - min) / range) * (h - 2 * pad);
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  const area = `${line} L${points[points.length - 1].x.toFixed(2)},${h} L${points[0].x.toFixed(2)},${h} Z`;
  return { line, area, points };
}

export function parseComplianceReport(json: unknown): ComplianceScanReport | null {
  if (!json || typeof json !== 'object') return null;
  const r = json as Record<string, unknown>;
  if (typeof r.compliance_score !== 'number') return null;
  return json as ComplianceScanReport;
}

function formatRelativeTime(d: Date): string {
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function domainMaterialIcon(domainId: string): string {
  if (domainId.includes('finance') || domainId.includes('bank')) return 'payments';
  if (domainId.includes('logistics') || domainId.includes('supply')) return 'local_shipping';
  if (domainId.includes('customs') || domainId.includes('trade')) return 'public';
  if (domainId.includes('legal')) return 'gavel';
  if (domainId.includes('health')) return 'medical_information';
  if (domainId.includes('energy')) return 'bolt';
  if (domainId.includes('telecom')) return 'router';
  return 'dns';
}

export type DashboardView = {
  complianceScorePct: number | null;
  activeRisks: number;
  openIssues: number;
  trendScores: number[];
  insightSummary: string | null;
  insightTarget: string | null;
  recentActivity: { dotClass: string; message: string; time: string }[];
  hasData: boolean;
};

export async function getDashboardView(userId: string): Promise<DashboardView> {
  const jobs = await db.analysisJob.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 60,
    include: { complianceDomain: { select: { id: true, label: true } } },
  });

  const completed = jobs.filter((j) => j.status === 'COMPLETED' && j.report != null);
  const scores = completed
    .map((j) => parseComplianceReport(j.report))
    .filter((r): r is ComplianceScanReport => r != null)
    .map((r) => r.compliance_score);

  const avg =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  let failCount = 0;
  for (const j of completed) {
    const r = parseComplianceReport(j.report);
    if (!r?.findings) continue;
    failCount += r.findings.filter((f) => f.status === 'fail').length;
  }

  const chronological = [...completed].reverse();
  const trendScores = chronological
    .slice(-8)
    .map((j) => parseComplianceReport(j.report)?.compliance_score)
    .filter((n): n is number => typeof n === 'number');

  const latest = completed[0];
  const latestReport = latest ? parseComplianceReport(latest.report) : null;
  const failFinding = latestReport?.findings?.find((f) => f.status === 'fail');

  const recentActivity = jobs.slice(0, 6).map((j) => {
    const label = j.complianceDomain?.label ?? 'Compliance scan';
    if (j.status === 'COMPLETED') {
      return {
        dotClass: 'bg-secondary',
        message: `${label}: scan completed.`,
        time: formatRelativeTime(j.updatedAt),
      };
    }
    if (j.status === 'FAILED') {
      return {
        dotClass: 'bg-error',
        message: `${label}: scan failed${j.errorMessage ? ` — ${j.errorMessage.slice(0, 80)}` : ''}.`,
        time: formatRelativeTime(j.updatedAt),
      };
    }
    return {
      dotClass: 'bg-outline-variant',
      message: `${label}: ${j.status.toLowerCase().replace('_', ' ')}.`,
      time: formatRelativeTime(j.updatedAt),
    };
  });

  return {
    complianceScorePct: avg,
    activeRisks: failCount,
    openIssues: failCount,
    trendScores,
    insightSummary:
      latestReport?.summary ??
      (jobs.length === 0        ? 'Run a compliance scan to generate AI summaries and posture scores.'
        : null),
    insightTarget: failFinding?.actTitle ?? latest?.complianceDomain?.label ?? null,
    recentActivity,
    hasData: jobs.length > 0,
  };
}

export type DomainCardView = {
  id: string;
  icon: string;
  name: string;
  env: string;
  status: string;
  statusClass: string;
  dot: string;
  frameworks: string;
  scanned: string;
  findings: string;
  findingsClass: string;
};

export async function getDomainCards(userId: string): Promise<DomainCardView[]> {
  const domains = await db.complianceDomain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      acts: { orderBy: { sortOrder: 'asc' }, take: 4, select: { title: true } },
    },
  });

  const jobs = await db.analysisJob.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { complianceDomain: { select: { id: true } } },
  });

  const latestByDomain = new Map<string, (typeof jobs)[0]>();
  for (const j of jobs) {
    const did = j.complianceDomain?.id;
    if (did && !latestByDomain.has(did)) latestByDomain.set(did, j);
  }

  return domains.map((d) => {
    const latest = latestByDomain.get(d.id);
    const report = latest?.report ? parseComplianceReport(latest.report) : null;
    const fails = report?.findings?.filter((f) => f.status === 'fail') ?? [];
    const highs = fails.filter((f) => f.severity === 'high').length;
    const meds = fails.filter((f) => f.severity === 'medium').length;
    const lows = fails.filter((f) => f.severity === 'low' || !f.severity).length;

    let status = 'Not scanned';
    let statusClass = 'bg-surface-container-highest text-on-surface';
    let dot = 'bg-outline';

    if (latest?.status === 'FAILED') {
      status = 'Scan failed';
      statusClass = 'bg-error-container text-on-error-container';
      dot = 'bg-error';
    } else if (latest?.status === 'COMPLETED' && report) {
      if (fails.length === 0) {
        status = 'Compliant';
        statusClass = 'bg-secondary-container text-on-secondary-container';
        dot = 'bg-secondary';
      } else {
        status = 'Action req.';
        statusClass = 'bg-error-container text-on-error-container';
        dot = 'bg-error';
      }
    } else if (latest && latest.status !== 'COMPLETED') {
      status = latest.status === 'QUEUED' ? 'Queued' : 'Processing';
      statusClass = 'bg-surface-container-highest text-on-surface';
      dot = 'bg-outline';
    }

    const findings =
      !latest || latest.status !== 'COMPLETED'
        ? '—'
        : fails.length === 0
          ? '0 findings'
          : `${highs} high, ${meds} med, ${lows} low`;

    const findingsClass = fails.length > 0 ? 'text-error' : 'text-on-surface';

    return {
      id: d.id,
      icon: domainMaterialIcon(d.id),
      name: d.label,
      env: 'Workspace',
      status,
      statusClass,
      dot,
      frameworks: d.acts.map((a) => a.title).join(', ') || '—',
      scanned: latest ? formatRelativeTime(latest.updatedAt) : 'Never',
      findings,
      findingsClass,
    };
  });
}

export type AlertRow = {
  id: string;
  severityLabel: string;
  severityClass: string;
  iconClass: string;
  title: string;
  body: string;
  metaLeft: string;
  metaRight: string;
  timeLabel: string;
};

export async function getAlertsFromScans(userId: string): Promise<AlertRow[]> {
  const jobs = await db.analysisJob.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { updatedAt: 'desc' },
    take: 25,
    include: { complianceDomain: { select: { id: true, label: true } } },
  });

  const rows: AlertRow[] = [];
  for (const j of jobs) {
    const r = parseComplianceReport(j.report);
    if (!r?.findings) continue;
    for (const f of r.findings) {
      if (f.status !== 'fail') continue;
      const sev = f.severity ?? 'medium';
      const severityLabel = sev === 'high' ? 'Critical' : sev === 'medium' ? 'High' : 'Medium';
      const severityClass =
        sev === 'high'
          ? 'bg-error-container text-on-error-container'
          : sev === 'medium'
            ? 'bg-[#fef3c7] text-[#92400e]'
            : 'bg-secondary-container text-on-secondary-container';
      const iconClass = sev === 'high' ? 'fill text-error' : sev === 'medium' ? 'text-[#d97706]' : 'text-secondary';

      rows.push({
        id: `${j.id}-${f.actTitle}-${rows.length}`,
        severityLabel,
        severityClass,
        iconClass,
        title: f.actTitle,
        body: f.reason,
        metaLeft: r.domainLabel,
        metaRight: f.actTitle.slice(0, 24),
        timeLabel: formatRelativeTime(j.updatedAt),
      });
    }
  }

  return rows.slice(0, 20);
}

export type ReportRow = {
  id: string;
  date: string;
  time: string;
  title: string;
  sub: string;
  domainIcon: string;
  domain: string;
  status: string;
  statusClass: string;
  dot: string;
};

export async function getReportRows(userId: string): Promise<ReportRow[]> {
  const jobs = await db.analysisJob.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 40,
    include: { complianceDomain: { select: { id: true, label: true } } },
  });

  return jobs.map((j) => {
    const d = j.createdAt;
    const report = j.report ? parseComplianceReport(j.report) : null;
    const domainLabel = j.complianceDomain?.label ?? '—';
    const icon = j.complianceDomain?.id ? domainMaterialIcon(j.complianceDomain.id) : 'topic';

    let status: string;
    let statusClass: string;
    let dot: string;

    if (j.status === 'COMPLETED' && report) {
      const fails = report.findings?.filter((f) => f.status === 'fail').length ?? 0;
      if (fails === 0) {
        status = 'Passed';
        statusClass = 'bg-primary-container text-on-primary-container';
        dot = 'bg-primary';
      } else {
        status = `${fails} finding${fails === 1 ? '' : 's'}`;
        statusClass = 'bg-error-container text-on-error-container';
        dot = 'bg-error';
      }
    } else if (j.status === 'FAILED') {
      status = 'Failed';
      statusClass = 'bg-error-container text-on-error-container';
      dot = 'bg-error';
    } else if (j.status === 'PROCESSING') {
      status = 'In progress';
      statusClass = 'bg-surface-container-highest text-on-surface';
      dot = 'bg-outline';
    } else {
      status = 'Queued';
      statusClass = 'bg-surface-container-highest text-on-surface';
      dot = 'bg-outline';
    }

    return {
      id: j.id,
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      title: domainLabel,
      sub: report?.risk_level ? `${report.risk_level} risk` : 'Compliance scan',
      domainIcon: icon,
      domain: domainLabel,
      status,
      statusClass,
      dot,
    };
  });
}

export type FrameworkDomainView = {
  id: string;
  initials: string;
  label: string;
  description: string;
  scorePct: number | null;
  scoreHint: string;
  acts: { title: string; ok: boolean | null; detail: string }[];
};

export type FrameworksSummary = {
  overallPct: number | null;
  failingControls: number;
  activeCount: number;
  domains: FrameworkDomainView[];
};

export async function getFrameworksView(userId: string): Promise<FrameworksSummary> {
  const domains = await db.complianceDomain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      acts: { orderBy: { sortOrder: 'asc' }, select: { title: true } },
    },
  });

  const jobs = await db.analysisJob.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { updatedAt: 'desc' },
    include: { complianceDomain: { select: { id: true } } },
  });

  const latestCompletedByDomain = new Map<string, ComplianceScanReport | null>();
  for (const j of jobs) {
    const did = j.complianceDomain?.id;
    if (!did || latestCompletedByDomain.has(did)) continue;
    latestCompletedByDomain.set(did, parseComplianceReport(j.report));
  }

  let totalScore = 0;
  let scoreN = 0;
  let failingControls = 0;

  const domainViews: FrameworkDomainView[] = domains.map((d) => {
    const report = latestCompletedByDomain.get(d.id) ?? null;
    if (report?.compliance_score != null) {
      totalScore += report.compliance_score;
      scoreN += 1;
    }

    const findingByAct = new Map<string, ComplianceFinding>();
    for (const f of report?.findings ?? []) {
      findingByAct.set(f.actTitle, f);
    }

    const acts = d.acts.slice(0, 4).map((a) => {
      const f = findingByAct.get(a.title);
      if (!report) {
        return { title: a.title, ok: null, detail: 'No scan yet for this domain.' };
      }
      if (!f) {
        return { title: a.title, ok: true, detail: 'No specific finding returned for this control.' };
      }
      if (f.status === 'fail') failingControls += 1;
      return {
        title: a.title,
        ok: f.status !== 'fail',
        detail: f.reason,
      };
    });

    const scorePct = report?.compliance_score ?? null;
    let scoreHint = 'Not scanned';
    if (report) {
      const fails = report.findings?.filter((x) => x.status === 'fail').length ?? 0;
      scoreHint = fails > 0 ? 'Action needed' : 'Compliant';
    }

    const initials = d.label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '•';

    return {
      id: d.id,
      initials,
      label: d.label,
      description: `${d.acts.length} mapped controls`,
      scorePct,
      scoreHint,
      acts,
    };
  });

  const overallPct = scoreN > 0 ? Math.round(totalScore / scoreN) : null;

  return {
    overallPct,
    failingControls,
    activeCount: domains.length,
    domains: domainViews,
  };
}
