import { NextRequest, NextResponse } from 'next/server';
import { extractDataFromDocument } from '@/services/aiExtractionService';
import { validateInvoice, validateBillOfLading, validateCrossDocument, calculateScore } from '@/services/validationEngine';
import { explainIssues } from '@/services/aiReasoningService';
import { ComplianceReport, ExtractedData, ComplianceIssue } from '@/types';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const invoiceFile = formData.get('invoice') as File | null;
    const blFile = formData.get('bill_of_lading') as File | null;

    if (!invoiceFile && !blFile) {
      logger.warn('REST API called without any documents provided.');
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    logger.info(`Processing request with ${invoiceFile ? 'Invoice' : ''} ${blFile ? 'B/L' : ''}`);

    const extractedData: ExtractedData = {};
    let allIssues: ComplianceIssue[] = [];

    if (invoiceFile) {
      const buffer = Buffer.from(await invoiceFile.arrayBuffer());
      const invData = await extractDataFromDocument(buffer, invoiceFile.type, 'invoice');
      if (invData) {
        extractedData.invoice = invData as any;
        allIssues.push(...validateInvoice(invData as any));
      }
    }

    if (blFile) {
      const buffer = Buffer.from(await blFile.arrayBuffer());
      const blData = await extractDataFromDocument(buffer, blFile.type, 'bill_of_lading');
      if (blData) {
        extractedData.billOfLading = blData as any;
        allIssues.push(...validateBillOfLading(blData as any));
      }
    }

    if (extractedData.invoice && extractedData.billOfLading) {
      allIssues.push(...validateCrossDocument(extractedData.invoice, extractedData.billOfLading));
    }

    // Pass through AI Reasoning to get deep explanations
    if (allIssues.length > 0) {
      allIssues = await explainIssues(allIssues);
    }

    const { score, riskLevel } = calculateScore(allIssues);

    const report: ComplianceReport = {
      compliance_score: score,
      risk_level: riskLevel,
      issues: allIssues,
      summary: `Analyzed ${invoiceFile ? 'Invoice' : ''} ${invoiceFile && blFile ? '& B/L' : (blFile ? 'B/L' : '')}. Found ${allIssues.length} issues.`,
      recommendation: riskLevel === 'HIGH' ? 'Critical action required before proceeding. Risk of severe delays and rejections.' : 'Review issues and resolve before processing.'
    };

    // Save report to database seamlessly
    try {
      await db.analysisReport.create({
        data: {
          complianceScore: score,
          riskLevel: riskLevel,
          summary: report.summary,
          extractedData: extractedData as any,
          issuesList: allIssues as any,
        }
      });
      logger.info('Analysis Report successfully persisted to database');
    } catch (dbError) {
      logger.error('Database insertion failed', dbError);
    }

    return NextResponse.json({ report, extractedData });
  } catch (error) {
    logger.error('Critical failure in Analysis REST API Route:', error);
    return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
  }
}
