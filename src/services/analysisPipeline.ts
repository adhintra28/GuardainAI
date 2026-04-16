import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { encryptJsonPayload } from '@/lib/pii';
import { withTrace } from '@/lib/tracing';
import { explainIssues } from '@/services/aiReasoningService';
import { extractDataFromDocument } from '@/services/aiExtractionService';
import {
  calculateScore,
  validateBillOfLading,
  validateCrossDocument,
  validateInvoice,
} from '@/services/validationEngine';
import { BillOfLading, ComplianceIssue, ComplianceReport, ExtractedData, Invoice } from '@/types';

export interface AnalyzePipelineInput {
  traceId: string;
  invoice?: { buffer: Buffer; mimeType: string };
  billOfLading?: { buffer: Buffer; mimeType: string };
}

export async function runAnalysisPipeline(input: AnalyzePipelineInput): Promise<{
  report: ComplianceReport;
  encryptedExtractedData: string;
}> {
  return withTrace(input.traceId, async () => {
    const extractedData: ExtractedData = {};
    let allIssues: ComplianceIssue[] = [];

    if (input.invoice) {
      const invData = await extractDataFromDocument(input.invoice.buffer, input.invoice.mimeType, 'invoice');
      if (invData) {
        const invoice = invData as Invoice;
        extractedData.invoice = invoice;
        allIssues.push(...validateInvoice(invoice));
      }
    }

    if (input.billOfLading) {
      const blData = await extractDataFromDocument(
        input.billOfLading.buffer,
        input.billOfLading.mimeType,
        'bill_of_lading'
      );
      if (blData) {
        const billOfLading = blData as BillOfLading;
        extractedData.billOfLading = billOfLading;
        allIssues.push(...validateBillOfLading(billOfLading));
      }
    }

    if (extractedData.invoice && extractedData.billOfLading) {
      allIssues.push(...validateCrossDocument(extractedData.invoice, extractedData.billOfLading));
    }

    if (allIssues.length > 0) {
      allIssues = await explainIssues(allIssues);
    }

    const { score, riskLevel } = calculateScore(allIssues);
    const report: ComplianceReport = {
      compliance_score: score,
      risk_level: riskLevel,
      issues: allIssues,
      summary: `Analyzed ${input.invoice ? 'Invoice' : ''}${
        input.invoice && input.billOfLading ? ' & ' : ''
      }${input.billOfLading ? 'B/L' : ''}. Found ${allIssues.length} issues.`,
      recommendation:
        riskLevel === 'HIGH'
          ? 'Critical action required before proceeding. Risk of severe delays and rejections.'
          : 'Review issues and resolve before processing.',
    };

    const encryptedExtractedData = encryptJsonPayload(extractedData);

    try {
      await db.analysisReport.create({
        data: {
          complianceScore: score,
          riskLevel,
          summary: report.summary,
          extractedData: encryptedExtractedData,
          issuesList: JSON.parse(JSON.stringify(allIssues)),
        },
      });
      logger.info('Analysis report persisted to database');
    } catch (dbError) {
      logger.error('Failed to persist analysis report', dbError);
    }

    return { report, encryptedExtractedData };
  });
}
