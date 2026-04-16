export interface InvoiceItem {
  description: string | null;
  hsn_code: string | null;
  quantity: number | null;
  unit_price: number | null;
  tax_rate: number | null;
  tax_amount: number | null;
  total_amount: number | null;
}

export interface Invoice {
  invoice_number: string | null;
  invoice_date: string | null; // format YYYY-MM-DD
  seller_name: string | null;
  seller_gstin: string | null;
  buyer_name: string | null;
  buyer_gstin: string | null;
  items: InvoiceItem[];
  subtotal: number | null;
  total_tax: number | null;
  grand_total: number | null;
}

export interface BillOfLadingGoods {
  description: string | null;
  quantity: number | null;
  weight: number | null;
  hs_code: string | null;
}

export interface BillOfLading {
  bl_number: string | null;
  shipper: string | null;
  consignee: string | null;
  notify_party: string | null;
  port_of_loading: string | null;
  port_of_discharge: string | null;
  goods: BillOfLadingGoods[];
  total_weight: number | null;
  container_number: string | null;
}

export type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ComplianceIssue {
  type: SeverityType;
  message: string;
  explanation: string;
  suggestion: string;
}

export interface ComplianceReport {
  compliance_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  issues: ComplianceIssue[];
  summary: string;
  recommendation: string;
}

export interface ExtractedData {
  invoice?: Invoice;
  billOfLading?: BillOfLading;
}
