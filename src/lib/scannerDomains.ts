export type ScannerDomain = {
  id: string;
  label: string;
  compliances: string[];
};

export const SCANNER_DOMAINS: ScannerDomain[] = [
  {
    id: 'finance-banking',
    label: 'Finance & Banking',
    compliances: [
      'KYC Compliance',
      'AML (Anti-Money Laundering)',
      'RBI Regulations',
      'Fraud Detection Compliance',
    ],
  },
  {
    id: 'logistics-supply-chain',
    label: 'Logistics & Supply Chain',
    compliances: [
      'Shipment Documentation Compliance',
      'Trade Documentation Consistency',
      'Carrier Liability Compliance',
    ],
  },
  {
    id: 'customs-international-trade',
    label: 'Customs & International Trade',
    compliances: [
      'Customs Act Compliance (India: 1962)',
      'HS Code Classification Compliance',
      'Import/Export Regulations',
      'Duty & Tax Compliance',
    ],
  },
  {
    id: 'legal-contracts',
    label: 'Legal & Contracts',
    compliances: [
      'Contract Law Compliance',
      'Clause Validation',
      'Regulatory Legal Compliance',
      'Risk Clause Detection',
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    compliances: [
      'Patient Data Compliance (like HIPAA)',
      'Medical Record Accuracy',
      'Clinical Documentation Compliance',
    ],
  },
  {
    id: 'insurance',
    label: 'Insurance',
    compliances: [
      'Claim Validation Compliance',
      'Policy Terms Compliance',
      'Fraud Detection in Claims',
    ],
  },
  {
    id: 'hr',
    label: 'Human Resources (HR)',
    compliances: [
      'Employment Law Compliance',
      'Employee Document Verification',
      'Payroll Compliance',
    ],
  },
  {
    id: 'recruitment-bgv',
    label: 'Recruitment & Background Verification',
    compliances: [
      'Identity Verification Compliance',
      'Certificate Authenticity Checks',
      'Background Screening Compliance',
    ],
  },
  {
    id: 'real-estate',
    label: 'Real Estate & Property',
    compliances: [
      'Land Ownership Compliance',
      'Property Registration Laws',
      'Loan Documentation Compliance',
    ],
  },
  {
    id: 'cybersecurity-identity',
    label: 'Cybersecurity & Identity Verification',
    compliances: [
      'Data Protection Compliance (like GDPR)',
      'Identity Authentication Standards',
      'Encryption & Data Security Compliance',
    ],
  },
  {
    id: 'corporate-auditing',
    label: 'Corporate Compliance & Auditing',
    compliances: [
      'Financial Reporting Compliance',
      'Internal Audit Compliance',
      'Governance (Corporate Laws)',
    ],
  },
  {
    id: 'taxation-gst',
    label: 'Taxation & GST',
    compliances: ['GST Compliance', 'Invoice Matching Compliance', 'Tax Filing Regulations'],
  },
  {
    id: 'government-egovernance',
    label: 'Government & e-Governance',
    compliances: [
      'Public Record Compliance',
      'Citizen Data Protection',
      'Document Standardization Rules',
    ],
  },
  {
    id: 'procurement-vendor',
    label: 'Procurement & Vendor Management',
    compliances: [
      'Vendor Contract Compliance',
      'Purchase Order vs Invoice Matching',
      'Anti-Corruption Compliance',
    ],
  },
  {
    id: 'education',
    label: 'Education (Certificates & Records)',
    compliances: [
      'Academic Certificate Verification',
      'Accreditation Compliance',
      'Transcript Validation',
    ],
  },
];

export function getDomainById(id: string): ScannerDomain | undefined {
  return SCANNER_DOMAINS.find((d) => d.id === id);
}
