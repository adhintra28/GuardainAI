export type ScanInputFileMeta = {
  relativePath: string;
  originalName: string;
  mimeType: string;
};

export type ComplianceFinding = {
  actTitle: string;
  status: 'pass' | 'fail' | 'unknown';
  reason: string;
  severity?: 'low' | 'medium' | 'high';
};

export type ComplianceScanReport = {
  compliance_score: number;
  risk_level: string;
  summary: string;
  domainId: string;
  domainLabel: string;
  findings: ComplianceFinding[];
};
