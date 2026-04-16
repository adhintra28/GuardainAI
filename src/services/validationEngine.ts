import { Invoice, BillOfLading, ComplianceIssue } from '@/types';

export function validateInvoice(invoice: Invoice): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Mandatory checks
  if (!invoice.invoice_number) {
    issues.push({ type: 'CRITICAL', message: 'Missing invoice number', explanation: '', suggestion: '' });
  }
  if (!invoice.seller_gstin) {
    issues.push({ type: 'CRITICAL', message: 'Missing seller GSTIN', explanation: '', suggestion: '' });
  } else if (invoice.seller_gstin.length !== 15) {
    issues.push({ type: 'CRITICAL', message: 'Invalid GSTIN length format', explanation: '', suggestion: '' });
  }
  if (!invoice.invoice_date) {
    issues.push({ type: 'CRITICAL', message: 'Missing invoice date', explanation: '', suggestion: '' });
  }

  // Math checks
  invoice.items?.forEach(item => {
    if (!item.hsn_code) {
      issues.push({ type: 'HIGH', message: `Missing HSN code for item: ${item.description || 'Unknown'}`, explanation: '', suggestion: '' });
    }
  });

  const statedSub = invoice.subtotal || 0;
  const statedTax = invoice.total_tax || 0;
  const statedGran = invoice.grand_total || 0;

  if (Math.abs((statedSub + statedTax) - statedGran) > 1) { // 1 unit tolerance
    issues.push({ type: 'HIGH', message: 'Tax calculation mismatch (Subtotal + Tax != Grand Total)', explanation: '', suggestion: '' });
  }

  return issues;
}

export function validateBillOfLading(bl: BillOfLading): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Mandatory
  if (!bl.bl_number) {
    issues.push({ type: 'CRITICAL', message: 'Missing B/L number', explanation: '', suggestion: '' });
  }
  if (!bl.shipper || !bl.consignee) {
    issues.push({ type: 'CRITICAL', message: 'Missing shipper or consignee details', explanation: '', suggestion: '' });
  }

  // Weight check
  let calcWeight = 0;
  bl.goods?.forEach(g => {
    calcWeight += g.weight || 0;
    if (!g.hs_code) {
      issues.push({ type: 'HIGH', message: `Missing HS code for good: ${g.description || 'Unknown'}`, explanation: '', suggestion: '' });
    }
  });

  if (bl.total_weight && Math.abs(bl.total_weight - calcWeight) > 1) {
    issues.push({ type: 'HIGH', message: 'Total weight does not match sum of goods weight', explanation: '', suggestion: '' });
  }

  if (!bl.port_of_loading || !bl.port_of_discharge) {
    issues.push({ type: 'MEDIUM', message: 'Missing port of loading or discharge', explanation: '', suggestion: '' });
  }
  if (!bl.container_number) {
    issues.push({ type: 'MEDIUM', message: 'Missing container number', explanation: '', suggestion: '' });
  }

  return issues;
}

export function validateCrossDocument(invoice: Invoice, bl: BillOfLading): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  const invQty = invoice.items?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;
  const blQty = bl.goods?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;

  if (invQty !== blQty) {
    issues.push({ type: 'CRITICAL', message: `Quantity mismatch: Invoice (${invQty}) vs B/L (${blQty})`, explanation: '', suggestion: '' });
  }

  if (invoice.seller_name && bl.shipper && !invoice.seller_name.toLowerCase().includes(bl.shipper.toLowerCase()) && !bl.shipper.toLowerCase().includes(invoice.seller_name.toLowerCase())) {
    issues.push({ type: 'HIGH', message: 'Party Mismatch: Seller does not match Shipper', explanation: '', suggestion: '' });
  }
  if (invoice.buyer_name && bl.consignee && !invoice.buyer_name.toLowerCase().includes(bl.consignee.toLowerCase()) && !bl.consignee.toLowerCase().includes(invoice.buyer_name.toLowerCase())) {
    issues.push({ type: 'HIGH', message: 'Party Mismatch: Buyer does not match Consignee', explanation: '', suggestion: '' });
  }

  return issues;
}

export function calculateScore(issues: ComplianceIssue[]): { score: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' } {
  let score = 100;
  for (const i of issues) {
    if (i.type === 'CRITICAL') score -= 25;
    else if (i.type === 'HIGH') score -= 15;
    else if (i.type === 'MEDIUM') score -= 10;
    else if (i.type === 'LOW') score -= 5;
  }

  score = Math.max(0, score);
  
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score < 60) riskLevel = 'HIGH';
  else if (score < 85) riskLevel = 'MEDIUM';

  return { score, riskLevel };
}
